# Architecture decisions

## ADR-001: Modular monolith
Status: accepted. Keep one deployable application with explicit domain modules for MVP. Reason: lower operating cost and simpler development for an independent founder. Revisit only with measured scaling or organizational needs.

## ADR-002: Tenant isolation is server-side
Status: accepted. Every request resolves a verified membership and permission; tenant query scope is derived from trusted context. Frontend organization IDs are untrusted. Composite tenant keys/FKs are preferred for relational integrity.

## ADR-003: No billing before validation
Status: accepted. Pricing and packaging are hypotheses; defer billing until customer demand and legal/tax obligations are reviewed.

## ADR-004: No authentication implementation before design review
Status: accepted. Compare Auth.js and managed identity options for secure sessions, recovery, EU processing, cost, and maintenance before coding.

## ADR-005: German-first localization
Status: accepted. German is default, English LTR and Persian RTL are supported through dedicated locale resources.
