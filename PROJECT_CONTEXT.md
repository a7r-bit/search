# PROJECT CONTEXT

Last updated: 2026-03-29

## 1. Project Overview

This repository is a NestJS backend service named `search`.

Primary business responsibilities:
- User authentication via LDAP.
- User role and permission handling with JWT tokens.
- Hierarchical node management (directories and documents).
- Document versioning with file upload support.
- Asynchronous document conversion to PDF.
- Text extraction from PDF and indexing/search in Elasticsearch.
- Group-based access policies for nodes.
- Optional import of directory trees from filesystem.
- Integration with an external employees/departments API.

In short: it is a document and directory management API with role-based and group-based access control, full-text search, and async conversion pipeline.

## 2. Tech Stack

### Runtime and framework
- Node.js + TypeScript
- NestJS v11
- Express platform (`@nestjs/platform-express`)

### Data and persistence
- PostgreSQL (primary relational database)
- Prisma ORM (`@prisma/client`, `prisma`)
- Prisma migrations in `prisma/migrations`

### Search and indexing
- Elasticsearch 8.x (`@nestjs/elasticsearch`, `@elastic/elasticsearch`)
- Indexed entities: `nodes`, `document_versions`

### Queue and background processing
- BullMQ (`@nestjs/bullmq`, `bullmq`)
- Redis as queue broker
- Worker processor for document conversion

### Auth and identity
- LDAP auth (`passport-ldapauth`, `@nestjs/passport`)
- JWT tokens (`@nestjs/jwt`)
- Access and refresh token flow with DB-stored refresh token

### File and document processing
- Multer memory storage for upload ingestion
- File storage on mounted local volume (`uploads`)
- Gotenberg service for DOC/DOCX -> PDF conversion
- `pdf-parse` for text extraction

### API and validation
- Swagger (`@nestjs/swagger`, `swagger-ui-express`)
- Validation with class-validator/class-transformer and global `ValidationPipe`

### Tooling
- ESLint + TypeScript ESLint + Prettier
- Jest for unit tests and e2e tests
- Docker Compose dev environment

## 3. High-Level Architecture

The service follows a modular NestJS architecture:
- Controllers expose HTTP endpoints.
- Services contain business logic.
- PrismaService handles DB access.
- Guard chain enforces auth and scope policies.
- SearchService abstracts Elasticsearch operations.
- BullMQ processor handles expensive async conversion/indexing jobs.

### Request path (typical)
1. Request enters controller route under `/api/*`.
2. Global guards run:
   - `AccessGuard`: validates JWT, resolves user + active role + permissions.
   - `ScopeGuard`: checks `@Scope(...)` metadata against resolved permissions.
3. Optional route guard (example: `CheckGroupPolitic`) validates node-level access by group policy.
4. Service performs DB logic via Prisma.
5. Related search index updates are pushed to Elasticsearch (sync or async depending on flow).
6. DTOs/mappers shape response.

### Background processing path (document upload)
1. API uploads file and creates `DocumentVersion` + `MediaFile` in DB transaction.
2. Job is enqueued to `documentConversion` queue.
3. Worker:
   - marks conversion `IN_PROGRESS`;
   - converts DOC/DOCX to PDF via Gotenberg (or reads PDF directly);
   - extracts text;
   - updates storage path and DB status (`DONE`/`FAILED`);
   - indexes document version into Elasticsearch.

## 4. Folder Structure With Explanations

## Root
- `src/` : application code.
- `prisma/` : schema, migrations, and seed script.
- `docker/` : container and bootstrap scripts.
- `uploads/` : mounted file storage for originals and converted files.
- `test/` : e2e test bootstrap.
- `docker-compose.dev.yml` : full local dev stack orchestration.

## src
- `main.ts` : app bootstrap (global prefix, pipes, CORS, Swagger, static uploads).
- `app.module.ts` : root module, imports all feature modules, registers global guards.
- `common/` : cross-cutting constants, guards, decorators, custom pipes, shared DTO types.
- `modules/` : feature modules grouped by domain.

## src/common
- `constants.ts` : app role enum, LDAP-group to app-role mapping, JWT config constants, Elasticsearch index enum.
- `decorators/` : metadata/decorators for scope/permission/role/user and sorting parsing.
- `guards/` : access control and LDAP guard wrappers.
- `pipes/` : custom UUID parse pipe and custom file type validator.
- `elasic-search-models/` : DTOs used to normalize index payloads.

