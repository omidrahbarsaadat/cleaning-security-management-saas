# Cleaning & Security Management SaaS

A multi-tenant operations platform for cleaning and security service companies in Germany. German is the default interface language; English and Persian are included in the locale scaffold, with Persian right-to-left document direction.

## Current status

The foundation scaffold is in [PR #5](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/pull/5). The tenant data foundation (Prisma schema, composite tenant constraints, permission catalog, TenantContext resolver, and cross-tenant tests against PostgreSQL) follows on `feature/tenant-data-foundation`. Email/password authentication with Better Auth (ADR-007) follows on `feature/authentication`. Operational modules and deployment are not implemented yet. Do not enter real employee or customer data.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL 17 with Prisma 7 (`@prisma/adapter-pg`); composite tenant foreign keys
- Zod for input validation
- ESLint, Vitest, Playwright, and GitHub Actions CI

## Development

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`; the root route redirects to German. Available locales are `/de`, `/fa` (RTL), and `/en`.

Local database (Docker, fictional credentials):

```sh
cp .env.example .env   # then set BETTER_AUTH_SECRET to a random local value
npm run db:up
npm run db:migrate
npm run db:seed
```

Run checks:

```sh
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Integration tests reset all tables, so they only run against a local database whose name ends in `_test`:

```sh
docker compose exec postgres createdb -U app cleaning_security_test
DATABASE_URL="postgresql://app:app@localhost:5432/cleaning_security_test?schema=public" npx prisma migrate deploy
DATABASE_URL="postgresql://app:app@localhost:5432/cleaning_security_test?schema=public" npm run test:integration
```

CI runs all of the above against a PostgreSQL service container, plus a migration drift check. See [project progress](docs/PROGRESS.md) for evidence.

Read [AGENTS.md](AGENTS.md), [the roadmap](docs/ROADMAP.md), [progress](docs/PROGRESS.md), and [the resume point](docs/RESUME.md) before continuing.

## Security

The tenant-boundary design is approved (ADR-006 to ADR-009). Server code resolves a TenantContext from the authenticated user and the route's organization slug, then scopes every query to that organization. Read [the security design review](docs/SECURITY_DESIGN_REVIEW.md). Never trust an organization ID from the browser. Do not use production personal data in development or preview environments. No secrets belong in Git.
