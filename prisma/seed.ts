// Fictional development data only. Never add real employees or customers.
import { ROLE_TEMPLATES, type RoleTemplateKey } from "../src/server/authz/permissions";
import { createDatabase } from "../src/server/db";

const url = process.env.DATABASE_URL ?? "";
if (!["localhost", "127.0.0.1"].includes(url ? new URL(url).hostname : "")) {
  throw new Error("Seeding is only allowed against a local DATABASE_URL");
}

const db = createDatabase(url);

async function main() {
  const organization = await db.organization.upsert({
    where: { slug: "muster-dienste" },
    update: {},
    create: { slug: "muster-dienste", name: "Muster Reinigung & Sicherheit GmbH" },
  });

  const roles = new Map<RoleTemplateKey, string>();
  for (const [key, permissions] of Object.entries(ROLE_TEMPLATES) as [RoleTemplateKey, readonly string[]][]) {
    const role = await db.role.upsert({
      where: { organizationId_key: { organizationId: organization.id, key } },
      update: { permissions: [...permissions] },
      create: { organizationId: organization.id, key, name: key, permissions: [...permissions], isTemplate: true },
    });
    roles.set(key, role.id);
  }

  const people: [string, string, RoleTemplateKey][] = [
    ["inhaberin@example.test", "Erika Musterfrau", "owner"],
    ["einsatzleitung@example.test", "Max Mustermann", "operations_manager"],
    ["mitarbeiter@example.test", "Jonas Beispiel", "employee"],
  ];
  for (const [email, name, roleKey] of people) {
    const user = await db.user.upsert({ where: { email }, update: {}, create: { email, name } });
    const membership = await db.organizationMembership.upsert({
      where: { organizationId_userId: { organizationId: organization.id, userId: user.id } },
      update: {},
      create: { organizationId: organization.id, userId: user.id, status: "ACTIVE" },
    });
    await db.membershipRole.upsert({
      where: { membershipId_roleId: { membershipId: membership.id, roleId: roles.get(roleKey)! } },
      update: {},
      create: { organizationId: organization.id, membershipId: membership.id, roleId: roles.get(roleKey)! },
    });
  }

  if ((await db.client.count({ where: { organizationId: organization.id } })) === 0) {
    const client = await db.client.create({
      data: { organizationId: organization.id, name: "Beispiel Immobilien KG" },
    });
    await db.serviceSite.create({
      data: {
        organizationId: organization.id,
        clientId: client.id,
        name: "Bürohaus Musterstraße",
        addressLine: "Musterstraße 1",
        postalCode: "10115",
        city: "Berlin",
      },
    });
  }
}

main()
  .then(() => console.log("Seeded fictional organization 'muster-dienste'"))
  .finally(() => db.$disconnect());
