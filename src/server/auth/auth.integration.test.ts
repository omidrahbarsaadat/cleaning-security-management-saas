import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { createAuth } from "@/server/auth/auth";
import { createDatabase } from "@/server/db";
import { resolveTenantContext } from "@/server/tenant/context";
import { createPrismaMembershipRepository } from "@/server/tenant/prisma-membership-repository";

// Runs against a real, disposable local PostgreSQL. All data is fictional.
const url = process.env.DATABASE_URL ?? "";
const parsed = url ? new URL(url) : null;
if (!parsed || !["localhost", "127.0.0.1"].includes(parsed.hostname) || !parsed.pathname.endsWith("_test")) {
  throw new Error("Integration tests require a local DATABASE_URL whose database name ends in _test");
}

const db = createDatabase(url);
process.env.BETTER_AUTH_URL = "http://localhost:3000";
const auth = createAuth(db);
const password = "Correct-Horse-Battery-1";

async function reset() {
  await db.$executeRawUnsafe(
    'TRUNCATE "AuditLog", "ServiceSite", "Client", "Employee", "MembershipRole", "Role", "OrganizationMembership", "Session", "Account", "Verification", "User", "Organization" CASCADE',
  );
}

function cookieFrom(response: Response): string {
  return response.headers
    .getSetCookie()
    .map((cookie) => cookie.split(";")[0])
    .join("; ");
}

beforeAll(async () => {
  vi.spyOn(console, "info").mockImplementation(() => undefined);
  await reset();
});

afterAll(async () => {
  await reset();
  await db.$disconnect();
});

describe("email and password authentication", () => {
  it("stores a hashed password and a UUID user ID, never the plain password", async () => {
    await auth.api.signUpEmail({ body: { name: "Erika Test", email: "erika@example.test", password } });
    const user = await db.user.findUniqueOrThrow({ where: { email: "erika@example.test" } });
    expect(user.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(user.emailVerified).toBe(false);
    const account = await db.account.findFirstOrThrow({ where: { userId: user.id } });
    expect(account.password).toBeTruthy();
    expect(account.password).not.toContain(password);
  });

  it("rejects short passwords", async () => {
    await expect(
      auth.api.signUpEmail({ body: { name: "Kurz", email: "kurz@example.test", password: "short" } }),
    ).rejects.toThrow();
  });

  it("refuses sign-in before email verification", async () => {
    await expect(
      auth.api.signInEmail({ body: { email: "erika@example.test", password } }),
    ).rejects.toMatchObject({ statusCode: 403 });
  });

  it("rejects a wrong password", async () => {
    await db.user.update({ where: { email: "erika@example.test" }, data: { emailVerified: true } });
    await expect(
      auth.api.signInEmail({ body: { email: "erika@example.test", password: "Wrong-Password-123" } }),
    ).rejects.toMatchObject({ statusCode: 401 });
  });

  it("issues a session that resolves to the internal user, then revokes it on sign-out", async () => {
    const response = await auth.api.signInEmail({
      body: { email: "erika@example.test", password },
      asResponse: true,
    });
    expect(response.status).toBe(200);
    const headers = new Headers({ cookie: cookieFrom(response) });

    const session = await auth.api.getSession({ headers });
    const user = await db.user.findUniqueOrThrow({ where: { email: "erika@example.test" } });
    expect(session?.user.id).toBe(user.id);

    await auth.api.signOut({ headers });
    expect(await auth.api.getSession({ headers })).toBeNull();
  });

  it("does not grant organization access through authentication alone", async () => {
    const user = await db.user.findUniqueOrThrow({ where: { email: "erika@example.test" } });
    await db.organization.create({ data: { slug: "fremd-test", name: "Fremd Test GmbH" } });
    await expect(
      resolveTenantContext({ userId: user.id }, "fremd-test", createPrismaMembershipRepository(db)),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});
