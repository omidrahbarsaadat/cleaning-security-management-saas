# Project progress

Updated: 2026-10-15

## Tenant data foundation (branch `feature/tenant-data-foundation`)
- Security design approved by founder delegation; decisions recorded as ADR-006 to ADR-010 and on Issue #2.
- Prisma 7.10.0 schema and initial migration: Organization, User (Better Auth-compatible fields), OrganizationMembership, Role, MembershipRole, Employee, Client, ServiceSite, AuditLog. Tenant-owned parents have `(organizationId, id)` unique keys; children use composite foreign keys, so cross-tenant links fail in PostgreSQL (verified: Prisma error P2003).
- Server modules: permission catalog and role templates, `resolveTenantContext` (anonymous, unknown organization, missing/revoked/invited membership, suspended organization, disabled user all denied), `requirePermission`, and a reference tenant-scoped ServiceSite service with zod validation and audit events.
- Verified locally 2026-10-15 against PostgreSQL 17 (Docker): 22 unit tests, 11 integration tests (cross-tenant FK rejection, IDOR denial, multi-organization scoping, role boundaries, audit), 3 Playwright tests, lint, typecheck, build, audit 0 vulnerabilities, migration drift check, idempotent fictional seed.
- `deepmerge-ts` and `mysql2` (transitive via the Prisma CLI) are pinned to patched versions through npm `overrides` to clear high-severity advisories.
- Integration tests refuse any database except a local `*_test` database because they reset data.

## Verified
- Repository: [omidrahbarsaadat/cleaning-security-management-saas](https://github.com/omidrahbarsaadat/cleaning-security-management-saas). Default branch is `main`; GitHub reports the repository as public. The owner explicitly authorized continuing while public.
- Feature branch: `foundation/initial-project-docs`; draft [PR #5](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/pull/5).
- Product, architecture, database, security, security design review, compliance, business, roadmap, decisions, deployment, progress, backlog, and resume documentation are present.
- Next.js App Router, TypeScript, Tailwind, German/Persian/English locale resources, regional document tags, Persian RTL, locale-aware formatting, and localized landing routes are present.
- Vitest: 2 files, 7 tests passed. Playwright: 3 browser tests passed for German default routing, Persian RTL, and English switching.
- GitHub Actions run [#37](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/actions/runs/38416750353) passed on commit `1734298` with committed lockfile and immutable action SHA pins: `npm ci`, high-severity audit, lint, typecheck, 7 Vitest tests, Playwright Chromium install, 3 browser tests, and production build. Audit reported 0 vulnerabilities.
- `package-lock.json` is committed (lockfile v3; 253 package entries) and CI uses `npm ci`.
- GitHub Issue #1 was closed with the CI evidence.

## Issues found and corrected
- Removed npm caching because no lockfile existed initially.
- Replaced failing ESLint legacy configuration with native flat config.
- Fixed translation JSON resolution and regional document language tags.
- Added separate root layouts so localized pages set actual HTML `lang` and `dir`.
- Added Playwright coverage and locale-aware formatters.
- Committed a lockfile and simplified CI to `npm ci`.
- Upgraded checkout/setup actions to Node 24-compatible releases, then pinned their verified tag SHAs. Run #34 passed with those exact pins.
- `next dev` (Next.js 16.4, used by the Playwright web server) writes a managed block into `AGENTS.md` when it detects an AI agent, leaving the tree dirty after local e2e runs. The block is now committed as Next.js recommends; `next-env.d.ts`, `test-results/`, and `playwright-report/` are ignored.

## Not verified or not implemented
- Local verification on 2026-10-13 (Windows 10, Node 24.18.0, npm 11.16.0): `npm ci`, audit (0 vulnerabilities), lint, typecheck, 7 Vitest tests, 3 Playwright Chromium tests, and production build all passed.
- No Prisma schema/migration, PostgreSQL runtime setup, authentication, authorization, tenant-aware business functionality, or cross-tenant denial tests.
- No Vercel integration, Preview deployment, database service, or production deployment. Checked 2026-10-13: the repository has no GitHub deployments, commit statuses, or webhooks from Vercel, and the local Vercel CLI (58.0.0) is not logged in.
- `main` is protected (set 2026-10-13 at owner request, verified via GitHub API): pull request required (0 approvals, stale reviews dismissed), required up-to-date `checks` status from GitHub Actions, conversation resolution required, force pushes and deletion blocked; admins can bypass.
- Authentication/tenant isolation proposal is in [SECURITY_DESIGN_REVIEW.md](SECURITY_DESIGN_REVIEW.md); founder review and provider/RLS decisions remain pending before implementation.

## Current milestone
Milestone 1 foundation checks passed on run #37 and locally, including the latest documentation and immutable action pins. The milestone remains open until security design review and initial database design validation are complete. Do not implement authentication or tenant-owned functionality until the founder reviews the proposal.

## Risks and constraints
The repository is public by explicit owner choice; keep secrets and personal data out. A local clone is now used for edits and checks.
