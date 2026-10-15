# Architecture decisions

## ADR-001: Modular monolith
Status: accepted. Keep one deployable application with explicit domain modules for MVP. Reason: lower operating cost and simpler development for an independent founder. Revisit only with measured scaling or organizational needs.

## ADR-002: Tenant isolation is server-side
Status: accepted. Every request resolves a verified membership and permission; tenant query scope is derived from trusted context. Frontend organization IDs are untrusted. Composite tenant keys/FKs are preferred for relational integrity.

## ADR-003: No billing before validation
Status: accepted. Pricing and packaging are hypotheses; defer billing until customer demand and legal/tax obligations are reviewed.

## ADR-004: No authentication implementation before design review
Status: accepted. Compare Auth.js and managed identity options for secure sessions, recovery, EU processing, cost, and maintenance before coding.

## ADR-005: German-first localization
Status: accepted. German is default, English LTR and Persian RTL are supported through dedicated locale resources.

## ADR-006: Security design approved
Status: accepted (2026-10-15 founder delegation recorded on Issue #2). The request flow, TenantContext, permission-based authorization, composite tenant keys/FKs, and verification matrix in `SECURITY_DESIGN_REVIEW.md` are approved as written. The founder delegated the open choices (ADR-007 to ADR-009) to engineering judgment. This supersedes the blocking clause of ADR-004; ADR-004's evaluation criteria still apply to the provider choice.

## ADR-007: Self-hosted Better Auth for authentication
Status: accepted. Use Better Auth (stable 1.7.x at decision time) with sessions and accounts stored in the application's own PostgreSQL in an EU region. Reasons: no additional identity data processor, no per-user cost, TypeScript-native, supports Prisma and Next.js App Router. Auth.js was rejected because its active development has moved toward Better Auth; managed providers (for example Clerk) were rejected for MVP because they add a non-EU processor, cost, and a DPA review. Start with email and password plus email verification; add magic links or passkeys later. Provider code stays behind an adapter that yields an internal user ID. Organization membership and permissions stay in our own tables, not in the auth library's organization plugin, so authorization remains under ADR-002.

## ADR-008: RLS after application scoping is integration-tested
Status: accepted. The MVP enforces isolation through server-side TenantContext, tenant-scoped data functions, composite foreign keys, and automated cross-tenant denial tests against real PostgreSQL. PostgreSQL Row-Level Security is added as defense in depth once transaction-local tenant context, pooling, migrations, and test setup are proven. Tracked in BACKLOG.

## ADR-009: Initial roles and route-based organization selection
Status: accepted. Role templates: owner, administrator, operations manager, supervisor, employee. The customer portal role is deferred until that feature exists. Code checks named permissions, never role names. The active organization is selected through a route segment (`/[locale]/org/[orgSlug]/...`); the server resolves the slug, then verifies an active membership for the authenticated user on every request. The slug selects context only and never proves authorization.

## ADR-010: Prisma 7 stable with the PostgreSQL driver adapter
Status: accepted. Use the latest stable Prisma major (7.10.0 at decision time; npm `latest` pointed to an 8.0 release candidate and was not used) with `@prisma/adapter-pg`. Migrations are generated, reviewed, and committed; they never run automatically on deployment.
