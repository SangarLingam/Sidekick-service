# Sidekick Product Requirements Document

**Version:** 1.0  
**Status:** Product requirements draft  
**Related document:** [Business Requirements Document](Sidekick-BRD.md)  
**Scope:** NestJS Sidekick backend. CRM/ERP user interfaces remain in their own repositories.

## 1. Product overview

Sidekick is a support and workflow service integrated with the existing CRM and ERP. It answers questions from approved service Markdown, checks live business information through authorised service APIs, asks for missing details, and helps users submit and track tickets and requests. It also provides support-team routing and in-app calling capabilities.

Sidekick is a hybrid RAG and tool-using agent: retrieval grounds answers in approved documentation; registered tools retrieve live data or initiate explicitly permitted workflows. It must not invent permissions or execute business changes from untrusted text.

## 2. Users

- **End user:** asks questions, submits requests/tickets, tracks their own permitted work, contacts support.
- **Support agent/specialist:** handles assigned queues, updates tickets, receives/transfers calls.
- **Approver:** reviews requests within assigned business scope.
- **Support Admin:** configures scoped support teams, routing and calling calendars.
- **Knowledge Admin:** publishes and retires service documentation.
- **Platform Admin:** manages integrations and global configuration.

Identity Management remains authoritative for identity, role, permission, and scope.

## 3. Product goals

1. Give CRM and ERP users one consistent support entry point.
2. Provide source-grounded answers filtered by the user's current permissions, city and store scope.
3. Ask focused clarification questions when required details are missing.
4. Turn unresolved issues into well-contextualised tickets and structured requests.
5. Let users see status and public progress in the separate Ticket Dashboard.
6. Route calls predictably to configured support people and preserve context during handoff.
7. Keep business data and business actions owned by their existing microservices.

## 4. In scope

- NestJS API for conversations, tickets, requests, routing configuration, call metadata and audit.
- Markdown document registry, versioning, ingestion status, permission metadata, retrieval and citations.
- Permission-aware question answering and registered service API tools.
- Ticket lifecycle and user-visible status history.
- Structured request templates, approvals, owner-change and delete requests with multi-record selection and per-record outcomes.
- Support team administration, ordered primary/secondary/fallback routing, working hours and holidays.
- Call session lifecycle, transfer/invite events, screen-share session permissions and callback scheduling integration.
- Notifications, attachments/file references, idempotency and correlation IDs.
- API contracts for a separate CRM/ERP widget and Ticket Dashboard.

## 5. Out of scope for the initial backend

- CRM or ERP frontend implementation in this repository.
- Direct database access to CRM, ERP, or other business services.
- Unrestricted autonomous write operations or permission changes by AI.
- Remote control of a user's device.
- Call recording/transcription until policy, consent, retention and vendor decisions are approved.
- Replacing Identity Management, Notification Service, Scheduler Service or File Service.

## 6. Core user journeys

### 6.1 Ask a question

1. Authenticate the requester and resolve current role, permissions, tenant, city/store scope.
2. Classify the question and select only eligible knowledge sources.
3. Ask a concise follow-up if required details are missing.
4. For live facts, call only a registered, scoped service API.
5. Respond with source title/version for documentation answers and a clear live-data timestamp/context when relevant.
6. If uncertain or unresolved, offer ticket creation without requiring the user to repeat known context.

### 6.2 Report a bug

Collect a title, affected service/module, expected and actual behaviour, reproduction details, relevant record reference, app version and permitted attachments as applicable. Show an editable summary, then create one ticket using an idempotency key. Notify the configured team and preserve the conversation link.

### 6.3 Submit and track a request

Create a typed request from Sidekick or the separate Ticket Dashboard. Validate required fields, target scope and approval requirements. The request records each target and each result. Users can see request status, public updates and assigned team without seeing internal notes.

### 6.4 Change owner or delete multiple records

Search supported records by ID, name or phone number; present only authorised matches and require explicit selection when ambiguous. Show the exact target list, action, reason and proposed owner (for owner change). Submission is not execution. Require configured approval, revalidate permissions/current record state, execute through the owning service, and show succeeded/failed/skipped outcomes per record. Protect retries with per-record idempotency.

### 6.5 Contact support

Resolve service/module to an eligible support team. Ring the primary first; only on no answer, decline, busy or unavailable proceed to the next configured user. Stop immediately when answered or caller cancels. If no one answers, record the attempts and offer an eligible callback. An authorised agent can warm-transfer or invite a colleague; temporary participation does not change permanent team membership.

## 7. Functional requirements

