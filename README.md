# Cleaning & Security Management SaaS

A multi-tenant operations platform for cleaning and security service companies in Germany. German is the default interface language; English and Persian are included in the initial locale scaffold, with Persian RTL direction.

## Current status

The foundation scaffold and project documentation are on the feature branch `foundation/initial-project-docs`. This is not ready for operational use: authentication, tenant-scoped data access, PostgreSQL/Prisma integration, and production deployment are not implemented. Do not enter real employee or customer data.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL and Prisma planned; database schema and tenant constraints are documented, but no migration exists yet
- Zod is planned for request validation
- Vitest unit tests; Playwright is planned for end-to-end tests
- GitHub Actions CI workflow is configured but has not yet been run

## Development

Use Node.js 22.12 or newer. Run `npm install`, then `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. These commands have not yet been verified in a local environment, and there is no committed lockfile yet.

Read [AGENTS.md](AGENTS.md), [the roadmap](docs/ROADMAP.md), [progress](docs/PROGRESS.md), and [the resume point](docs/RESUME.md) before continuing.

## Security

Authentication and authorization are intentionally not implemented until the provider and tenant-boundary design has been reviewed. Never trust an organization ID from the browser. Do not use production personal data in development or preview environments. No secrets belong in Git.
