# Deployment procedure (planned)

## Current status
No Vercel project, PostgreSQL service, environment variables, or deployment has been configured or verified.

## Required environment variables
- `DATABASE_URL`: PostgreSQL connection string (separate per environment).
- `BETTER_AUTH_SECRET`: at least 32 random characters; the app refuses to start in production without it.
- `BETTER_AUTH_URL`: the public base URL of the deployment.
- An email delivery provider must be selected and wired into `sendVerificationEmail` before production; until then production sign-up deliberately fails instead of dropping verification mail.

## Intended workflow
Feature branch → CI checks → pull request → Vercel preview using isolated non-production data → human review → merge to main → controlled production migration/deployment after explicit release approval.

## Safeguards
- Keep production secrets in provider-managed environment settings, never in Git.
- Use separate preview and production databases/credentials; never copy real employee/customer data to preview.
- Run schema migrations as an explicit controlled release step, not on every app startup or preview build.
- Choose EU hosting/database region after provider and contractual review.
- Document backup and restore procedures before production.
- Production release requires explicit founder approval and security/tenant-isolation review.
