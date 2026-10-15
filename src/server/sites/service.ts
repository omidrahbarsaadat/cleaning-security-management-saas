import { z } from "zod";
import type { Database } from "@/server/db";
import { requirePermission, TenantAccessError, type TenantContext } from "@/server/tenant/context";

// Reference tenant-scoped module: every query derives organizationId from the
// verified TenantContext, never from caller input.

export async function listServiceSites(context: TenantContext, db: Database) {
  requirePermission(context, "sites:read");
  return db.serviceSite.findMany({
    where: { organizationId: context.organizationId, status: "ACTIVE" },
    select: { id: true, name: true, city: true, clientId: true },
    orderBy: { name: "asc" },
  });
}

export async function getServiceSite(context: TenantContext, db: Database, siteId: string) {
  requirePermission(context, "sites:read");
  if (!z.uuid().safeParse(siteId).success) throw new TenantAccessError("NOT_FOUND");
  const site = await db.serviceSite.findUnique({
    where: { organizationId_id: { organizationId: context.organizationId, id: siteId } },
    select: { id: true, name: true, addressLine: true, postalCode: true, city: true, clientId: true },
  });
  if (!site) throw new TenantAccessError("NOT_FOUND");
  return site;
}

export const createServiceSiteInput = z.strictObject({
  clientId: z.uuid(),
  name: z.string().trim().min(1).max(200),
  addressLine: z.string().trim().max(200).optional(),
  postalCode: z.string().trim().regex(/^\d{5}$/).optional(),
  city: z.string().trim().max(100).optional(),
});

export async function createServiceSite(context: TenantContext, db: Database, input: unknown) {
  requirePermission(context, "sites:manage");
  const data = createServiceSiteInput.parse(input);

  return db.$transaction(async (tx) => {
    // Same-tenant ownership check in the service layer; the composite foreign
    // key enforces the same rule in the database.
    const client = await tx.client.findUnique({
      where: { organizationId_id: { organizationId: context.organizationId, id: data.clientId } },
      select: { id: true },
    });
    if (!client) throw new TenantAccessError("NOT_FOUND");

    const site = await tx.serviceSite.create({
      data: { ...data, organizationId: context.organizationId },
      select: { id: true, name: true, clientId: true },
    });

    await tx.auditLog.create({
      data: {
        organizationId: context.organizationId,
        actorUserId: context.userId,
        action: "service_site.created",
        subjectType: "ServiceSite",
        subjectId: site.id,
      },
    });

    return site;
  });
}
