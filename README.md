# Cleaning & Security Management SaaS

A multi-tenant operations platform for cleaning and security service companies in Germany. German is the default interface language; English and Persian are included in the locale scaffold, with Persian right-to-left document direction.

## Current status

The foundation scaffold and project documentation are on the feature branch [foundation/initial-project-docs](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/tree/foundation/initial-project-docs), in draft [PR #5](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/pull/5). Authentication, tenant-scoped data access, PostgreSQL/Prisma integration, and deployment are not implemented. Do not enter real employee or customer data.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL and Prisma planned; schema and tenant constraints are documented, but no migration exists yet
- Zod planned for request validation
- ESLint, Vitest, and GitHub Actions CI; Playwright browser coverage remains planned

## Development

Use Node.js 22.12 or newer. Run `npm install`, then `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. GitHub Actions validates install, audit, lint, typecheck, tests, and build. A lockfile is generated in CI and retained as a short-lived artifact while a lockfile is not committed; install locally with `npm install` until the lockfile bootstrap is resolved.

No local dependency installation, application startup, or browser test has been verified in this execution environment. See [project progress](docs/PROGRESS.md) for current CI evidence.

Read [AGENTS.md](AGENTS.md), [the roadmap](docs/ROADMAP.md), [progress](docs/PROGRESS.md), and [the resume point](docs/RESUME.md) before continuing.

## Security

Authentication and authorization are intentionally not implemented until the provider and tenant-boundary design has been reviewed. Read [the security design review](docs/SECURITY_DESIGN_REVIEW.md). Never trust an organization ID from the browser. Do not use production personal data in development or preview environments. No secrets belong in Git.
