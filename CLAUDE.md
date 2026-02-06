# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**First Approval** (https://firstapproval.io) — an academic/research publication platform. Monorepo with 4 independent apps, no shared workspace tooling (no nx/turborepo/lerna). Each app has its own dependencies and build process.

License: CC BY-NC-ND 4.0.

## Repository Structure

```
backend/      — Spring Boot 3.1 + Kotlin 1.8 (JVM 17, Gradle)
frontend/     — React 18 + TypeScript main web app (port 3000)
landing/      — React 18 landing page (port 3001)
team/         — React 18 team page (port 3002)
```

## Build & Run Commands

### Backend (from `backend/`)

```bash
./gradlew core:build            # Build
./gradlew core:bootRun          # Run (port 8080)
./gradlew test                  # Run tests (JUnit 5)
```

Gradle subprojects: `core` (main app), `core:api` (OpenAPI codegen).

### Frontend (from `frontend/`)

```bash
npm install --force             # Install deps (--force needed due to peer dep conflicts)
npm run api-local               # Generate TypeScript API client from OpenAPI spec
npm run start-local             # Generate API + dev server (port 3000, proxied to backend:8080)
npm run build-local             # Production build (local env)
npm run build-dev               # Production build (dev env)
npm run build-prod              # Production build (prod env)
npm test                        # Jest tests
npm run lint-fix                # ESLint autofix
```

API client generation uses `openapi-generator-cli` → outputs to `src/apis/first-approval-api/`. The OpenAPI spec lives at `backend/core/api/src/core.openapi.yaml`.

If `npm run api-local` fails with the build-scripts wrapper, run the generator directly:
```bash
npx openapi-generator-cli generate -g typescript-axios \
  -i ../backend/core/api/src/core.openapi.yaml \
  -o src/apis/first-approval-api \
  --server-variables=URL=http://localhost:3000 \
  --additional-properties=stringEnums=true,enumPropertyNaming=original,removeEnumValuePrefix=false,serviceSuffix=ApiService
```

### Landing / Team (from respective dirs)

```bash
npm install && npm start        # Dev server (landing:3001, team:3002)
npm run build                   # Production build
```

### Infrastructure (from root)

```bash
docker-compose up               # PostgreSQL 15.3, MinIO (S3-compatible), Elasticsearch 8.8.2
```

Local defaults: postgres:postgres@localhost:5432 (schema `first_approval`), MinIO at localhost:9000 (minioadmin/minioadmin), Elasticsearch at localhost:9200.

## Architecture

### Backend

**OpenAPI-first**: `core.openapi.yaml` is the single source of truth for the API contract. A custom Gradle plugin (`core-openapi-plugin` in `buildSrc`) generates Java server interfaces into `org.firstapproval.api.server`. Controllers in `web/` implement these generated interfaces. Generated models use Java bean style (setters return `this` for chaining), not Kotlin named parameters.

**Layer structure** (`backend/core/src/main/kotlin/org/firstapproval/backend/core/`):
- `web/` — REST controllers (Auth, Publication, User, Config, Registration, Report, Moderation, etc.)
- `domain/` — Business logic organized by bounded context (publication, user, auth, archive, moderation, notification, organizations, visitor, etc.)
- `external/` — External service integrations (S3, Elasticsearch, email, OAuth providers)
- `config/` — Spring configuration, security setup, property classes (`Properties.kt`)
- `infra/` — Infrastructure concerns

**Security model** (via `WebSecurityConfig.kt`): Three security schemes defined in OpenAPI spec, resolved at runtime by `ApiService.kt` which reads `@Operation(security=...)` annotations from generated interfaces:
- `PublicAuth` — no authentication, `permitAll` (via `PublicAuthConfigurer`)
- `TokenAuth` — JWT bearer token (via `BearerAuthConfigurer`)
- `BasicAuth` — admin endpoints (via `BasicAuthConfigurer`)

To add a new endpoint: define it in `core.openapi.yaml` with the appropriate `security` scheme, rebuild to generate the interface, then implement the interface in a `@RestController`.

**Configuration**: Properties are grouped in `config/Properties.kt` as `@ConfigurationProperties` inner classes. Environment-specific overrides in `application-{local,dev,prod}.properties`. Public config is exposed via `GET /api/v1/config`.

**Database**: PostgreSQL with Flyway migrations (`resources/db/migration/`, V10–V93). Schema: `first_approval`.

**Key integrations**: AWS S3/MinIO for file storage, Elasticsearch for publication search, Crossref for DOI assignment, Gmail SMTP for email, OpenHTML2PDF for PDF generation, Shedlock for distributed scheduling.

### Frontend

**App initialization** (`src/index.ts`): Sequential async init: `initConfig()` → `initAuth()` → `initRouter()` → `initLinkMappingRedirects()` → React render.

**State management**: MobX (observable stores). Key stores:
- `core/AuthStore.ts` — JWT token persistence, login/logout
- `core/UserStore.ts` — Current user state
- `core/router/RouterStore.ts` — Custom MobX-based routing (no react-router)

**Services** (`core/service.ts`): All API service instances are created here. Authenticated services use a shared `Configuration` with `accessToken`. Public services (e.g. `configService`) are created without auth config.

**Config** (`core/config.ts`): Fetches `/api/v1/config` on startup, stores in `sessionStorage`. Access anywhere via `getAppConfig()`.

**UI**: Material-UI 5 (MUI) + Emotion. Rich text editing via Lexical. Page titles managed via `react-helmet`.

**Pages** (`src/pages/`): home, publication, login, signup, restore, user, contacts, contest.

**Environment files**: `.env.development`, `.env.production`, `.env.test` — contain `REACT_APP_*` variables baked in at build time (API URL, WebSocket URL, etc.).

**API layer**: Auto-generated TypeScript-Axios clients from OpenAPI spec (in `src/apis/first-approval-api/`). Do not edit generated files manually — regenerate after spec changes.

## Code Style

### Frontend
- Prettier: single quotes, no trailing commas, tab width 2, JSX bracket same line
- ESLint: `standard-with-typescript` + `prettier` + `plugin:react/recommended`
- Max line length: 140 chars
- HTML sanitization required via `dompurify` (enforced by `jam3/no-sanitizer-with-danger` rule)

### Backend
- Kotlin with strict JSR305 null-safety annotations (`-Xjsr305=strict`)
- Spring Boot conventions

## Deployment

GitHub Actions workflows (`.github/workflows/`): manual dispatch with dev/prod environment selection. Multi-stage Docker builds → GHCR → SSH deploy. Frontend deployment copies the OpenAPI spec before build.

## Key Patterns

- When changing the API contract, edit `core.openapi.yaml` first, then regenerate both backend (`./gradlew core:build`) and frontend (`npm run api-local` or npx fallback) clients.
- The `build-scripts.js` in frontend orchestrates OpenAPI generation + react-scripts build in one command.
- Frontend uses a custom `RouterStore` (MobX) instead of react-router. Route definitions are in `core/router/`.
- File uploads go through S3-compatible storage (MinIO locally, AWS S3 in prod). Max upload: 16GB.
- Three environments: `local`, `dev`, `prod` — configured via Spring profiles and frontend `.env.*` files.
