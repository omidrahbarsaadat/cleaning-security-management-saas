import { describe, expect, it } from "vitest";
import {
  requirePermission,
  resolveTenantContext,
  type MembershipLookup,
  type MembershipRepository,
} from "@/server/tenant/context";

const activeLookup: MembershipLookup = {
  organizationId: "org-a",
  organizationStatus: "ACTIVE",
  membershipId: "membership-a",
  membershipStatus: "ACTIVE",
  userStatus: "ACTIVE",
  rolePermissions: ["sites:read", "clients:read"],
};

function repositoryWith(
  rows: Record<string, MembershipLookup>,
): MembershipRepository & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    async findMembership(userId, slug) {
      calls.push(`${userId}@${slug}`);
      return rows[`${userId}@${slug}`] ?? null;
    },
  };
}

describe("resolveTenantContext", () => {
  it("rejects anonymous requests before any lookup", async () => {
    const repository = repositoryWith({});
    await expect(resolveTenantContext(null, "alpha", repository)).rejects.toMatchObject({
      code: "UNAUTHENTICATED",
    });
    expect(repository.calls).toEqual([]);
  });

  it("rejects malformed slugs without querying", async () => {
    const repository = repositoryWith({});
    await expect(
      resolveTenantContext({ userId: "user-a" }, "../Alpha", repository),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(repository.calls).toEqual([]);
  });

  it("looks up membership by authenticated user and route slug", async () => {
    const repository = repositoryWith({ "user-a@alpha": activeLookup });
    const context = await resolveTenantContext({ userId: "user-a" }, "alpha", repository);
    expect(repository.calls).toEqual(["user-a@alpha"]);
    expect(context).toMatchObject({
      userId: "user-a",
      organizationId: "org-a",
      membershipId: "membership-a",
    });
    expect(Object.isFrozen(context)).toBe(true);
  });

  it("denies a user without membership in the requested organization", async () => {
    const repository = repositoryWith({ "user-a@alpha": activeLookup });
    await expect(
      resolveTenantContext({ userId: "user-a" }, "beta", repository),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it.each([
    ["revoked membership", { membershipStatus: "REVOKED" }],
    ["pending invitation", { membershipStatus: "INVITED" }],
    ["suspended organization", { organizationStatus: "SUSPENDED" }],
    ["archived organization", { organizationStatus: "ARCHIVED" }],
    ["disabled user", { userStatus: "DISABLED" }],
  ] as const)("denies a %s", async (_label, override) => {
    const repository = repositoryWith({ "user-a@alpha": { ...activeLookup, ...override } });
    await expect(
      resolveTenantContext({ userId: "user-a" }, "alpha", repository),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("ignores unknown permission strings from storage", async () => {
    const repository = repositoryWith({
      "user-a@alpha": { ...activeLookup, rolePermissions: ["sites:read", "*", "admin"] },
    });
    const context = await resolveTenantContext({ userId: "user-a" }, "alpha", repository);
    expect([...context.permissions]).toEqual(["sites:read"]);
  });
});

describe("requirePermission", () => {
  it("allows granted and denies missing permissions", async () => {
    const repository = repositoryWith({ "user-a@alpha": activeLookup });
    const context = await resolveTenantContext({ userId: "user-a" }, "alpha", repository);
    expect(() => requirePermission(context, "sites:read")).not.toThrow();
    expect(() => requirePermission(context, "sites:manage")).toThrow(
      expect.objectContaining({ code: "FORBIDDEN" }),
    );
  });
});
