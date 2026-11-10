# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added
- Support request create/list/detail/status APIs with request lifecycle transitions.
- Bulk record target selection for owner-change and delete requests, including duplicate-target validation.
- NestJS Sidekick service foundation with health/readiness endpoints and validated configuration.
- Initial ticket endpoints for creation, listing, details, and support-controlled status transitions.
- PostgreSQL Prisma schema for tickets, ticket events/comments, support requests, and per-record request targets.
- Prisma database module and persistent ticket service implementation.
- Starter agent skills registry for knowledge answers, ticket creation, and support routing.
- Repository agent guidance and phased delivery roadmap.

### Changed
- Ticket status history is persisted transactionally with status updates.
- Development setup now documents PostgreSQL configuration and Prisma migration commands.

### Pending
- Verified Identity Management authentication and role/permission/city/store guards.
- Request approval and controlled owner-change/deletion execution workflows.
- Markdown ingestion, permission-filtered RAG, service connectors, call routing, and holiday calendars.
