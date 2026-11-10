# Business Requirements Document
# Sidekick — AI Support, Requests, Tickets and Calls

**Prepared for:** Sangaralingam D. (Sangar), Software Engineer L2  
**Project:** Ticketing Tool / CRM and ERP Sidekick  
**Version:** 1.3 — working requirements draft  
**Date:** 10 November 2026  
**Status:** Planning; no implementation or production configuration is implied.

## 1. Executive summary

Build one new Sidekick service, embedded in existing CRM and ERP applications. Sidekick will use approved Markdown documentation from each microservice to explain workflows, clarify user questions, and troubleshoot problems. It will retrieve live information through authorised service APIs when necessary. Unresolved issues become support tickets; operational needs become structured requests. Users and support agents can communicate through tickets and in-app calls with optional screen sharing.

An admin panel will map each service or module to support users. Calls will ring the primary person first and move to the secondary or additional fallback person only when the previous attempt is unanswered, declined, unavailable, or busy. Support agents can transfer incorrectly routed calls or invite another colleague. Permanent support-team membership is controlled by authorised admins.

## 2. Business context and problem

The existing platform contains more than eight services, including Identity Management, CRM Backend, ERP Backend, Notification Service, Scheduler Service, Quote Service, Payment Microservice, File Service, and Quote Builder Backend. Users need one place to understand these systems, report failures, request changes, and reach the responsible support person.

Today, knowledge and ownership can be distributed across teams. Users may not know the affected service, repeat information to different people, or reach the wrong contact. Sidekick should collect context once and preserve it across AI assistance, tickets, requests, transfers, and calls.

## 3. Objectives

- Provide a consistent support entry point inside CRM and ERP.
- Answer questions using approved, permission-filtered service documentation.
- Ask useful clarification questions before answering or escalating.
- Create complete tickets and requests without requiring users to repeat the conversation.
- Route calls to configured service owners in a predictable order.
- Support transfers and joint calls when another team is needed.
- Reuse existing identity, notification, scheduling, and file capabilities.
- Make ownership, approvals, changes, and support activity traceable.

## 4. Scope and boundaries

### Included

Embedded chat widget; service documentation publishing and search; controlled API connectors; ticket and bug management; request forms and approvals; support-team administration; sequential calling; audio/video and screen sharing; transfer and participant invitations; callback scheduling; notifications; audit history; operational reporting.

### Boundaries

Existing microservices retain ownership of business data, validations, and permissions. Sidekick owns support data and orchestration. It must use service APIs rather than direct access to business-service databases. Documentation cannot grant permissions or create executable API tools.

Remote desktop control, autonomous code fixes, unrestricted AI actions, and automatic recording are outside the initial scope. Recording is an optional later capability requiring a separate policy and participant consent. Delivery dates, vendor selection, operating budget, and numerical SLA targets remain to be agreed.

## 5. Users and permissions

| Role | Responsibilities and permitted activities |
|---|---|
| End user | Ask questions, submit tickets and requests, view permitted records, join support calls, choose whether to share a screen |
| Support agent | Handle assigned or authorised queues, respond, update tickets, receive calls, transfer and invite if permitted |
| Developer / specialist | Investigate assigned bugs and provide technical updates |
| Approver | Approve or reject requests within an assigned business scope |
| Support Admin | Configure support teams, routing, availability rules, categories, and support workflows within assigned scope |
| Knowledge Admin | Publish and retire approved documentation within assigned scope |
| Platform Admin | Manage integrations, global settings, and administrative access |

One or multiple users may hold each admin role. A support-team assignment does not itself grant an admin role or access to business records. Identity Management is the source of user IDs, active status, and platform permissions.

## 6. Service integration requirements

