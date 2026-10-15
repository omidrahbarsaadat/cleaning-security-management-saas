// Named permissions checked by server code. Roles are editable bundles of
// these permissions; code never checks role keys (ADR-009).
export const PERMISSIONS = [
  "organization:manage",
  "members:read",
  "members:manage",
  "roles:manage",
  "employees:read",
  "employees:manage",
  "clients:read",
  "clients:manage",
  "sites:read",
  "sites:manage",
  "audit:read",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const permissionSet: ReadonlySet<string> = new Set(PERMISSIONS);

export function isPermission(value: string): value is Permission {
  return permissionSet.has(value);
}

export type RoleTemplateKey =
  | "owner"
  | "administrator"
  | "operations_manager"
  | "supervisor"
  | "employee";

// Initial templates copied into each new organization as editable roles.
// The customer portal role is deferred until that feature exists.
export const ROLE_TEMPLATES: Record<RoleTemplateKey, readonly Permission[]> = {
  owner: PERMISSIONS,
  administrator: PERMISSIONS.filter((permission) => permission !== "organization:manage"),
  operations_manager: [
    "members:read",
    "employees:read",
    "employees:manage",
    "clients:read",
    "clients:manage",
    "sites:read",
    "sites:manage",
  ],
  supervisor: ["members:read", "employees:read", "clients:read", "sites:read"],
  employee: ["sites:read"],
};
