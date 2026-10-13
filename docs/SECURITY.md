# Security baseline

The proposed authentication and tenant-isolation request flow is documented in [SECURITY_DESIGN_REVIEW.md](SECURITY_DESIGN_REVIEW.md). Founder review is required before implementing authentication or tenant-owned operations.

## Threats
Cross-tenant IDOR, privilege escalation, session theft, unsafe uploads, malicious input, accidental disclosure in logs, preview/production data mixing, and over-retention of employee or incident information.

## Required controls before operational features
- Secure authentication and session configuration.
- Server-side membership and permission checks for every protected operation.
- Tenant-scoped query APIs and same-tenant relationship constraints.
- Schema validation and output minimization.
- Audit sensitive mutations without recording secrets or unnecessary personal data.
- Rate limiting for authentication and abuse-prone endpoints.
- Safe file upload design (type/size checks, malware considerations, private storage, expiring access).
- No secrets in source; separate development, preview, and production credentials.
- Cross-tenant denial and role-boundary tests.
- Backup, restore, incident response, retention, and deletion procedures.

## RLS
Evaluate PostgreSQL Row-Level Security as defense in depth after designing transaction-local tenant context and privileged roles. Never enable a simplistic policy that can be bypassed through connection-pool state leakage.

## Release gate
Security review and tenant isolation tests are mandatory before production. This document is not a security certification.