| Service | Required interaction |
|---|---|
| Identity Management | Validate authentication, active user status, roles, tenant, branch, and permitted scope |
| CRM Backend | Retrieve authorised CRM context and live record information |
| ERP Backend | Retrieve authorised project and operational information |
| Quote Service | Retrieve authorised quote details and status; later fulfil permitted quote requests |
| Quote Builder Backend | Supply documentation and authorised builder context |
| Payment Microservice | Retrieve authorised payment status and dues; route corrections through controlled finance workflows |
| Notification Service | Deliver ticket updates, approval alerts, call invitations, and callback notifications |
| Scheduler Service | Schedule callbacks, reminders, and escalation jobs |
| File Service | Store and retrieve approved Markdown files, screenshots, and support attachments |
| Additional services | Register a connector, owner, documentation collection, and permission mapping |

Each connector must define supported operations, input validation, permission checks, timeout behaviour, and safe retry rules. Start business-data integrations with reads; enable write operations individually through approved workflows.

## 7. Functional requirements

### 7.1 Embedded Sidekick and conversations

**CHAT-01:** Provide the Sidekick widget inside CRM and ERP, preserving conversations across page navigation.

**CHAT-02:** Capture application, module, page URL, selected record reference, application version, and relevant error reference where available. Validate context on the backend; do not automatically upload entire pages or sensitive records.

**CHAT-03:** Support messages, attachments, visible processing states, conversation history, and direct actions to create a ticket, submit a request, or contact support.

**CHAT-04:** Preserve conversation linkage when a ticket, request, or call is created. Users can proceed directly to support without completing an AI troubleshooting flow.

### 7.2 Markdown knowledge management

**KB-01:** Register documents by service and module, including title, owner, version, audience, approval status, and last updated date.

**KB-02:** Support manual admin upload initially and release-pipeline publishing subsequently.

**KB-03:** Suggested document set: service.md, workflows.md, troubleshooting.md, requests.md, and permissions.md. These filenames are a proposed convention, not a dependency.

**KB-04:** Validate documents, create searchable sections, and track Processing, Ready, Failed, and Archived states. Activate a new version only after successful indexing; retain the previous active version when processing fails.

**KB-05:** Filter documents by user permissions before retrieval. Match deployed application versions when documented mappings exist; disclose a version mismatch instead of presenting older guidance as current.

**KB-06:** Show the source title, relevant section, and document version with documentation-based answers. Retired or unauthorised documents must not remain available through stale search results.

### 7.3 AI assistance and live information

**AI-01:** Classify input as a how-to question, live-data question, bug/support issue, service/access request, or feature request.

**AI-02:** Ask focused clarification questions when required information is missing. Do not repeatedly ask for information already available and verified in the conversation.

**AI-03:** Use documentation for process explanations and authorised APIs for live facts. Explain when data cannot be retrieved; service failure must not be described as a missing record.

**AI-04:** When guidance is insufficient or the issue remains unresolved, collect the missing details and offer ticket creation. Direct user requests to raise tickets should not be blocked by mandatory troubleshooting.

**AI-05:** Use only backend-registered tools with validated arguments. Treat document content and user-provided attachments as untrusted knowledge, never as authority to change permissions.

**AI-06:** Never claim an action succeeded until the owning system confirms it. Display failed or uncertain execution states accurately.

### 7.3.1 Role, permission, city and store restrictions

**ACCESS-01:** Reuse existing Identity Management roles and permissions plus authoritative city/store assignments from their owning services. Sidekick must not maintain a competing grant system. Apply tenant, branch, city, store, module and record restrictions together according to the existing platform policy; missing required scope denies access.

**ACCESS-02:** Answer only questions whose knowledge and data are permitted for the requesting user. Check access before retrieval, API calls and response generation. If the topic or requested record is outside scope, provide a brief access message without answering restricted content or confirming protected record existence.

**ACCESS-03:** Attach audience/scope metadata to documents and searchable sections. General guidance explicitly available to all authorised users remains accessible; restricted guidance is filtered by role/permission and applicable city/store scope. Restricted content must not be retrieved into the AI context and filtered only afterward.

**ACCESS-04:** Enforce the same scope for search suggestions, identifiers, dashboards, counts, summaries, exports, attachments and notifications. A user-supplied project ID, name, phone number, city or store never grants access.

