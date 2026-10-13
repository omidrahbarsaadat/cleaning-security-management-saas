# Cleaning & Security Management SaaS

A multi-tenant operations platform for cleaning and security service companies in Germany. The product starts with a German-first, modular monolith and is designed for later English and Persian localization.

## Project status

This repository is at the foundation stage. Authentication, tenant-scoped data access, and production deployment are not implemented yet. Do not use this software with real employee or customer data.

## Product scope

The initial product focuses on organizations and roles, employees, clients and service sites, shifts and assignments, working-time records, cleaning checklists, and security incident reports.

## Architecture direction

- Next.js App Router, React, TypeScript and Tailwind CSS
- PostgreSQL with Prisma
- Zod validation and server-side authorization
- Vitest and Playwright
- Modular monolith; no microservices for the MVP

See `docs/` for requirements, architecture, data boundaries, security, compliance notes, business assumptions, roadmap, decisions, progress and resume instructions.

## Development status

No application code or test suite has been verified yet. See [`docs/PROGRESS.md`](docs/PROGRESS.md) and [`docs/RESUME.md`](docs/RESUME.md) before continuing.
