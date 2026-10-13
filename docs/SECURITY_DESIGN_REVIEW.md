# Authentication and tenant isolation design review

Status: proposed for founder review; no authentication or tenant-owned business operation is implemented.

## Scope and security goals

Protect company, employee, customer, site, schedule, time, incident, and document data from unauthenticated access, cross-tenant access, privilege escalation, and accidental disclosure. This design does not establish legal compliance or certify the system.

## Threat model

Assume a user can manipulate every URL, form field, API body, cookie, and organization identifier; reuse stale links; hold memberships in multiple organizations; and cause concurrent requests. Also account for compromised credentials, a revoked membership with an active session, accidental tenant mismatches in relationships, and preview/production environment confusion.

Primary invariants:

1. No protected request is authorized from client UI state alone.
2. Every request resolves an authenticated principal and a currently active membership on the server.
3. Every permission decision is checked server-side for the requested action and resource.
4. Every tenant-owned query is scoped to the verified organization context.
5. Relational constraints prevent linking records from different organizations.
6. Revocation takes effect promptly; stale organization selection cannot restore access.

## Proposed request flow

1. Authentication establishes a stable internal user ID. Session design and identity provider remain an explicit decision; keep provider-specific code behind an adapter.
2. Resolve session on the server and reject missing, expired, or invalid sessions.
3. Resolve the requested organization context from a route or server session, then query OrganizationMembership using both the internal user ID and organization ID. A client-supplied organization ID may select context but never proves authorization.
4. Reject inactive organizations or memberships. Load the user's effective permissions from server-managed role/permission assignments.
5. Create an immutable request-scoped TenantContext containing user ID, organization ID, membership ID, and effective permissions.
6. Domain service functions require TenantContext as an argument. Do not expose general-purpose tenant queries to UI code.
7. Validate inputs with schemas, authorize the action, execute tenant-scoped reads/writes, and record a minimal audit event for sensitive mutations.
8. Return only fields needed by the caller. Do not include secrets or unnecessary personal data in logs or responses.

## Tenant data model controls

- Store organizationId on every tenant-owned table.
- Define composite unique keys on (organizationId, id) for parent records.
- Use composite foreign keys for relationships such as Assignment to Shift and Employee, and ServiceSite to Client, so the organization IDs must match.
- Use explicit status and deletion/retention behavior. Avoid cascading deletion of audit or operational history without a reviewed retention policy.
- Index tenant-scoped access patterns, typically starting with organizationId.
- Keep platform administration separate from company permissions. A platform-level support operation must be explicit, narrowly permissioned, and audited.

## Authorization policy

Use named permissions (for example employees:read, employees:manage, shifts:assign, time_entries:correct, incidents:read, incidents:create) assigned through organization roles. Roles are editable bundles of permissions; code checks permissions, not role-name strings. Begin with owner, administrator, operations manager, supervisor, employee, and customer portal role templates. Do not expose customer portal permissions until that feature exists. Platform super-admin is a separate platform principal and must never be treated as a normal organization membership.

For sensitive mutations, require the narrow permission, validate same-tenant resource ownership, and write an audit event containing actor, organization, action, subject reference, timestamp, and minimized metadata.

## Database defense in depth

Application-level tenant scoping and composite relational constraints are required. PostgreSQL Row-Level Security may be added only after connection pooling, transaction-local tenant context, background jobs, migrations, owner/bypass roles, and test setup are designed. Do not keep tenant context in reusable connection session state. RLS is not a replacement for application authorization.

## Verification matrix before operational release

- Anonymous request cannot read or mutate any protected resource.
- User A cannot read, update, delete, or infer User B's tenant resources by changing IDs.
- A user with memberships in Organizations A and B can access only the explicitly selected and verified organization context for each request.
- Inactive/revoked membership is denied even when the user has an otherwise valid session.
- Employee cannot invoke manager-only actions by crafting a request.
- Related IDs from different organizations are rejected at both service and database constraint layers.
- Organization switch does not reuse cached or memoized data from the previous tenant.
- Audit records are tenant-scoped and cannot be modified by ordinary users.
- Preview credentials and data are isolated from production.

## Decisions required before implementation

1. Review and approve or amend this request flow and permission model.
2. Select an authentication/session approach after comparing maintenance, account recovery, cost, and data-processing terms. No provider has been selected or connected.
3. Decide whether the MVP starts without RLS and adds it after integration tests, or implements RLS as part of the first database migration after transaction semantics are proven.
4. Confirm initial role templates and whether organization selection should use a route segment.

## Current implementation boundary

This is a design proposal only. No authentication, session, tenant resolver, RBAC service, Prisma schema, operational endpoint, or cross-tenant test exists yet. Implement these only after design review and provider/authorization decisions.