**ACCESS-05:** Revalidate permissions when user scope changes and before sensitive reads or execution. Cached answers, conversation history and shared links must not expose information outside current access. Support-agent and admin scopes are checked independently; joining a call or receiving a ticket does not grant business-record access.

### 7.4 Tickets and bug reports

**TKT-01:** Support questions, bugs, and incidents with unique IDs, service/module classification, ownership, priority, comments, and activity history.

**TKT-02:** Capture title, description, requester, tenant/branch, related record references, expected and actual behaviour, reproduction steps, attachments, application version, error/correlation references, and troubleshooting attempted where relevant.

**TKT-03:** Generate an editable summary from the chat. Create only after required fields are available; prevent duplicate tickets caused by repeated submission or network retries.

**TKT-04:** Suggested lifecycle: New → Triaged → In Progress → Waiting for User → Resolved → Closed. Allow reopening, reassignment, and linked tickets. Approval waiting belongs to request workflows where applicable.

**TKT-05:** Separate internal notes from requester-visible comments. Keep all transfers, assignments, status changes, and calls in the timeline.

**TKT-06:** Suggest possible duplicates and priority, while allowing an authorised agent to decide. Link cross-service issues to a main ticket rather than losing responsibility between teams.

### 7.4.1 User-visible ticket status and tracking

**TRACK-01:** Users can view their own tickets and any other tickets explicitly shared with them through authorised access in the separate Ticket Dashboard and Ticket Details. Show ticket ID, title, affected service/module, current status, assigned support person/team, creation time, and last updated time.

**TRACK-02:** Display the full status lifecycle in clear language: New, Triaged, In Progress, Waiting for User, Resolved, and Closed. Reopened tickets show their current active status and a reopening event in the history.

**TRACK-03:** Show a user-visible status history with timestamps, public progress updates, and resolution notes. Highlight when the user must provide information or confirm resolution. Keep internal notes and restricted investigation details hidden.

**TRACK-04:** Update the visible status when support changes it, using live updates when connected and refetching on reconnect or refresh. Send status-change notifications through Notification Service according to configured preferences, linking back to the ticket. A notification delivery failure must not prevent users from viewing the current saved status.

**TRACK-05:** Let users search by ticket ID/title and filter their accessible tickets by status and service. Users can add comments or attachments, confirm resolution, and request reopening according to workflow rules. Viewing status does not grant permission to edit arbitrary statuses or access another user's ticket.

### 7.4.2 Separate Ticket Dashboard

**DASH-01:** Provide a dedicated Ticket Dashboard page outside the embedded Sidekick widget. Users can open it directly without starting a Sidekick conversation.

**DASH-02:** Show a Create Request button on this dashboard. It opens a structured form with request type, service/module, title, description, record selection by ID/name/phone with multiple selection where supported, and attachments. Required fields and approvals follow the selected request template.

**DASH-03:** List the user's authorised tickets and requests, including those raised through Sidekick and those submitted directly from the dashboard. Use the same underlying records, IDs, ownership, comments and status history; do not create duplicates for each entry point.

**DASH-04:** Show current status and assigned support person/team. Selecting an item opens its details, public comments, attachments and status history. Ticket and request status lifecycles remain distinct and clearly labelled.

**DASH-05:** Support search and filters by item type, service and status. Apply existing access rules to lists, counts, search results and detail pages. The dashboard is a frontend page backed by the same Sidekick service, not an additional microservice.

### 7.5 Requests and approvals

**REQ-01:** Provide structured templates for access, operational changes, quote changes, payment corrections, and feature requests.

**REQ-02:** Each template defines required fields, owning service/team, approver scope, fulfilment method, and completion evidence.

**REQ-03:** Suggested lifecycle: Submitted → Under Review → Awaiting Approval → Approved / Rejected → In Progress → Completed. Support cancellation where business rules permit and an explicit failed fulfilment state.

