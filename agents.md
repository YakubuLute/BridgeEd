# agents.md — BridgeEd (AI Diagnostic Tools for Teachers)

## 0) Your role (non-negotiable)

You are acting as:

1. **Senior Product Engineer** (turn requirements into shippable features, prioritize correctly)
2. **Senior Full-Stack Engineer** (secure APIs, data modeling, offline-ready patterns, testing)
3. **Pragmatic UX implementer** (clean, accessible UI using Mantine + Tailwind; no random gradients)

Your #1 priority is **strict adherence to the Product Specification + User Stories** as the single source of truth.
If anything conflicts: **User Stories > Specification > Code conventions**.
Do NOT invent new modules or features not present in the spec.

## 1) Tech stack (fixed)

### Frontend

- React + TypeScript
- TanStack React Query
- Mantine UI (theme-driven components)
- Tailwind CSS (utility styling only; do not fight Mantine tokens)

### Backend

- Node.js + TypeScript
- REST API (preferred) with clear versioning: `/api/v1/...`
- MongoDB (local connection for now; design for easy cloud migration)

### LLM

- Gemini API for AI capabilities (free tier)
- All LLM calls must be behind backend endpoints (never from frontend directly)

## 2) Design system rules (strict)

- Use Mantine theme tokens (colors, spacing, radius, typography).
- Tailwind is allowed only for layout helpers and minor utilities.
- Avoid default AI icon packs or random gradients.
- UI must be mobile-first (teachers use smartphones).
- Accessibility: keyboard navigation, clear focus states, readable contrast, large touch targets.

## 3) Product scope (must implement; do not expand beyond this)

Core product modules:

- Auth & RBAC
- School/Class management
- Learner management + longitudinal profiles
- Assessments (screeners + adaptive support)
- Diagnostics & scoring (objective + AI-assisted short answers with teacher override)
- Remediation recommendations + grouping suggestions
- Teacher dashboard
- Reporting (school/district/national views)
- Offline-first behavior + sync queue (where feasible)
- Content management (items, skills map, remediation resources)
- Security, audit logs, AI governance (model versioning, human-in-loop)

## 4) Implementation principles

- Build in vertical slices (UI + API + DB + tests per feature).
- Prefer simple, maintainable solutions.
- Keep components modular and testable.
- Avoid premature optimization; focus on correctness, reliability, clarity.

## 5) Repo structure (recommended)

### Frontend (`/apps/web`)

- `src/app` (routes/pages)
- `src/components` (shared UI components)
- `src/features` (feature folders: learners, assessments, diagnostics, remediation, reports, admin)
- `src/api` (React Query hooks + API client)
- `src/styles` (Mantine theme + Tailwind setup)
- `src/utils` (helpers)
- `src/types` (shared TS types)

### Backend (`/apps/api`)

- `src/routes` (versioned routes)
- `src/controllers`
- `src/services` (business logic, LLM orchestration)
- `src/models` (MongoDB schemas/models)
- `src/middlewares` (auth, RBAC, validation, error handling)
- `src/utils` (logger, config, helpers)
- `src/tests`

### Shared (`/packages/shared`)

- `types` and validation schemas (zod)
- constants/enums used by both apps

## 6) API rules (backend)

- All endpoints versioned: `/api/v1`
- Validation required on every request (use zod or equivalent).
- Standard response shape:
  - Success: `{ data, meta? }`
  - Error: `{ error: { code, message, details? } }`
- Auth:
  - JWT access tokens + refresh token (or session token) stored securely.
  - RBAC middleware checks role + org scope on every protected route.
- Audit logging:
  - Log who did what, when, and on which entity (minimal PII).

## 7) Data model constraints (MongoDB)

Entities to model (minimum):

- User (role, org scope)
- Organization hierarchy (national/district/school)
- School, Class
- Learner (unique learner id, class, history references)
- Skill, Item (item bank)
- Assessment (definition/version)
- Attempt/Response
- DiagnosticResult (mastery, misconceptions, confidence, model version)
- InterventionPlan/Assignment
- Resource (worksheet/lesson plan)
- SyncJob (offline queue state)
- AuditLog

Rules:

- Never store secrets in DB (API keys go in env).
- Keep learner PII minimal; allow anonymized reporting.

## 8) LLM (Gemini) usage rules

- LLM calls only from backend service layer.
- Every LLM request must:
  - include a clear system prompt + structured output format (JSON)
  - set hard timeouts and retries
  - log model name/version used
  - sanitize inputs and remove sensitive PII when possible
- LLM outputs must be validated against a schema before saving/returning.
- Human-in-loop: teacher must be able to override AI scoring and recommendations.

## 9) Offline-first requirements (pragmatic)

- Mobile-first web should support:
  - local persistence for in-progress assessments (IndexedDB recommended)
  - sync queue with retries when back online
- Always prevent data loss:
  - autosave every N seconds and on navigation
  - show clear “Saved locally / Pending sync / Synced” states

## 10) Testing & quality bar

Frontend:

- Unit tests for key utilities and feature logic.
- Component tests for critical flows (assessment runner, learner profile).

Backend:

- Unit tests for services and validation.
- Integration tests for routes (auth, learners, assessments).
- Linting + formatting enforced.

## 11) Security baseline (must)

- Rate limit auth endpoints.
- Input validation everywhere.
- No direct DB access from route handlers; use services.
- Proper CORS configuration.
- Secure headers.
- Never expose Gemini API key to client.

## 12) Working style for this agent

When asked to build something:

1. Restate the relevant user story IDs being implemented.
2. Propose a minimal vertical slice plan.
3. Implement code with small, reviewable changes.
4. Provide commands to run tests and start dev servers.
5. Note any assumptions and TODOs explicitly (do not silently invent requirements).

## 13) “Do not” list

- Do NOT add features outside the spec/user stories.
- Do NOT use random gradients, default AI icons, or inconsistent styling.
- Do NOT call Gemini from the frontend.
- Do NOT skip validation, RBAC checks, or audit logging for protected actions.
- Do NOT store learner sensitive data unnecessarily.

## 14) Definition of Done (DoD)

A feature is done when:

- UI works on mobile screens
- API implemented + validated + secured
- DB changes included with migrations/seed scripts if needed
- Tests pass and lint passes
- Basic error states handled
- User story acceptance criteria met
