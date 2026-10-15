# Cleaning & Security Management SaaS

A multi-tenant operations platform for cleaning and security service companies in Germany. German is the default interface language; English and Persian are included in the locale scaffold, with Persian right-to-left document direction.

## Current status

The foundation scaffold and project documentation are on the feature branch [foundation/initial-project-docs](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/tree/foundation/initial-project-docs), in draft [PR #5](https://github.com/omidrahbarsaadat/cleaning-security-management-saas/pull/5). Authentication, tenant-scoped data access, PostgreSQL/Prisma integration, and deployment are not implemented. Do not enter real employee or customer data.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- PostgreSQL and Prisma planned; schema and tenant constraints are documented, but no migration exists yet
- Zod planned for request validation
- ESLint, Vitest, Playwright, and GitHub Actions CI

## Development

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`; the root route redirects to German. Available locales are `/de`, `/fa` (RTL), and `/en`.

Run checks:

```sh
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

GitHub Actions run #33 passed the install, audit, lint, typecheck, 7 unit tests, 3 Chromium browser tests, and production build. The browser suite starts the Next.js dev server. These automated checks passed in GitHub Actions; no local shell or browser run has been verified in this environment. See [project progress](docs/PROGRESS.md) for evidence.

Read [AGENTS.md](AGENTS.md), [the roadmap](docs/ROADMAP.md), [progress](docs/PROGRESS.md), and [the resume point](docs/RESUME.md) before continuing.

## Security

Authentication and authorization are intentionally not implemented until the provider and tenant-boundary design has been reviewed. Read [the security design review](docs/SECURITY_DESIGN_REVIEW.md). Never trust an organization ID from the browser. Do not use production personal data in development or preview environments. No secrets belong in Git.