**REQ-04:** Sidekick records approval decisions; the owning service must independently validate the actual action. Approval must not bypass record access, business state, or service rules.

**REQ-05:** Before a data-changing action, show the exact proposed change to the authorised actor. Record request, approval, execution identity, outcome, and correlation reference. Use idempotency keys for retryable submissions.

### 7.5.1 Owner-change and deletion requests with multiple record selection

**BULK-01:** Add Change Record Owner and Delete Record request types, scoped to supported service/entity combinations. These concern business records such as projects, not the assigned support agent. Configure who can submit each request, its required fields, approvers and authorised executor using existing permissions.

**BULK-02:** In the Create Request form, let users search by project/record ID, project or associated customer name, or associated phone number where supported by the owning service. Allow multiple search values and multiple selected records in one request, including selections collected across searches. Store canonical service, entity type and record IDs; names and phone numbers are lookup values rather than unique identifiers.

**BULK-03:** Show only permitted matching records with enough allowed context to distinguish them: project ID/name, city, store and current owner, with phone masking where required. If a name or phone matches multiple records, require explicit selection. Never silently select all matches. Deduplicate selections by canonical service/entity/record ID, permit removing selections and apply a configurable batch limit.

**BULK-04:** Owner-change requests require the selected records, proposed new owner and reason. The new owner must be active and eligible for every target under the owning service's assignment rules. Preview current and proposed ownership for each selected record.

**BULK-05:** Deletion requests require selected records, reason and explicit confirmation of the exact selection/count. The owning service determines whether deletion, archival or rejection is allowed based on dependencies, record state and business policy. Preserve the support request and audit outcome even when the business record is removed.

**BULK-06:** Submitting a request does not execute owner changes or deletion. Record the exact target list, action and proposed owner, then apply configured review/approval. Changes to approved targets, action or owner invalidate the previous approval and require revalidation and approval where configured.

**BULK-07:** Check permission to submit independently from permission to execute. A controlled access-request workflow may be available, but submission, approval or a pasted identifier must never bypass business-record visibility or owning-service execution rules.

**BULK-08:** Revalidate record versions, current scope, eligibility and approval before execution. If records changed after review, flag them for renewed review instead of applying stale approval. Execute through owning-service APIs or assigned authorised fulfilment; record a result for every target.

**BULK-09:** Show Pending, Succeeded, Failed or Skipped per record, and distinguish overall Completed, Partially Completed and Failed execution outcomes. Retry only unresolved eligible targets using per-record idempotency protection; do not silently repeat successful actions. Do not imply cross-service atomic completion.

### 7.6 Support-team configuration

**TEAM-01:** Admins can create service-level teams and module-specific overrides. Each assignment stores the Identity Management user ID and displays the current name.

**TEAM-02:** Support one person, a primary and secondary pair, or multiple ordered fallback users. Prevent duplicate positions and duplicate users within the same routing chain.

**TEAM-03:** Configure primary user, secondary user, ordered fallback users, ring duration, working hours/timezone, availability, final fallback team, and transfer/invitation permissions.

**TEAM-04:** Proposed routing precedence: module-specific team → service team → configured central support fallback. Show a clear unconfigured state if no eligible destination exists.

**TEAM-05:** Validate membership on save and recheck active status when routing. Deactivated users cannot receive new calls. Preserve historical assignments in audit records.

**TEAM-06:** Allow multiple Support Admins with scoped administrative access. Keep permanent membership changes separate from temporary call invitations.

Initial assignments supplied by Sangar; exact identities must be selected from Identity Management:

| Service / module | Primary | Secondary | Additional fallback |
|---|---|---|---|
| Quote Builder | Sutharsan | To configure | Optional |
| ERP | Vishu | Santhosh | Optional |
| CRM | Abdul | To configure | Optional |
| Payments | Sangar | To configure | Optional |

These are planned mappings, not completed account assignments. Quote Service ownership is separate from Quote Builder ownership unless explicitly configured otherwise.

