import { z } from "zod";
import { isPermission, type Permission } from "@/server/authz/permissions";

// Request-scoped, immutable authorization context. Domain services require it
// as an argument and derive every tenant query scope from organizationId.
export type TenantContext = Readonly<{
  userId: string;
  organizationId: string;
  membershipId: string;
  permissions: ReadonlySet<Permission>;
}>;

export type TenantAccessErrorCode = "UNAUTHENTICATED" | "NOT_FOUND" | "FORBIDDEN";

export class TenantAccessError extends Error {
  constructor(readonly code: TenantAccessErrorCode) {
    super(`Tenant access denied: ${code}`);
    this.name = "TenantAccessError";
  }
}

export type MembershipLookup = {
  organizationId: string;
  organizationStatus: "ACTIVE" | "SUSPENDED" | "ARCHIVED";
  membershipId: string;
  membershipStatus: "INVITED" | "ACTIVE" | "REVOKED";
  userStatus: "ACTIVE" | "DISABLED";
  rolePermissions: readonly string[];
};

export interface MembershipRepository {
  // Must match on both the authenticated user ID and the organization slug.
  findMembership(userId: string, organizationSlug: string): Promise<MembershipLookup | null>;
}

export const organizationSlugSchema = z
  .string()
  .regex(/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/);

// The slug comes from the route and only selects context; authorization comes
// from the server-side membership lookup for the authenticated user.
export async function resolveTenantContext(
  principal: { userId: string } | null,
  organizationSlug: string,
  repository: MembershipRepository,
): Promise<TenantContext> {
  if (!principal) throw new TenantAccessError("UNAUTHENTICATED");

  const slug = organizationSlugSchema.safeParse(organizationSlug);
  // Unknown organizations and missing memberships are indistinguishable to
  // the caller to avoid organization enumeration.
  if (!slug.success) throw new TenantAccessError("NOT_FOUND");

  const membership = await repository.findMembership(principal.userId, slug.data);
  if (!membership) throw new TenantAccessError("NOT_FOUND");

  if (
    membership.userStatus !== "ACTIVE" ||
    membership.organizationStatus !== "ACTIVE" ||
    membership.membershipStatus !== "ACTIVE"
  ) {
    throw new TenantAccessError("FORBIDDEN");
  }

  // Unknown permission strings stored in the database grant nothing.
  const permissions = new Set(membership.rolePermissions.filter(isPermission));

  return Object.freeze({
    userId: principal.userId,
    organizationId: membership.organizationId,
    membershipId: membership.membershipId,
    permissions,
  });
}

export function requirePermission(context: TenantContext, permission: Permission): void {
  if (!context.permissions.has(permission)) throw new TenantAccessError("FORBIDDEN");
}
