# Database design proposal

## Conventions
PostgreSQL, Prisma, UUID/CUID identifiers, UTC timestamps, explicit status enums, createdAt/updatedAt, and organizationId on tenant-owned records. Minimize personal data and define retention before collecting sensitive fields.

## Initial entities
- Organization: legal/display name, locale, timezone, lifecycle status.
- User: identity-provider subject, email, preferred locale, status.
- OrganizationMembership: organizationId + userId, status, role/permission assignments.
- Employee: organizationId, optional linked user, employment status, minimal operational profile.
- Client, ServiceSite, Contract: all tenant-owned; Site references Client within the same organization.
- Shift: organizationId, siteId, time interval, service type/status.
- Assignment: organizationId, shiftId, employeeId; unique shift/employee pair.
- TimeEntry: organizationId, assignmentId, start/end, correction metadata.
- ServiceTask, CleaningChecklist, CleaningInspection, SecurityIncident, PatrolReport, Qualification, ServiceReport: organization-owned and linked only to same-tenant parents.
- Subscription: organizationId and provider references; no billing integration in MVP.
- AuditLog: organizationId, actor reference where retained, action, subject type/id, timestamp, minimal metadata.

## Constraints and indexes
Use composite unique keys such as (organizationId, id) on tenant-owned parents and composite foreign keys from children to enforce same-tenant relationships. Add indexes for (organizationId, status), schedule ranges, employee assignments, and common client/site lookups. Use unique (organizationId, userId) membership. Prevent invalid time ranges with database checks where supported. Define deletion behavior per entity; prefer archival/status changes for operational history and explicit retention workflows for personal data.

## Security note
The schema is a proposal, not an implemented migration. Cross-tenant authorization must also be enforced in server-side query functions and tested. Do not put real people or customer data in seeds.