### 7.7 Sequential call routing

**ROUTE-01:** Resolve the affected service/module from the ticket or conversation. Ask for clarification or allow manual selection if classification is uncertain.

**ROUTE-02:** Ring the eligible primary person first. If they answer, establish the call and cancel all remaining routing attempts.

**ROUTE-03:** If unanswered within the configured duration, declined, unavailable, or busy, move to the next eligible person in order. Suggested starting ring duration is 25 seconds, subject to admin configuration.

**ROUTE-04:** Do not forward an answered call automatically. Transferring an active call requires an explicit authorised action.

**ROUTE-05:** If all destinations fail, record the missed attempt and create or update the associated ticket. Offer a callback and notify the configured fallback team. Do not leave the caller in an endless loop.

**ROUTE-06:** Stop routing immediately if the caller cancels or disconnects. Reserve agents when accepting calls to prevent simultaneous assignment conflicts.

**ROUTE-07:** Use atomic acceptance so late answers, duplicate events, or delayed notifications cannot connect two agents accidentally. A late answer after fallback has advanced must not create a second active call.

**ROUTE-08:** Distinguish Available, Busy, Away, and Off Duty. Working hours and manual availability determine eligibility according to configured policy.

### 7.7.1 Admin-configured calling calendars and holidays

**CAL-01:** Support Admins can configure calling hours, weekly days off, full-day holidays, partial-day closures and exceptional working days, with calendar names, dates, timezone and scope. Support company-wide calendars plus service/team and city/store calendars where applicable.

**CAL-02:** Treat closures as an eligibility restriction: all applicable calendars must allow the attempt. An exceptional working day overrides the specified closure only within its own authorised calendar scope; it cannot silently override a company-wide closure. A holiday does not become available merely because an agent's manual presence says Available.

**CAL-03:** Recheck eligibility before every routing attempt, transfer and invitation. On closure, show support is unavailable and the next opening when calculable, keep ticket/request creation available and offer callbacks only in eligible slots. Do not auto-forward into a closed fallback team.

**CAL-04:** Admins may explicitly configure an authorised holiday/on-call team as an exception with its own calendar. Without that configuration, no holiday call is attempted. Calls already connected may finish; calendar changes affect new attempts and callback availability.

**CAL-05:** Apply calendars to scheduled callbacks and reminders. If a calendar update invalidates a booked slot, flag it for rescheduling and notify participants rather than silently moving or dropping it. Validate callback eligibility again at call time. Record all calendar changes in audit history.

### 7.8 Calls and screen sharing

**CALL-01:** Provide in-app audio/video calls, participant list, accept/decline, mute, camera controls, leave/end, and connection status.

**CALL-02:** Sidekick owns call sessions, invitations, participants, permissions, and ticket linkage. WebRTC media infrastructure carries audio, video, and shared screens.

**CALL-03:** Users explicitly choose a screen, window, or browser tab and can stop sharing at any time. Remote control is not included.

**CALL-04:** Restrict call entry to authorised participants using short-lived session access. Enforce ticket and business-data permissions independently of call participation.

**CALL-05:** Support reconnection and clear failure states. Browser/device screen-sharing compatibility must be tested and unsupported capabilities explained in the UI.

**CALL-06:** Scheduled calls use Scheduler Service and Notification Service. Store scheduled time with timezone-aware presentation.

**CALL-07:** Keep call start/end, duration, attempts, participants, transfer events, and notes against the ticket. Recording and AI transcription are optional future features subject to explicit policy and consent.

### 7.9 Wrong routing, transfers, and adding people

**XFER-01:** An authorised agent can select another service/team or an individual permitted support user and request a transfer.

**XFER-02:** Use a warm transfer: the original agent remains connected until the recipient accepts and handover succeeds. If declined, timed out, or technically failed, retain the original call and show the failure.

**XFER-03:** Agents can invite an authorised colleague for joint support. Participation does not automatically grant access to private records or internal notes.

