# Architecture

## Direction
Use a modular monolith with Next.js App Router. Keep domain boundaries explicit (organizations/access, workforce, clients/sites/contracts, cleaning, security, reporting). Use server components for read-oriented UI and server actions or route handlers for validated mutations. Do not put authorization in client components.

## Proposed stack
Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, Zod, Vitest, Playwright, and GitHub Actions. Version selection must be checked against current official release/compatibility documentation before installation.

## Tenant boundary
Resolve the authenticated user and active organization from trusted session state, then verify an active OrganizationMembership and required permission on the server. Data access functions accept a verified tenant context, not a raw browser-supplied organization ID. Include organizationId in every tenant-owned record and in unique/index keys. Use composite foreign keys where needed to prevent cross-tenant references.

The concrete request flow, threat assumptions, permission boundaries, cross-tenant test matrix, and decisions awaiting review are in [SECURITY_DESIGN_REVIEW.md](SECURITY_DESIGN_REVIEW.md).

PostgreSQL RLS may provide defense in depth, but only after connection pooling, transaction-scoped tenant context, background jobs, migrations, and privileged roles are designed. RLS is not a substitute for application authorization.

## Authentication
No provider is selected yet. Compare Auth.js and a managed identity provider before implementation, focusing on secure session handling, account recovery, EU data processing, cost, and operational burden. Do not implement authentication until its design is reviewed.

## Localization
German default; English LTR; Persian RTL. Keep translations in dedicated locale resources and format dates, numbers, and EUR using locale-aware APIs.

## Deployment
Target Vercel only after repository integration and preview-data safeguards are confirmed. Use PostgreSQL in an appropriate EU region, separate preview and production credentials/data, and run migrations as a controlled release step rather than on every application boot.
