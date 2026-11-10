# Sidekick Service

Standalone NestJS backend for the Sidekick support assistant used with CRM and ERP. The repository is intentionally independent of both application frontends; integration will happen through a documented API and a later frontend phase.

## Current status

**Phase 1 — backend foundation** is scaffolded: NestJS application, validated environment configuration, secure HTTP defaults, versioned API prefix, and live/readiness endpoints. Business endpoints are not implemented yet.

```text
GET /api/v1/health/live
GET /api/v1/health/ready
```

## Local development

Requirements: Node.js 24 and npm.

```bash
cp .env.example .env
npm install
npm run start:dev
```

The service listens on port 3000 by default. CORS origins are configured in `.env` for the CRM and ERP frontend origins.

## Product boundaries

- Sidekick owns conversations, knowledge indexing metadata, support tickets, requests, call sessions, routing policy, and audit events.
- Identity Management remains authoritative for identities, roles, permissions, and user scope.
- CRM, ERP, Quote, Payments and other services remain authoritative for business records and actions.
- Business integrations use authenticated service APIs; Sidekick must not query those services' databases directly.
- AI retrieval and actions must enforce the current user's existing permission, city and store scope before content enters the model context.
- The model provider and model identifier will be configured behind an adapter. Model choice should be validated against the team's real question set for answer quality, tool-call reliability, latency, and cost before production.

## Delivery phases

1. **Foundation (current):** service scaffold, configuration, health checks, API conventions, CI/container baseline.
2. **Identity and access:** validate identity tokens, roles, permissions, tenant/city/store scope; add authorization guards and audit context.
3. **Ticket Dashboard API:** tickets, requests, comments, attachments, status transitions, owner-change/delete request workflow, bulk record lookup and per-record outcomes.
4. **Knowledge and RAG:** service Markdown publishing, versioning, indexing, permission-filtered retrieval, citations, and evaluation set.
5. **Agent orchestration:** clarification, registered read tools, safe tool selection, ticket/request hand-off; model/provider adapter and evaluations.
6. **Service connectors:** integrate CRM/ERP/Quote/Payments and shared services incrementally via contracts and scoped credentials.
7. **Calls and routing:** support-team administration, primary/secondary routing, availability and holiday calendars, callbacks, screen sharing, transfer and call history.
8. **Frontend integrations:** separate Ticket Dashboard UI and CRM/ERP Sidekick widget in their respective repositories; consume this service's versioned API. CRM/ERP frontend code is deliberately not included here.
9. **Hardening and rollout:** security review, operational metrics, integration tests, load/recovery checks and phased production rollout.

## Local Git

This directory is a standalone Git repository. A remote GitHub/GitLab repository must be configured separately if one is available.