**XFER-04:** Reassign the ticket explicitly, or through a configured transfer rule, with ownership clearly shown. A temporary invitation must not silently change ticket ownership.

**XFER-05:** Adding a colleague to the current call is temporary. Permanent addition to a support team requires a Support Admin, a service/module mapping, and routing position. Non-admin agents may submit a membership request.

**XFER-06:** Preserve chat summary, attachments, troubleshooting, and call history during handover. Record who initiated and accepted the transfer.

## 8. Main business journeys

### Journey A — Answer a question

User opens Sidekick → permissions checked → question and page context collected → permitted documents searched → clarification if needed → live API read if needed → source-backed answer → user confirms resolution or escalates.

### Journey B — Report a bug

User reports failure → Sidekick collects reproduction details and evidence → ticket created → correct support team notified → agent investigates → optional call → fix/resolution communicated → user confirms or reopens.

### Journey C — Submit a request

User describes need → matching request template selected → fields collected → approval obtained if required → owning service executes or responsible agent fulfils → outcome tracked → user notified. Rejection includes a reason; failed execution remains visible for follow-up.

### Journey D — Primary and secondary calling

ERP issue → Vishu is called first → if Vishu accepts, connect and stop → otherwise try Santhosh → if Santhosh accepts, connect → if nobody accepts, record missed support and offer callback.

### Journey E — Wrong service or extra support

ERP agent answers → identifies Payment dependency → invites Sangar for joint investigation or initiates a warm transfer → recipient accepts → ownership updated explicitly → ticket retains the complete history. A failed transfer leaves the original agent connected.

### Journey F — Configure support

Support Admin selects a service/module → selects active identity users → orders primary/secondary/fallback → configures hours and timeout → validates and saves → audit entry recorded → new routing applies to new calls. Active calls retain their routing snapshot unless deliberately transferred.

### Journey G — Submit directly from the Ticket Dashboard

User opens the separate Ticket Dashboard → clicks Create Request → selects type and service/module → completes required fields and submits → item appears in the dashboard with its ID, current status and support assignment when available → user opens details to follow comments, attachments and status history. Tickets raised through Sidekick also appear here.

## 9. Required screens

| Screen | Key content |
|---|---|
| Embedded Sidekick | Chat, sources, attachments, create ticket/request, call support |
| Ticket Dashboard — separate page outside Sidekick | Create Request button; accessible tickets and requests with current status, assigned support, search and status/service filters; links to details |
| Ticket Details | Current status, timestamped status history, owner, public progress, resolution notes, conversation, attachments and calls; internal notes restricted to authorised staff |
| Request Details | Selected records, proposed changes, approvals, per-record outcomes and overall fulfilment status |
| Support Workspace | Queues, assignments, availability, incoming and active calls |
| Call Window | Participants, audio/video, sharing, transfer, invite, connection state |
| Support Team Configuration | Service/module, primary, secondary, fallback order, hours, holiday calendars, city/store scope, timeout and admins |
| Knowledge Administration | Document ownership, versions, publishing and ingestion failures |
| Integration Settings | Registered services, connector status, permitted operations |
| Reports and Audit | Resolution performance, missed calls, transfers, unanswered questions, changes |

## 10. Logical data ownership

| Sidekick entity | Purpose |
|---|---|
| Service registry / module registry | Supported systems, ownership, integration references |
| Knowledge document / version / section | Approved knowledge and source tracking |
| Conversation / message | Chat history and context |
| Ticket / comment / attachment link / activity | Support issue lifecycle |
| Request / approval / execution | Controlled operational workflows |
| Support team / membership / routing policy | Support assignment and ordered routing |
| Agent availability | Presence and eligibility |\n| Calling calendar / closure / exception | Working hours, holidays, scope and callback eligibility |\n| Request target / per-record execution | Canonical selected records, proposed action, version and individual outcome |
| Call session / attempt / participant / transfer | Complete call lifecycle |
| Callback appointment | Scheduled support follow-up |
| Audit event / notification reference | Traceability and delivery references |

