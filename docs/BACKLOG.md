# Prioritized backlog

GitHub Issues are the execution tracker. Keep this list synchronized with open issues.

## P0 — Foundation
1. Scaffold Next.js App Router + TypeScript, lint, typecheck, unit and browser test scripts. (Implemented; CI run #33 passed.)
2. Add German-default localization, `de-DE`/`fa-IR` language tags, Persian RTL, and locale-aware formatting. (Implemented; 7 unit and 3 browser tests passed.)
3. Commit the npm lockfile and verify clean `npm ci`. (Completed in [Issue #1](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/1).)
4. Review and merge the foundation PR. (`main` branch protection configured 2026-10-13.)
5. Configure Vercel Preview with isolated non-production data when authorized provider access is available. ([#4](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/4).)

## P1 — Security design and database
6. Security design review and decisions. (Approved 2026-10-15; ADR-006 to ADR-010. [#2](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/2) stays open until the verification matrix is fully tested.)
7. Prisma schema, composite tenant constraints, migration, fictional seed, TenantContext, and cross-tenant integration tests. (Implemented on `feature/tenant-data-foundation`; [#3](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/3).)
8. Integrate Better Auth (ADR-007). (Implemented on `feature/authentication`.) Follow-ups: EU email delivery provider, password reset, session retention policy for IP/user-agent data.
8a. Add PostgreSQL RLS as defense in depth after application scoping is proven (ADR-008).

## P2 — Operations
9. Organization onboarding (create organization, copy role templates, invite members) and membership/role management UI.
10. Add employee, client, site, shift, assignment, and time-entry workflows with server-side tenant scopes.
11. Add cross-tenant denial and role-boundary integration tests before operational release.

## P3 — Integrations and commercialization
12. Configure Vercel previews after provider integration; no production release without explicit approval.
13. Validate commercial packaging before billing.
14. Add subscriptions and billing only after pricing, demand, and legal/tax review.
