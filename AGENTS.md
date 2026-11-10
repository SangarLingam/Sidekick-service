# Sidekick Service — Agent Guidance

## Scope
- This repository contains the NestJS Sidekick backend only.
- Keep CRM and ERP frontend implementations in their existing repositories. Integrate through the versioned Sidekick API.
- Sidekick owns conversations, support tickets/requests, knowledge metadata, routing configuration, call sessions, and audit history. Domain microservices remain authoritative for business data and actions.

## Architecture rules
- Use modular NestJS modules and DTO validation for HTTP inputs.
- Use PostgreSQL through Prisma for persistence. Add migrations for schema changes and never query another microservice's database directly.
- Integrate with Identity Management and business services through authenticated APIs. Do not trust identity headers in production; replace development placeholders with verified authentication and authorization guards before deployment.
- Enforce tenant, role, permission, city, store, record, and document scope before data access or AI retrieval.
- All AI actions must use explicitly registered tools, validated inputs, authorization checks, audit records, and idempotency for writes.
- Keep provider/model selection behind an adapter. Never hardcode credentials or production secrets.

## Workflow
- Work on a feature branch; do not commit directly to `main`.
- Update `CHANGELOG.md` for user-visible/backend API changes.
- Update this file when repository-wide engineering conventions change.
- Include migration and environment-variable instructions when adding persistence or integrations.
- Keep CRM/ERP UI out of this repository unless the product owner changes the scope.

## Current limitations
- Identity claims in `src/common/requester.decorator.ts` are development placeholders and are not production authentication.
- Ticket/request persistence uses the local PostgreSQL schema; verify migrations and runtime against a configured database before claiming readiness.
- Request execution, RAG ingestion, service connectors, call routing, and holiday calendars are planned modules until implemented.