## src/modules (key modules)
- `auth/` : sign-in and role switching.
- `ldap/` : LDAP passport strategy.
- `token/` : access/refresh token generation, verification, persistence.
- `user/` : user retrieval and management.
- `role/` : role lookup and permissions resolution.
- `politic/` : group policy sync and node access resolution.
- `node/` : directory/document node tree CRUD and traversal.
- `document-version/` : version CRUD, file upload, metadata updates.
- `file-storage/` : local disk file operations.
- `bullmq/` : queue config, producer, and worker processor.
- `gotenberg/` : integration for office document conversion.
- `pdf/` : PDF text extraction.
- `search/` : Elasticsearch client + search/index/update/delete wrappers.
- `global-search/` : user-facing search orchestration.
- `liked-node/` : bookmark-like save/remove nodes per user.
- `import/` : recursive filesystem import into nodes + versions.
- `emplayees_parser/` : external employees/departments API client.
- `prisma/` : Prisma module/service wrapper.

## prisma
- `schema.prisma` : canonical data model and enums.
- `migrations/` : migration history.
- `seed.ts` : initial data seeding.

## docker
- `Dockerfile` : app container build.
- `init-prisma.sh` : startup/migration init flow.
- `postgres/init/01-extensions.sql` : PostgreSQL extension bootstrap.
- `elasticsearch/` : Elasticsearch image customization.

## 5. Data Model Summary (Prisma)

Core entities:
- `User` : LDAP-linked user profile (`uidNumber`) with role links and politic groups.
- `Role` and `Permission` : role-permission RBAC.
- `RefreshToken` : one refresh token per user.
- `Group` : policy groups, optionally linked to external employee department IDs.
- `Node` : hierarchical tree item (`DIRECTORY` or `DOCUMENT`) with parent-child relation.
- `NodeAccess` : policy group permissions on node (`READ`, `WRITE`, `DELETE`, `ADMIN`).
- `DocumentVersion` : version record per document node with conversion status.
- `MediaFile` : physical file metadata/path attached to version.
- `LikedNode` : user-node favorite relation.

Notable constraints:
- `Node` unique by `(parentId, name, type)`.
- `DocumentVersion` unique by `(version, nodeId)`.
- `NodeAccess` unique by `(groupId, nodeId)`.
- `LikedNode` unique by `(userId, nodeId)`.

## 6. API Structure

All routes are prefixed with `/api`.
Swagger is exposed at `/docs`.

Main controller groups:
- `/auth`
  - `POST /signIn`
  - `POST /switch-role`
- `/users`
  - `GET /`
  - `GET /:id`
  - `GET /by-uid_number/:uid`
- `/node`
  - `POST /`
  - `GET /children`
  - `GET /:id`
  - `PATCH /:id`
  - `PUT /:id/move`
  - `GET /:id/path`
  - `GET /path/root`
  - `DELETE /:id`
- `/document-versions`
  - `GET /`
  - `GET /:id/node`
  - `GET /:id`
  - `POST /` (multipart upload)
  - `PATCH /:id`
  - `DELETE /:id`
- `/global-search`
  - `POST /`
- `/liked-node`
  - `GET /`
  - `POST /` (toggle)
- `/politic`
  - `POST /` (sync groups)
- `/import`
  - `POST /` (directory import)
- `/employees-parser`
  - `GET /users`
  - `GET /departments`
  - `GET /user/:tabNumber`

## 7. Data Fetching Patterns

This is a backend-only service, so "data fetching" mostly means server-side integration and DB/search access patterns.

### Database access pattern
- PrismaService is injected into domain services.
- Queries are mostly explicit and local to each service.
- Common patterns:
  - `findUnique/findMany` for read paths.
  - `upsert` for idempotent user/group/token synchronization.
  - `$transaction` for write consistency in multi-step create flows.

### External HTTP fetch pattern
- Axios is used for outbound HTTP calls:
  - employees API client in `emplayees_parser`.
  - Gotenberg conversion API.
- Errors are translated to Nest exceptions with user-safe messages.

### Search fetch pattern
- Global search first builds candidate node scope from DB.
- Then delegates text search to Elasticsearch through SearchService.
- Returned hits are normalized to stable DTO shape using `normalizeElasticHit`.

### Async fetch/process pattern
- Expensive conversion/indexing is offloaded to BullMQ workers.
- API responds after metadata/job creation; heavy processing continues in background.

## 8. State Management

There is no frontend client state in this repository.
Server-side state is managed across:
- PostgreSQL (system of record).
- Elasticsearch (derived search index).
- Redis/BullMQ (job queue and in-flight work).
- JWT payload (`id`, `activeRole`, `politicGroups`) for stateless request context.
- Refresh token persistence in DB for session rotation.
- Local filesystem (`uploads`) for binary artifacts.

Important consistency model:
- DB writes are primary.
- Search index is eventually consistent for async conversion paths.

## 9. Authentication and Authorization Model

### Authentication
- LDAP credentials are validated via Passport LDAP strategy.
- On successful login, user data is synchronized/upserted in DB.
- JWT access and refresh tokens are issued.