Store external record IDs and file references where appropriate, avoiding unnecessary copies of business records and file bytes. Sidekick should not duplicate Identity Management as a separate user authority.

## 11. Security, reliability, and operational requirements

- Enforce tenant, branch, city, store, service, role, permission, record, and document access at the backend.
- Protect service credentials and issue only scoped integration access.
- Maintain audit records for administrative, approval, routing, transfer, and business actions.
- Use correlation IDs across support and business-service requests.
- Apply timeouts and safe retries; prevent duplicate tickets, requests, calls, notifications, and business actions.
- Keep support history available when the AI or a business connector is down; show manual escalation options.
- Handle notification or scheduling failures explicitly without silently discarding the underlying ticket or callback request.
- Define retention, deletion, backup, and recovery policies before production.
- Do not expose private notes or restricted source documents through summaries, search, or call invitations.
- Instrument latency, connector failures, document publishing failures, routing attempts, and media errors.
- Agree measurable performance, concurrency, uptime, and recovery targets before release; no numerical commitments are assumed in this draft.

## 12. Reporting and success measures

Track AI-assisted resolution rate, unresolved questions, document gaps, ticket volume by service, time to first response, time to resolution, reopened tickets, request approval/fulfilment time, primary and secondary answer rates, missed calls, transfers, failed transfers, and callback completion.

Definitions must separate an AI answer being displayed from a user confirming resolution. Targets should be agreed after collecting baseline data.

## 13. Delivery phases

| Phase | Deliverable | Exit condition |
|---|---|---|
| 1 — Foundation | Identity, service registry, Sidekick database, widget, basic access control | Users access only authorised support data |
| 2 — Knowledge | CRM documents, ingestion/versioning, retrieval, clarification, cited answers | Known questions answer correctly; unknowns escalate |
| 3 — Tickets and requests | Separate Ticket Dashboard, Create Request, forms, summaries, queues, approvals, notifications | End-to-end submission, assignment and resolution work |
| 4 — Service expansion | CRM live reads, followed by ERP, Quotes, Payments and other connectors | Each connector passes permission and failure checks |
| 5 — Support calling | Team admin, ordered routing, audio/video, sharing, transfer, invitations, callbacks | Primary/fallback and handover journeys pass |
| 6 — Controlled actions and reporting | Selected write workflows, audit, analytics | Actions are approved, validated and safe to retry |

These are delivery increments; all agreed features remain in the overall scope. Estimate dates after API contracts, team capacity, and calling infrastructure are established.

## 14. Acceptance criteria

| ID | Scenario | Expected result |
|---|---|---|
| AC-01 | User asks a documented question | Correct permitted source and version appear with answer |
| AC-02 | Essential detail is missing | Sidekick asks a focused question and preserves supplied context |
| AC-03 | No reliable answer exists | Sidekick states the gap and enables ticket escalation |
| AC-04 | Live payment status is requested | Authorised Payment API is used; documentation is not treated as live data |
| AC-05 | Cross-tenant record/document is requested | Access is denied without leaking restricted content |
| AC-06 | User submits the same ticket through a retry | One ticket is created and returned consistently |
| AC-07 | Request needs approval | Execution waits for valid approval and owning-service validation |
| AC-08 | Primary agent answers | Call connects and no secondary attempt remains active |
| AC-09 | Primary does not answer | Next eligible agent rings after configured timeout |
| AC-10 | Primary is busy or off duty | Agent is skipped according to routing policy |
| AC-11 | Nobody answers | Missed attempt is logged, ticket is preserved, callback is offered |
| AC-12 | Caller cancels during routing | All outstanding attempts stop |
| AC-13 | Late answer arrives after fallback | Atomic acceptance prevents a second connection |
| AC-14 | Wrong team answers | Agent can transfer with context and explicit ownership handling |
| AC-15 | Transfer fails | Original call remains available and failure is shown |
| AC-16 | Agent adds a colleague | Authorised colleague joins; permanent team membership is unchanged |
| AC-17 | Non-admin edits permanent routing | Change is rejected; membership request remains possible |
| AC-18 | User starts/stops screen sharing | Only selected content is shared and sharing ends on user action |
| AC-19 | Document update fails indexing | Previous valid version remains active and failure is visible |
| AC-20 | Business API is down | Sidekick reports unavailability and permits support escalation |
| AC-21 | Ticket moves between services | History, attachments and call links remain intact |
| AC-22 | Multiple admins are configured | Each can manage only their permitted configuration scope |
| AC-23 | User opens Ticket Dashboard or Ticket Details | Current status, service, owner and update time are visible for accessible tickets |
| AC-24 | Agent changes a ticket status | Saved status and public history update; notification is attempted; refresh/reconnect retrieves the latest state |
| AC-25 | Ticket needs user input or is resolved | Required user action or resolution notes are clearly shown |
| AC-26 | User searches, filters or opens a ticket | Only authorised tickets are returned; internal notes and restricted details remain hidden |

