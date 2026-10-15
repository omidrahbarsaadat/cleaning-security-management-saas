import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { getDatabase, type Database } from "@/server/db";

// Self-hosted Better Auth (ADR-007). Users, sessions, and accounts live in our
// own PostgreSQL. Organization membership and permissions stay in our tables
// and are resolved separately by resolveTenantContext.

const isProduction = process.env.NODE_ENV === "production";

async function sendVerificationEmail({ user, url }: { user: { email: string }; url: string }) {
  if (isProduction) {
    // No email provider is selected yet; refuse rather than silently dropping
    // verification mail or leaking tokens to logs.
    throw new Error("Email delivery is not configured");
  }
  console.info(`[dev] Verification link for ${user.email}: ${url}`);
}

export function createAuth(db: Database) {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (isProduction && (!secret || secret.length < 32)) {
    throw new Error("BETTER_AUTH_SECRET must be set to at least 32 characters in production");
  }

  return betterAuth({
    secret,
    baseURL: process.env.BETTER_AUTH_URL,
    database: prismaAdapter(db, { provider: "postgresql", transaction: true }),
    advanced: { database: { generateId: "uuid" } },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    rateLimit: { enabled: true },
    plugins: [nextCookies()],
  });
}

export type Auth = ReturnType<typeof createAuth>;

const globalForAuth = globalThis as unknown as { auth?: Auth };

// Created lazily so builds and static pages do not require DATABASE_URL.
export function getAuth(): Auth {
  globalForAuth.auth ??= createAuth(getDatabase());
  return globalForAuth.auth;
}
