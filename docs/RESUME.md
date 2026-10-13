# Resume point

Last updated: 2026-10-13

## Repository
GitHub: https://github.com/omidrahbarsaadat/cleaning-security-management-saas
Default branch: `main`
Current work branch: `foundation/initial-project-docs`
Draft PR: https://github.com/omidrahbarsaadat/cleaning-security-management-saas/pull/5

## Start here
Read `AGENTS.md`, `docs/ROADMAP.md`, `docs/PROGRESS.md`, and this file before editing.

## Current state
The feature branch contains foundation documentation, a Next.js App Router/TypeScript/Tailwind scaffold, German/Persian/English locale resources, RTL direction handling, a Vitest locale configuration test, and GitHub Actions CI. CI run #9 succeeded on commit `023e4762c12bba6626ecf2b853620b867af6b189`: npm install, high-severity audit, lint, typecheck, tests, and production build. The CI job summary does not include the test count. Previous run #8 reported 3 passing tests. No package lockfile is committed.

A proposed authentication and tenant isolation flow is documented in `docs/SECURITY_DESIGN_REVIEW.md`. This is a mandatory review gate before implementing authentication or tenant-sensitive functionality. Identity/session provider, permission templates, and RLS timing are undecided. No authentication, tenant resolver, Prisma schema/migration, operational endpoint, or cross-tenant test exists.

The owner authorized keeping the repository public. Do not place secrets or real employee/customer data in it.

## Immediate next steps
1. Complete independent source/config review and update any concrete findings on the feature branch.
2. Restore a working local checkout or use another verified way to generate a package-lock.json; switch CI to `npm ci` and verify.
3. Add a Playwright smoke test and verify /de, /fa RTL, /en language switching in a browser.
4. Obtain founder review/approval of `docs/SECURITY_DESIGN_REVIEW.md` and auth/session, roles, and RLS decisions.
5. After design approval, implement and validate the Prisma schema/migrations with composite tenant constraints and fictional seed data.
6. Implement tenant-scoped authorization and cross-tenant/role denial tests before operational workflows.
7. Configure Vercel preview only when integration access is available, using isolated non-production data. No production deployment without explicit approval.

## Known constraints
Local shell setup previously failed with `helper_unknown_error: setup refresh had errors`. Vercel integration tools are unavailable in the current execution context. GitHub API file/issue/PR operations work. Never invent local test results.
