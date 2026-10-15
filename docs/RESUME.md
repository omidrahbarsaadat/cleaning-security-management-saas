# Resume point

Last updated: 2026-10-15

## Repository
GitHub: https://github.com/omidrahbarsaadat/cleaning-security-management-saas
Default branch: `main`
Current work branch: `foundation/initial-project-docs`
Draft PR: https://github.com/omidrahbarsaadat/cleaning-security-management-saas/pull/5

## Start here
Read `AGENTS.md`, `docs/ROADMAP.md`, `docs/PROGRESS.md`, and this file before editing.

## Current state
The feature branch contains the documented Next.js App Router/TypeScript/Tailwind scaffold, German/Persian/English locales with regional language tags and Persian RTL, locale-aware date/time/number/EUR formatters, Vitest tests, Playwright smoke tests, GitHub Actions CI, and a committed npm lockfile.

GitHub Actions run #37 (commit `1734298`) passed with immutable action SHA pins: `npm ci`, high-severity audit (0 vulnerabilities), lint, typecheck, 7 Vitest tests, 3 Playwright Chromium tests, and production build. The Playwright suite starts the Next.js dev server and checks German default, Persian RTL, and English switching. The same checks also passed in a local clone on 2026-10-13.

The authentication and tenant isolation proposal is in `docs/SECURITY_DESIGN_REVIEW.md`. Founder review is required before authentication or tenant-owned operations. Provider/session, initial permissions, organization selection, and RLS timing remain undecided. No authentication, tenant resolver, Prisma schema/migration, operational endpoint, or cross-tenant test exists.

The owner authorized keeping the repository public. Keep secrets and real employee/customer data out of Git.

## Tenant data foundation
Security design approved 2026-10-15 (ADR-006 to ADR-010). Branch `feature/tenant-data-foundation` (stacked on the foundation branch) adds the Prisma schema/migration, composite tenant FKs, TenantContext resolver, permission catalog, a reference tenant-scoped service, fictional seed, and PostgreSQL integration tests; CI runs them against a service container.

## Immediate next steps
1. Merge PR #5, then the tenant data foundation PR (owner approval required for merges).
2. Integrate Better Auth (ADR-007) and protect `/[locale]/org/[orgSlug]` routes with `resolveTenantContext`.
3. Organization onboarding and membership/role management; then employees, clients, sites, shifts, assignments, time entries.
4. Configure Vercel Preview only when integration access is available, with isolated non-production data; production needs explicit approval.

## Known constraints
Local PostgreSQL: `npm run db:up` (Docker Desktop must be running). No Vercel connection exists (no Vercel deployments, statuses, or webhooks on GitHub; local Vercel CLI not logged in). `main` is protected (set 2026-10-13 at owner request, verified via GitHub API): pull request required (0 approvals, stale reviews dismissed), required up-to-date `checks` status from GitHub Actions, conversation resolution required, force pushes and deletion blocked; admins can bypass. No database service. Local shell, npm, Playwright, authenticated `gh` CLI, and GitHub Actions work. Never invent local test results.
