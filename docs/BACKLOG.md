# Prioritized backlog

GitHub Issues are the execution tracker. Keep this list synchronized with open issues.

## P0 — Foundation
1. Scaffold Next.js App Router + TypeScript, lint, typecheck, unit and browser test scripts. (Implemented; CI run #28 passed.)
2. Add German-default localization, `de-DE`/`fa-IR` language tags, Persian RTL, and locale-aware formatting. (Implemented; 7 unit and 3 browser tests passed.)
3. Commit the npm lockfile and verify clean `npm ci`. (Completed in [Issue #1](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/1).)
4. Review the foundation PR and repository visibility/branch-protection settings.
5. Configure Vercel Preview with isolated non-production data when authorized provider access is available. ([#4](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/4).)

## P1 — Security design and database
6. Review proposed authentication and tenant isolation in `docs/SECURITY_DESIGN_REVIEW.md`. ([#2](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/2).)
7. Select identity/session approach and decide permission templates, organization selection, and RLS timing.
8. Validate initial Prisma schema, constraints, migrations, and fictional local seed data. ([#3](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/3).)

## P2 — Operations
9. Implement organization/membership/permissions only after security design review.
10. Add employee, client, site, shift, assignment, and time-entry workflows with server-side tenant scopes.
11. Add cross-tenant denial and role-boundary integration tests before operational release.

## P3 — Integrations and commercialization
12. Configure Vercel previews after provider integration; no production release without explicit approval.
13. Validate commercial packaging before billing.
14. Add subscriptions and billing only after pricing, demand, and legal/tax review.
