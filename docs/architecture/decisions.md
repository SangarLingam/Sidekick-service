# Initial architecture decisions

- **AD-001 — NestJS:** Use a modular NestJS service as the new Sidekick backend.
- **AD-002 — Service ownership:** Sidekick owns support and conversation workflows; business microservices own business data and enforce their domain rules.
- **AD-003 — API integration:** Connect to services through authenticated APIs, never direct cross-service database reads.
- **AD-004 — Frontend separation:** Keep CRM/ERP UI changes in the existing frontend repositories. Integrate through a versioned Sidekick API.
- **AD-005 — Model flexibility:** Keep model/provider selection behind an adapter. Select production model after evaluation on approved domain examples, permission refusal cases, tool-call correctness, latency and cost.
- **AD-006 — Action safety:** Use registered, typed tools; apply authorization before retrieval/action; require approvals for configured business changes; use idempotency for retries.
