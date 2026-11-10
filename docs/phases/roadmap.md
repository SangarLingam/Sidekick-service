# Sidekick phased delivery roadmap

| Phase | Scope | Key completion evidence |
|---|---|---|
| 1. Foundation | NestJS service, environment validation, health/readiness, API prefix, container | Starts locally and in container; configuration errors fail fast |
| 2. Identity and access | Identity integration, role/permission/city/store policy, audit identity | Allowed and denied access scenarios verified across endpoints |
| 3. Tickets and requests | Ticket Dashboard API, status transitions, owner/delete requests, bulk lookups/results | Same records/status available to dashboard and chat clients |
| 4. Knowledge and RAG | Markdown ingestion/versioning, scoped search, citations | Evaluation questions pass for allowed, unknown and restricted content |
| 5. Agent orchestration | Clarifications, tool registry, read actions, safe escalation | Tool calls stay within user scope and are traceable |
| 6. Microservice connectors | CRM, ERP, quotes, payments, identity, notifications, scheduler and files | Contract and failure behaviour verified per connector |
| 7. Calls | Admin routing, holidays, primary/fallback, calls, screen share, transfers | Routing, closure and failure cases verified |
| 8. Frontend integration | Separate Ticket Dashboard and embedded CRM/ERP widget | Both clients use API contracts; frontend code remains in their repos |
| 9. Hardening and rollout | Security, observability, performance, operations and rollout | Operational readiness agreed and release criteria met |
