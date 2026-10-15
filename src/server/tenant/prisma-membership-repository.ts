import type { Database } from "@/server/db";
import type { MembershipLookup, MembershipRepository } from "@/server/tenant/context";

export function createPrismaMembershipRepository(db: Database): MembershipRepository {
  return {
    async findMembership(userId, organizationSlug): Promise<MembershipLookup | null> {
      const membership = await db.organizationMembership.findFirst({
        where: { userId, organization: { slug: organizationSlug } },
        select: {
          id: true,
          status: true,
          user: { select: { status: true } },
          organization: { select: { id: true, status: true } },
          roles: { select: { role: { select: { permissions: true } } } },
        },
      });
      if (!membership) return null;

      return {
        organizationId: membership.organization.id,
        organizationStatus: membership.organization.status,
        membershipId: membership.id,
        membershipStatus: membership.status,
        userStatus: membership.user.status,
        rolePermissions: membership.roles.flatMap(({ role }) => role.permissions),
      };
    },
  };
}
