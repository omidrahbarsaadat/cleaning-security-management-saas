# Prioritized backlog

GitHub issues are the execution tracker. Keep this list synchronized with open issues.

## P0 — Foundation
1. Scaffold Next.js App Router + TypeScript, lint, typecheck, and test scripts. (Done; verify local/browser behavior.)
2. Add German-default localization resources and RTL direction handling for Persian. (Done in scaffold; browser QA remains.)
3. Make dependency installation reproducible with a committed lockfile and `npm ci`. (Open: [#1](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/1).)
4. Add Playwright smoke coverage and verify locale routing in a browser.
5. Review the complete foundation PR, repository visibility, and branch protection settings.
6. Configure a Vercel preview with isolated non-production data when integration access is available. (Open: [#4](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/4).)

## P1 — Security design and database
7. Review proposed authentication and tenant isolation design in `docs/SECURITY_DESIGN_REVIEW.md`. (Open: [#2](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/2).)
8. Select identity/session approach and decide permission templates, organization selection, and RLS timing.
9. Validate initial Prisma schema, constraints, migrations, and fictional local seed data. (Open: [#3](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/issues/3).)

## P2 — Operations
10. Implement organization/membership/permissions only after the security design review.
11. Add employee, client, site, shift, assignment, and time-entry workflows with server-side tenant scopes.
12. Add cross-tenant denial and role-boundary integration tests before operational release.

## P3 — Integrations and commercialization
13. Configure Vercel previews after authorized provider access; no production release without explicit approval.
14. Validate commercial packaging before billing.
15. Add subscriptions and billing only after pricing, demand, and legal/tax review.
