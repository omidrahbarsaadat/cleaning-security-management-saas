# Roadmap

## Milestone 1 — Foundation (in progress)
Acceptance:
- [x] Project instructions and product, architecture, database, security, compliance, business, deployment, roadmap, decision, progress, backlog, and resume docs exist.
- [x] Next.js TypeScript app scaffold and dedicated German/Persian/English locale resources exist; Persian locale wrapper sets RTL.
- [x] GitHub Actions runs install, high-severity dependency audit, lint, typecheck, unit tests, and production build.
- [ ] Commit a package lockfile and verify a repeatable `npm ci` install.
- [ ] Start the dev server and verify the German default route, language switching, and RTL behavior in a browser.
- [ ] Review the authentication and tenant isolation design before implementing auth or tenant-sensitive features.
- [ ] Decide and validate the initial Prisma schema/migration plan.
- [ ] Vercel preview integration is optional to foundation completion and must use isolated non-production data.

Do not mark complete until remaining required acceptance items are evidenced in PROGRESS.

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