### Authorization
- `AccessGuard` (global):
  - validates Bearer token;
  - fetches active role and permissions;
  - populates `request.user`;
  - writes role/permission/user metadata.
- `ScopeGuard` (global):
  - checks route-level `@Scope(...)` permissions;
  - allows Owner bypass.
- `CheckGroupPolitic` (route-level):
  - validates node access through recursive policy inheritance.

### Role and policy layers
- RBAC via `Role` + `Permission`.
- Additional node-level authorization via `Group` and `NodeAccess.permissions`.
- Effective access can inherit from ancestor nodes.

## 10. Architecture Decisions (Observed)

1. NestJS module boundaries by feature domain.
- Keeps controllers/services scoped and composable.

2. Prisma as central data abstraction.
- No repository layer; services directly execute Prisma queries.

3. Search index separated from transactional DB.
- Elasticsearch used for relevance and highlighting; DB used for integrity.

4. Async conversion pipeline via BullMQ.
- Improves API responsiveness for document processing workloads.

5. Dual authorization model.
- Role/scope for broad capability control.
- Group-politic node permissions for resource-level filtering.

6. LDAP as identity source.
- Internal user profile and group associations are synchronized from external identity data.

7. Static file serving through app.
- `/uploads` is exposed from mounted filesystem path.

## 11. Coding Conventions and Patterns

### Conventions in current codebase
- Feature-first module organization under `src/modules`.
- DTO classes and mapper helpers for many response types.
- Extensive Swagger decorators on controller routes.
- Service methods generally async/await and return DTOs/entities directly.
- Prisma include options are often conditionally assembled.
- Validation and parse logic are partly in DTOs and partly in custom pipes/decorators.

### TypeScript and linting profile
- `strict` is currently disabled in `tsconfig.json`.
- ESLint allows `any` and downgrades some unsafe patterns to warnings.
- This allows fast iteration but increases runtime bug risk.

### Naming and consistency notes
- There are naming typos carried through module names (example: `emplayees_parser`, `Emplayers...`).
- Mixed language strings (Russian/English) in logs/messages/docs.
- Some small typo inconsistencies exist in method names and messages.
- Keep existing naming stable unless doing coordinated refactor to avoid breaking imports.

## 12. Local Development and Infrastructure

`docker-compose.dev.yml` provisions:
- app (NestJS service)
- postgres
- redis
- elasticsearch
- openldap
- phpldapadmin
- gotenberg

Common local workflow:
1. Start infra with docker compose.
2. Install dependencies.
3. Ensure `.env` has JWT, DB, LDAP, ES, Redis, employees API settings.
4. Run migrations and Prisma generate (postinstall does generate).
5. Start app in dev mode.
6. Open Swagger at `/docs`.

## 13. Important Notes for New Developers

1. Understand auth flow first.
- Most routes depend on JWT context set by global guards.
- `auth/signIn` is the main exception path.

2. Distinguish role permissions vs node politics.
- Passing scope checks does not guarantee node access.
- Node visibility and effective permissions can be inherited recursively.

3. Document writes trigger side effects.
- Node/document operations may update Elasticsearch.
- Document uploads enqueue background conversion jobs.

4. Elasticsearch credentials are required.
- `SearchModule` throws at startup if `ELASTIC_PASSWORD` is missing.

5. Conversion status is operationally important.
- Track `PENDING`, `IN_PROGRESS`, `DONE`, `FAILED` in `DocumentVersion`.

6. Filesystem paths matter in containers.
- App serves `/app/uploads` as static path.
- Ensure host volume mapping matches expected runtime paths.

7. External dependencies can fail independently.
- LDAP, employees API, Gotenberg, Redis, and Elasticsearch are separate failure domains.
- Plan retries/fallbacks and operational dashboards accordingly.

8. Keep eventual consistency in mind.
- DB commit does not always mean search availability is immediate.

9. Test coverage is currently minimal by default scaffold.
- Add focused tests around:
  - auth/guards;
  - node policy inheritance;
  - document conversion and indexing;
  - import recursion edge cases.

10. Recommended near-term hardening opportunities.
- Enable stricter TS options incrementally.
- Reduce `any` usage in request/search result handling.
- Add idempotency and dedup strategy for import/conversion jobs.
- Replace debug `console.log` with structured logger where possible.

## 14. Quick Mental Model

Use this project model when navigating code:
- Identity comes from LDAP.
- Session context is JWT payload + DB refresh token.
- Authorization is RBAC plus node-group policies.
- PostgreSQL is truth.
- Elasticsearch is searchable projection.
- BullMQ workers keep heavy file work off request path.
- `src/modules/*` is the best entry point for any feature change.
