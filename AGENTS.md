# Project instructions

## Product
Build a commercial multi-tenant operations SaaS for cleaning and security service companies, initially targeting Berlin and Germany. The founder's company is planned but not established. Keep the product useful for companies offering either service or both.

## Working rules
- Read `docs/ROADMAP.md`, `docs/PROGRESS.md`, and `docs/RESUME.md` before project work.
- Work in small reviewable increments. Use feature branches and pull requests for substantive changes.
- Never claim a test, build, deployment, or integration succeeded unless its result was observed.
- Do not deploy publicly, incur costs, or use production personal data without explicit approval.
- Never commit credentials. Use fictional data only.
- Keep code identifiers and technical docs in English; write product-facing UI in German by default.
- Treat tenant isolation as a server-side security boundary. Never trust organization IDs from browser input.
- Before authentication or tenant-sensitive features, document the threat model and authorization design.
- Do not claim legal compliance. Flag legal requirements for qualified review.
- Avoid unnecessary services, dependencies, microservices, and infrastructure.

## Stack direction
Next.js App Router, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Zod, Vitest, Playwright, and GitHub Actions. Verify compatible stable versions before dependency installation.

## Security baseline
Authenticate users, verify active organization membership and permissions on the server, scope every data operation to the authorized organization, validate input, audit sensitive operations, and add automated cross-tenant denial tests. Evaluate PostgreSQL RLS as defense in depth only after transaction/session context is designed safely.

## Documentation
Keep README and docs synchronized with implementation. Update PROGRESS and RESUME at each meaningful milestone; record decisions in DECISIONS and open work in BACKLOG.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
