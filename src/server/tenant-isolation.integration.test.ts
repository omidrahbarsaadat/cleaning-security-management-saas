import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ROLE_TEMPLATES, type RoleTemplateKey } from "@/server/authz/permissions";
import { createDatabase } from "@/server/db";
import { createServiceSite, getServiceSite, listServiceSites } from "@/server/sites/service";
import { resolveTenantContext } from "@/server/tenant/context";
import { createPrismaMembershipRepository } from "@/server/tenant/prisma-membership-repository";

// Runs against a real, disposable local PostgreSQL. All data is fictional.
// Tests reset all tables, so they refuse anything but a local *_test database.
const url = process.env.DATABASE_URL ?? "";
const parsed = url ? new URL(url) : null;
if (!parsed || !["localhost", "127.0.0.1"].includes(parsed.hostname) || !parsed.pathname.endsWith("_test")) {
  throw new Error("Integration tests require a local DATABASE_URL whose database name ends in _test");
}

const db = createDatabase(url);
const repository = createPrismaMembershipRepository(db);

type Fixture = Awaited<ReturnType<typeof seed>>;
let f: Fixture;

async function reset() {
  await db.$executeRawUnsafe(
    'TRUNCATE "AuditLog", "ServiceSite", "Client", "Employee", "MembershipRole", "Role", "OrganizationMembership", "Session", "Account", "Verification", "User", "Organization" CASCADE',
  );
}

async function seed() {
  const [alpha, beta] = await Promise.all([
    db.organization.create({ data: { slug: "alpha-test", name: "Alpha Test GmbH" } }),
    db.organization.create({ data: { slug: "beta-test", name: "Beta Test GmbH" } }),
  ]);

  async function role(organizationId: string, key: RoleTemplateKey) {
    return db.role.create({
      data: { organizationId, key, name: key, permissions: [...ROLE_TEMPLATES[key]], isTemplate: true },
    });
  }
  const roles = {
    alphaManager: await role(alpha.id, "operations_manager"),
    alphaEmployee: await role(alpha.id, "employee"),
    betaOwner: await role(beta.id, "owner"),
  };

  async function member(
    email: string,
    grants: { organizationId: string; roleId: string; status?: "ACTIVE" | "REVOKED" }[],
  ) {
    const user = await db.user.create({ data: { email, name: email.split("@")[0] } });
    for (const grant of grants) {
      const membership = await db.organizationMembership.create({
        data: { organizationId: grant.organizationId, userId: user.id, status: grant.status ?? "ACTIVE" },
      });
      await db.membershipRole.create({
        data: { organizationId: grant.organizationId, membershipId: membership.id, roleId: grant.roleId },
      });
    }
    return user;
  }

  const users = {
    alphaManager: await member("manager@alpha.example", [{ organizationId: alpha.id, roleId: roles.alphaManager.id }]),
    alphaEmployee: await member("employee@alpha.example", [{ organizationId: alpha.id, roleId: roles.alphaEmployee.id }]),
    alphaRevoked: await member("revoked@alpha.example", [
      { organizationId: alpha.id, roleId: roles.alphaManager.id, status: "REVOKED" },
    ]),
    betaOwner: await member("owner@beta.example", [{ organizationId: beta.id, roleId: roles.betaOwner.id }]),
    multi: await member("multi@example.test", [
      { organizationId: alpha.id, roleId: roles.alphaEmployee.id },
      { organizationId: beta.id, roleId: roles.betaOwner.id },
    ]),
  };

  const alphaClient = await db.client.create({ data: { organizationId: alpha.id, name: "Alpha Kunde" } });
  const betaClient = await db.client.create({ data: { organizationId: beta.id, name: "Beta Kunde" } });
  const alphaSite = await db.serviceSite.create({
    data: { organizationId: alpha.id, clientId: alphaClient.id, name: "Alpha Objekt" },
  });
  const betaSite = await db.serviceSite.create({
    data: { organizationId: beta.id, clientId: betaClient.id, name: "Beta Objekt" },
  });

  return { alpha, beta, roles, users, alphaClient, betaClient, alphaSite, betaSite };
}

const contextFor = (userId: string, slug: string) => resolveTenantContext({ userId }, slug, repository);