| ID | Requirement |
|---|---|
| PR-01 | Accept CRM/ERP identity and application context through a versioned API contract; validate all identity claims server-side. |
| PR-02 | Enforce tenant, role, permission, city, store, module and record scope before knowledge retrieval, service calls, ticket access and response generation. Fail closed when required scope is unavailable. |
| PR-03 | Register documents by service/module, owner, version, audience, approval and lifecycle state; failed indexing must not replace the last known-good active version. |
| PR-04 | Return grounded answers with citations; say when evidence is missing or a connected service is unavailable. |
| PR-05 | Ask clarification questions for missing required context and retain prior verified answers. |
| PR-06 | Use an allow-listed tool registry with schemas, scope checks, timeouts, audit and safe retry policy. No model-generated arbitrary URL, SQL or code execution. |
| PR-07 | Create, list and read authorised tickets; support status changes, public comments, internal notes, assignment, attachments and history with role-specific access. |
| PR-08 | Make ticket submission idempotent and link it to the source conversation and relevant application context. |
| PR-09 | Support request templates, approvals, cancellation rules and lifecycle distinct from ticket status. |
| PR-10 | Support multi-record owner-change/delete requests, canonical record IDs, explicit selection, approval and per-record execution outcomes. |
| PR-11 | Expose a dashboard API that returns the user's authorised tickets and requests with current status, assignee/team, timestamps, public history and filters. |
| PR-12 | Support admins can configure multiple scoped admins, support teams and ordered primary/secondary/fallback users using Identity Management IDs. |
| PR-13 | Evaluate working hours, timezone, holidays, city/store scope and agent availability before every call attempt, callback and transfer. |
| PR-14 | Route sequentially, prevent duplicate simultaneous acceptance, stop on caller cancellation, and retain a missed-call record if nobody answers. |
| PR-15 | Record call participants, attempts, transfers, invitations and ticket linkage; screen sharing is user-initiated and stoppable. |
| PR-16 | Integrate Notification, Scheduler and File services through authenticated service APIs and keep failures visible without losing the underlying ticket/request. |
| PR-17 | Maintain audit events and correlation IDs for administrative changes, access-sensitive reads, approvals, actions and routing. |
| PR-18 | Expose health/readiness, structured logs and operational metrics without logging secrets or unnecessary sensitive content. |

## 8. Ticket and request status

**Ticket lifecycle:** New → Triaged → In Progress → Waiting for User → Resolved → Closed. Reopening returns a ticket to an active state and records the event. Internal notes are never exposed in the user dashboard.

**Request lifecycle:** Submitted → Under Review → Awaiting Approval → Approved or Rejected → In Progress → Completed. Also support configured cancellation and explicit fulfilment failure. Bulk outcomes can be Partially Completed and include a result for every target.

## 9. Backend service boundaries

Sidekick owns support conversations, knowledge metadata, tickets, requests, routing policy, call-session metadata and audit references. Existing services remain authoritative:

- Identity Management: users, roles, permissions, scope.
- CRM/ERP and Quote/Quote Builder/Payment services: business data and business rules.
- Notification Service: delivery.
- Scheduler Service: callbacks and scheduled reminders.
- File Service: file storage.
- WebRTC/media provider: audio/video/screen media transport.

Sidekick calls service APIs; it does not read other services' databases directly.

## 10. Quality, security and reliability requirements

- Deny by default if authentication or required authorization scope cannot be verified.
- Apply current access checks to cached answers, search results, conversation history, attachments and dashboard counts.
- Use short-lived call access tokens and validate participant permissions independently of call membership.
- Use request and per-record idempotency keys, bounded retries, timeouts and clear partial-failure results.
- Preserve support data when AI, notification, scheduler, media or business integrations are unavailable.
- Keep secrets outside source control; redact sensitive identifiers from logs where appropriate.
- Define retention, backup/recovery, availability, latency and load objectives with stakeholders before production.

## 11. Acceptance criteria

1. An authorised documented question returns a relevant citation and document version.
2. A user outside a document or record scope cannot retrieve it through chat, search, history, dashboard or attachments.
3. An incomplete request asks for the missing required field; supplied context is not repeatedly requested.
4. A repeated ticket submission with the same idempotency key produces one ticket.
5. A live payment question uses the authorised Payment API and reports connector failure honestly.
6. A direct dashboard request and a Sidekick-created ticket appear as the same underlying records in the dashboard.
7. A multiple-record request exposes only permitted matches, requires selection for ambiguity and displays a result per target.
8. No business change executes merely because a request was submitted or because the model suggested it.
9. Primary call acceptance prevents secondary routing; unanswered/declined attempts move to the next eligible person.
10. A holiday closure prevents calls to closed support teams unless a scoped on-call exception is configured.
11. A failed transfer leaves the original agent connected and records the attempt.
12. A user can start and stop screen sharing; joining a call does not grant business-record access.
13. Service failures do not discard a saved ticket or request; current status remains retrievable.
14. Every administrative routing change and approved business action has an auditable actor, time and outcome.

## 12. Delivery plan

1. **Foundation and contracts:** NestJS modules, configuration, health, API conventions, data model and CI.
2. **Identity and authorization:** verified Identity Management integration, scope guards, audit context.
3. **Ticket/request APIs:** comments, attachments, status history, dashboard queries, approvals and bulk target outcomes.
4. **Knowledge and RAG:** Markdown publishing/versioning, indexing, scoped retrieval, citations and question evaluation.
5. **Agent orchestration:** clarification, tool registry, safe read actions and ticket/request hand-off.
6. **Service integrations:** CRM/ERP first, then Quote, Payments and remaining services by contract.
7. **Calls and routing:** team admin, sequential routing, calendars, callbacks, media sessions, screen sharing and transfers.
8. **Hardening:** security review, end-to-end checks, load/recovery validation, operational dashboards and rollout.

## 13. Open decisions

- Final Identity Management token-validation and delegated service-auth contract.
- Initial production services and their API owners/contracts.
- Supported Markdown formats, publishing path and document approval owners.
- Request templates, approvers, batch-size limits and deletion/archive policy.
- Calling/media provider, supported browsers and concurrency target.
- Holiday calendar precedence, callback policy and after-hours/on-call ownership.
- Retention and consent policy for attachments and any future recording/transcription.
- Measurable service-level, latency, availability and recovery targets.