| AC-27 | User opens the separate Ticket Dashboard without using chat | Create Request, accessible ticket/request list and status filters are available |
| AC-28 | User submits a valid dashboard request | One record is created and appears with its ID and appropriate status |
| AC-29 | A ticket is raised through Sidekick | The same ticket appears in the external dashboard with matching ID, status and history |

| AC-30 | Holiday or partial closure applies | Closed agents/teams are not rung; user can raise a request and select an eligible callback slot |
| AC-31 | An authorised on-call exception exists | Only eligible configured holiday support is attempted and the decision is auditable |
| AC-32 | User asks outside role, permission, city or store scope | Restricted knowledge/data never enters the response; no protected record existence is disclosed |
| AC-33 | User submits multiple IDs, names or phone numbers | Only authorised matches appear; ambiguous matches require selection and duplicates are removed |
| AC-34 | Owner-change request is submitted | Exact targets, proposed owner and reason are stored; no business change occurs from submission alone |
| AC-35 | Deletion request is approved | Exact selection, current permissions and service deletion rules are checked before execution |
| AC-36 | Some bulk targets fail | Per-record results and partial outcome are visible; retries do not repeat successful operations |
| AC-37 | Approved targets or proposed owner change | Previous approval is invalidated and applicable review is repeated |
| AC-38 | Holiday configuration invalidates a booked callback | Booking is flagged for rescheduling and participants are notified |

## 15. Dependencies and decisions to finalise

1. Confirm identity user IDs for Sutharsan, Vishu, Santhosh, Abdul, and Sangar; define backups for currently empty roles.
2. Confirm initial CRM/ERP applications and which services launch first.
3. Map existing role/permission and tenant/branch/city/store policies, including multi-city/store users and Support Admin scopes.
4. Supply the first Markdown documents and assign their publishing owners.
5. Confirm API contracts, authentication delegation, error formats, and service versions.
6. Decide calling infrastructure, supported browsers/devices, and concurrent call expectations.
7. Finalise ring duration, working hours, central fallback ownership, callback behaviour, and SLA targets.
8. Define request templates and approvers, especially access changes and payment corrections.
9. Decide retention rules and whether recording/transcription will be included later.
10. Confirm notification channels and production operations ownership.\n11. Configure holiday calendars, partial closures, applicable scopes and any explicitly staffed holiday/on-call exception.\n12. Define supported entities and lookup fields, bulk limits, eligible new-owner rules, approvers and deletion/archive policies.

## 16. First implementation milestone

Deliver one complete CRM support journey: authenticated user opens Sidekick → asks about CRM → receives guidance from approved Markdown → clarifies the issue → authorised CRM data is checked if needed → unresolved issue becomes a ticket → configured CRM support receives the notification → user tracks the response.

Then expand the same documentation, connector, and ownership pattern across ERP, Quote Builder, Payments, and remaining services. Introduce sequential calling once team configuration and ticket ownership are reliable.