beforeAll(async () => {
  await reset();
  f = await seed();
});

afterAll(async () => {
  await reset();
  await db.$disconnect();
});

describe("database tenant constraints", () => {
  it("rejects a service site that links a client from another organization", async () => {
    await expect(
      db.serviceSite.create({
        data: { organizationId: f.alpha.id, clientId: f.betaClient.id, name: "Cross-tenant" },
      }),
    ).rejects.toMatchObject({ code: "P2003" });
  });

  it("rejects assigning another organization's role to a membership", async () => {
    const membership = await db.organizationMembership.findFirstOrThrow({
      where: { organizationId: f.alpha.id, userId: f.users.alphaEmployee.id },
    });
    await expect(
      db.membershipRole.create({
        data: { organizationId: f.alpha.id, membershipId: membership.id, roleId: f.roles.betaOwner.id },
      }),
    ).rejects.toMatchObject({ code: "P2003" });
    await expect(
      db.membershipRole.create({
        data: { organizationId: f.beta.id, membershipId: membership.id, roleId: f.roles.betaOwner.id },
      }),
    ).rejects.toMatchObject({ code: "P2003" });
  });
});

describe("tenant context resolution", () => {
  it("denies access to an organization the user does not belong to", async () => {
    await expect(contextFor(f.users.alphaManager.id, "beta-test")).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("denies a revoked membership even though the user exists", async () => {
    await expect(contextFor(f.users.alphaRevoked.id, "alpha-test")).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("scopes a multi-organization user to the selected organization's permissions", async () => {
    const inAlpha = await contextFor(f.users.multi.id, "alpha-test");
    const inBeta = await contextFor(f.users.multi.id, "beta-test");
    expect(inAlpha.organizationId).toBe(f.alpha.id);
    expect(inAlpha.permissions.has("sites:manage")).toBe(false);
    expect(inBeta.organizationId).toBe(f.beta.id);
    expect(inBeta.permissions.has("sites:manage")).toBe(true);
  });
});

describe("tenant-scoped service functions", () => {
  it("lists only the caller's organization's sites", async () => {
    const sites = await listServiceSites(await contextFor(f.users.alphaManager.id, "alpha-test"), db);
    expect(sites.map((site) => site.id)).toEqual([f.alphaSite.id]);
  });

  it("returns NOT_FOUND for another organization's site ID (IDOR)", async () => {
    const context = await contextFor(f.users.alphaManager.id, "alpha-test");
    await expect(getServiceSite(context, db, f.betaSite.id)).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(getServiceSite(context, db, f.alphaSite.id)).resolves.toMatchObject({ id: f.alphaSite.id });
  });

  it("rejects creating a site for another organization's client", async () => {
    const context = await contextFor(f.users.alphaManager.id, "alpha-test");
    await expect(
      createServiceSite(context, db, { clientId: f.betaClient.id, name: "Fremdobjekt" }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(await db.serviceSite.count({ where: { name: "Fremdobjekt" } })).toBe(0);
  });

  it("rejects input that carries a client-supplied organizationId", async () => {
    const context = await contextFor(f.users.alphaManager.id, "alpha-test");
    await expect(
      createServiceSite(context, db, { clientId: f.alphaClient.id, name: "X", organizationId: f.beta.id }),
    ).rejects.toMatchObject({ name: "ZodError" });
  });

  it("denies an employee from creating sites", async () => {
    const context = await contextFor(f.users.alphaEmployee.id, "alpha-test");
    await expect(
      createServiceSite(context, db, { clientId: f.alphaClient.id, name: "Nicht erlaubt" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("creates a same-tenant site and writes a tenant-scoped audit event", async () => {
    const context = await contextFor(f.users.alphaManager.id, "alpha-test");
    const site = await createServiceSite(context, db, {
      clientId: f.alphaClient.id,
      name: "Neues Objekt",
      postalCode: "10115",
      city: "Berlin",
    });
    const audit = await db.auditLog.findFirstOrThrow({ where: { subjectId: site.id } });
    expect(audit).toMatchObject({
      organizationId: f.alpha.id,
      actorUserId: f.users.alphaManager.id,
      action: "service_site.created",
    });
  });
});
