# Roadmap

## Milestone 1 — Foundation (in progress)
Acceptance:
- [x] Project instructions and product, architecture, database, security, compliance, business, deployment, roadmap, decision, progress, backlog, and resume docs exist.
- [x] Next.js TypeScript scaffold and German/Persian/English locale resources exist; HTML uses regional language tags and Persian is RTL.
- [x] Locale-aware date, time, number, and EUR formatting helpers have unit coverage.
- [x] GitHub Actions runs lockfile-based install, high-severity dependency audit, lint, typecheck, unit tests, Playwright browser tests, and production build.
- [x] Playwright verifies German default routing, Persian RTL, English switching, and starts the Next.js development server.
- [x] Package lockfile is committed and CI uses `npm ci`.
- [x] Authentication and tenant-isolation threat model and proposed request flow are documented in `docs/SECURITY_DESIGN_REVIEW.md`.
- [ ] Founder reviews the proposed authentication/session and tenant-isolation design before implementation.
- [ ] Decide and validate the initial Prisma schema/migration plan after design review.
- [ ] Vercel Preview integration is optional to foundation completion and must use isolated non-production data.

CI run #33 passed all implementation checks listed above. Run #34 will verify the latest immutable action SHA pins. Security design review and initial database design validation remain before this milestone can close.

## Milestone 2 — Shared operations
Organizations, membership/permissions, employees, clients, sites, shifts, assignments, time entries. Acceptance includes tenant-scoped APIs and cross-tenant denial tests.

## Milestone 3 — Cleaning
Tasks, schedules, checklists, completion reports, quality inspections.

## Milestone 4 — Security
Guard assignment workflows, incidents, patrol reports, qualification tracking, handovers.

## Milestone 5 — Commercial SaaS
Validated plans, onboarding, usage limits, billing integration, administration.

## Milestone 6 — Production readiness
Independent security/privacy review, performance checks, backup/restore, deployment process, pilot, release approval.

No milestone is complete until evidence and actual check results are recorded in PROGRESS.
