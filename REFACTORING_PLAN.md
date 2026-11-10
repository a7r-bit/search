# План рефакторинга архитектуры проекта Search

> **Дата создания:** 2025-06-18
> **Последнее обновление:** 2026-11-09
> **Цели:** Улучшение соответствия требованиям LDAP, полное удаление поискового движка Elasticsearch (реализован как отдельный микросервис), улучшение общей архитектуры и соответствия SOLID

> **Структура кода (важно):** с 2026-11-09 `src/` перестроен в **feature-first DDD** (см. `RESTRUCTURE_PLAN.md`):
> - `modules/<фича>/` — bounded contexts со слоями `presentation/` (controller, dto, mappers), `application/` (service), `domain/` (repository, types, interfaces, config).
> - `shared/` — ядро: `domain/` (types, constants), `application/` (permission), `infrastructure/` (prisma, s3, logger, context, http/clients, bullmq), `presentation/` (guards, decorators, pipes).
> - `src/common/` и `src/infrastructure/` **упразднены** (слиты в `shared/`).
>
> Все пути в этом плане приведены к новой структуре.

**Легенда статусов:** ✅ выполнено · 🔄 частично · ⬜ не начато

## 📌 Актуальное состояние проекта (на 2026-11-09)

Что изменилось с момента создания плана:

- **DDD-переструктуризация `src/` завершена (RESTRUCTURE_PLAN.md):**
    - `src/common/` + `src/infrastructure/` → `src/shared/` (разбито на `domain / application / infrastructure / presentation`).
    - `modules/prisma` → `shared/infrastructure/prisma`; `modules/access-control` → `shared/application/permission`; `modules/bullmq` → `shared/infrastructure/bullmq`.
    - `src/user-provisioning` → `modules/user-provisioning`; `infrastructure/employees-parser` → `modules/employees-parser`.
    - Каждая фича в `modules/<фича>/` разделена на `presentation/`, `application/`, `domain/`. Переносы через `git mv` (история сохранена).
- **Слой `shared/infrastructure/`:** логгер (Winston, `shared/infrastructure/logger`), CLS-контекст (`shared/infrastructure/context`), `s3`, HTTP-клиенты (`shared/infrastructure/http/clients`: `SearchApiClient`, `GotenbergClient`, `EmployeesApiClient`). Эта структура (интерфейс в domain + реализация в infrastructure) — образец для остальных слоёв.
- Новые модули: `sync` (синхронизация отделов/пользователей из внешнего API), `file-provider` (gRPC-сервис, порт 50051), `admin` (adminJS, включается `ENABLE_ADMIN=true`).
- Хранение файлов: локальный диск → S3 (`S3Service` в `shared/infrastructure/s3`, папки `original/` и `converted/`).
- Поисковый движок Elasticsearch вынесен в отдельный микросервис; в API — адаптер `SearchService` (`modules/search`) + доменные интерфейсы `SearchReader`/`IndexWriter` (`modules/search/domain`) + `SearchApiClient` (`shared/infrastructure/http/clients`).
- Дублирование `TokenModule` в `app.module.ts` **исправлено** (импортируется один раз).
- `npm test` — **30/30**, `npm run build` — 0 ошибок (проверено 2026-11-09).

> Примечание: в старом плане `modules/search` означал удалённый ES-модуль (`elasticsearch-index.*`). Теперь `modules/search` — это **новый** адаптер внешнего поискового API. Не путать.

---

## 📊 Обзор изменений

| Фаза      | Описание                                   | Оценка (дни) | Статус                                      |
| --------- | ------------------------------------------ | ------------ | ------------------------------------------- |
| Фаза 0    | Подготовка и исправление критических багов | 1–2          | ✅ (FileProvider-баг исправлен, тесты 30/30) |
| Фаза 1    | Удаление Elasticsearch                     | 3–4          | ✅                                          |
| Фаза 2    | Улучшение LDAP интеграции                  | 4–5          | 🔄                                          |
| Фаза 3    | Улучшение общей архитектуры (SOLID)        | 4–5          | 🔄                                          |
| Фаза 4    | Тестирование и документация                | 2–3          | ⬜                                          |
| **Итого** |                                            | **14–19**    |                                             |

---

## Фаза 0: Подготовка (1–2 дня)

### 0.1 Исправить критические баги до начала рефакторинга

- [x] **app.module.ts:** дублирование импорта `TokenModule` — исправлено, модуль импортируется один раз
- [x] **Переименование файла:** `token.connroller.ts` → `token.controller.ts` (сейчас `modules/token/presentation/token.controller.ts`)
- [x] **Логирование:** `console.log` → Winston-логгер (`LoggerKey` из `shared/infrastructure/logger/domain/logger.ts`)
- [x] **Баг `FileProviderService.getFileUrl`** (`modules/file-provider/application/file-provider.service.ts`): терялся gRPC-статус — передается `code:`, а уже существующая `RpcException` пробрасывается как есть (паттерн как в `getAccessToFile`)
    - Примечание: `documentVersion.mediaFile.fileUrl` — **не** баг: это поле DTO `MediaFileDto`, маппится из `mediaFile.filePath` (S3-ключ) и корректно передаётся в `S3Service.getFileUrl`.

### 0.2 Запустить тесты и убедиться в baseline

- [x] `npm test` — 30/30 (проверено 2026-11-09)
- [ ] `npm run lint` — собрать текущий линтинг (в `package.json` скрипт вшит с `--fix`; прогонять без фикса, чтобы не затронуть чужие файлы)
- [x] `npm run build` — сборка чистая
- [x] Создать бэкап ветки перед началом рефакторинга

---

## Фаза 1: Удаление поискового движка Elasticsearch (3–4 дня)

### 1.1 Удалить зависимости из package.json

**Удалить пакеты:** `@elastic/elasticsearch`, `@nestjs/elasticsearch`.
**Оставить:** `pdf-parse` — для извлечения текста из PDF.

### 1.2 Удалить модуль `search/` (старый ES-модуль) целиком

Удалялись: `elasticsearch-index.config.ts`, `elasticsearch-index.service.ts`, `search.module.ts`, `search.service.ts` (это был ES-модуль; теперь `modules/search` — новый адаптер внешнего API).

### 1.3 Удалить BullMQ очередь `elasticsearch`

Удалялись: `queues/elasticsearch/{elasticsearch.processor,elasticsearch.producer,elasticsearch.types}.ts`; убраны `BullModule.registerQueue`, `SearchModule`, процессор и производитель из `shared/infrastructure/bullmq/bullmq.module.ts`.

### 1.4 Обновить `document-conversion.processor.ts`

**Файл:** `shared/infrastructure/bullmq/queues/document-conversion/document-conversion.processor.ts`

- [x] Удалить import `SearchService`, `ElasticTypes`, `DocumentVersionIndexDto`, `instanceToPlain`
- [x] Удалить `searchService` из constructor
- [x] Удалить блок индексации после обновления статуса
- ⚠️ **Осталось:** извлечённый `text` больше не используется — мёртвый код, удалить (включая вызов `pdfService.extractTextFromPdfByBuffer`, если извлечение больше не нужно)

### 1.5 Обновить `node.service.ts`

**Файл:** `modules/node/application/node.service.ts`

- [x] Удалить import `ElasticTypes`, `ElasticSearchProducer`, `NodeIndexProps`, `instanceToPlain`
- [x] Удалить `esProducer` из constructor
- [x] Удалить вызовы `esProducer.indexAsync()` в `create()`, `update()`, `move()`
- [x] Удалить вызов `esProducer.deleteAsync()` в `delete()` (вместе с `try/catch`)

### 1.6 Обновить `document-version.service.ts`

**Файл:** `modules/document-version/application/document-version.service.ts`

- [x] Удалить import `ElasticTypes`, `ElasticSearchProducer`
- [x] Удалить `esProducer` из constructor
- [x] Удалить вызовы `esProducer.updateAsync()`/`deleteAsync()` в `update()`, `remove()`, `removeByNodeId()`

### 1.7 Удалить `GlobalSearchModule` целиком

- [x] Каталог `modules/global-search/` удалён

### 1.8 Обновить `app.module.ts`

- [x] Убрать `GlobalSearchModule` из `imports` в `app.module.ts`

### 1.9 Удалить `ElasticTypes` из констант

**Файл:** `shared/domain/constants.ts`

- [x] Удалить enum `ElasticTypes` целиком

### 1.10 Удалить `common/elasic-search-models/`

- [x] Каталог удалён (обратите внимание: в имени была заглавная "I" — `document-version-Index.dto.ts`)

### 1.11 Обновить docker-compose.yml

- [x] Убрать сервис `elasticsearch`, `depends_on: elasticsearch`, volume `esdata`

### 1.12 Удалить docker конфигурацию Elasticsearch

- [x] `docker/elasticsearch/` удалён

### 1.13 Обновить .env.example

- [x] Убрать `ELASTICSEARCH_*`, `ELASTIC_*`, `ES_*`, `CLUSTER_NAME`

### 1.14 Проверка после удаления

- [x] `npm run build` — нет ошибок типов (проверено 2026-11-09)
- [x] Поиск по коду: `grep -ri "elastic" src/ docker/ .env.example` — ссылок нет

---

## Фаза 2: Улучшение LDAP интеграции (4–5 дней)

### 2.1 Рефакторинг `LdapStrategy` — типизация и обработка ошибок

**Файл:** `modules/ldap/ldap.module.ts`

- [x] Создан интерфейс `LdapUserPayload` (`modules/ldap/domain/ldap.user.payload.ts`)
- [x] `validate(user: any)` → `validate(user: Record<string, unknown>): Promise<LdapUserPayload>`
- [-] Метод `extractGroups(user)` для извлечения групп из LDAP-атрибутов
- [x] Fallback для разных атрибутов uid (`sAMAccountName` → `uid`)
- [x] Заменить `console.log` в конструкторе на внедрённый логгер (`@Inject(LoggerKey)` из `shared/infrastructure/logger/domain/logger.ts`)

### 2.2 Конфигурационный интерфейс для LDAP

- [x] **Файл:** `modules/ldap/domain/config/ldap-config.interface.ts`

```typescript
export interface LdapConfig {
    host: string;
    port: number;
    adminDn: string;
    adminPassword: string;
    usersDn: string;
    searchFilter: string;
    tlsEnabled: boolean;
}
```

### 2.3 Построить `LdapConfig` в `LdapModule` и убрать прямой доступ к `process.env`

**Файлы:** `modules/ldap/ldap.module.ts`

- [x] Собрать `LdapConfig` в конструкторе через `ConfigService` (валидация через `requireEnv`)
- [x] `searchFilter` вынесен в конфигурацию (читается из env)
- [x] Валидировать обязательные env-переменные при старте (бросать `Error` с понятным сообщением)
- [x] Пароль (`LDAP_ADMIN_PASSWORD`) не попадает в логи
- [x] Поле `tlsEnabled` подключено к `ldaps://`

### 2.4 Обработка ошибок и наблюдаемость

- [x] `LdapAuthGuard` (в `shared/presentation/guards/ldap-auth.guard.ts`) + классификатор `modules/ldap/domain/ldap-failure.ts`: нет креденшелов → 400, неверный пароль/неизвестный пользователь → 401, LDAP недоступен → 503
- [x] Логирование неудачных попыток через `logger.warn(...)` без данных о пароле
- [x] При недоступности LDAP — причина (network/timeout/auth) в логе
- [x] Unit-тесты классификатора: `modules/ldap/domain/ldap-failure.spec.ts`

### 2.5 Тесты LDAP-стратегии

- [x] Unit-тест `LdapStrategy.validate`: маппинг атрибутов, fallback `sAMAccountName` → `uid`
- [x] Unit-тест сборки `LdapConfig`: пропущенные env → ошибка старта
- [x] Тест, что пароль не логгируется

---

## Фаза 3: Улучшение общей архитектуры и SOLID (4–5 дней)

### 3.1 Разделить `SearchService` (принцип I — Interface Segregation)

- [x] Вынесены интерфейсы `SearchReader` (search) и `IndexWriter` (index/update/delete) — `modules/search/domain/`
- [x] Результат `search` типизирован доменными DTO `SearchResult`/`SearchQuery` (`modules/search/presentation/dto/`), а не сырым ответом
- [x] `SearchService` (`modules/search/application/search.service.ts`) — адаптер, реализующий оба интерфейса и делегирующий в `SearchApiClient`
- [x] `doc: any` в producer-методах заменён на типизированные payload'ы (`modules/search/domain/search-payload.interface.ts`)

### 3.2 Абстрагировать guards от конкретных сервисов (принцип D — Dependency Inversion)

`shared/presentation/guards/*` сейчас импортируют конкретные сервисы из `modules/*` (TokenService, RoleService, UserService, PoliticService) — общий слой зависит от фичевого.

- [ ] Описать интерфейсы в `shared/domain/` (или `shared/application/`): `TokenVerifier`, `RoleResolver`, `UserProvider`, `NodeAccessChecker`
- [ ] Реализации оставить в модулях (`modules/*/application/*.service.ts`), пробрасывать через токены DI (`useExisting`/`useFactory`)
- [ ] `AccessGuard` (`shared/presentation/guards/access.guard.ts`) и `CheckGroupPolitic`/`NodeAdminGuard` конструктором зависеть только от интерфейсов
- [ ] Унифицировать источник nodeId в guards: `CheckGroupPolitic` читает только `query.parentId`, `NodeAdminGuard` — `params.nodeId ?? query.nodeId`

### 3.3 Разделить «боги»-сервисы (принцип S — Single Responsibility)

- [ ] **NodeService** (`modules/node/application/node.service.ts`):
    - `NodeRepository` / `NodeTreeRepository` — уже в `modules/node/domain/` (обёртки над Prisma, включая `getDescendantIds`/CTE)
    - `NodeTreeService` (`validateParent`, `isDescendant`, `getPath`) — вынести из репозитория
    - Индексирование — только через `IndexWriter` (`modules/search/domain`) или доменные события (см. 3.4)
- [ ] **DocumentVersionService** (`modules/document-version/application/document-version.service.ts`):
    - работа с хранилищем — только через интерфейс `FileStorage`
    - `normalizeUploadedFileName` вынести в утилиту
    - постановку в очередь — через интерфейс `ConversionQueue`
- [ ] **PoliticService** (`modules/politic/application/politic.service.ts`):
    - `GroupService` (CRUD, addUsersToGroup, ...)
    - `NodeAccessPolicyService` (`checkUserToNodeAccess`, `resolveNodePermissions`, `hasAdminOnNode`)

### 3.4 Индексирование — побочный эффект через события (принципы S и O)

- [ ] Ввести доменные события (`NodeCreated`, `NodeUpdated`, `NodeDeleted`, `DocumentVersionConverted`...) через `EventEmitter2` или NestJS events
- [ ] Слушатели событий ставят задачи на индексирование; доменные сервисы лишь эмитят

### 3.5 Файловое хранилище за интерфейсом (принцип D)

- [ ] Интерфейс `FileStorage` (`uploadFile`, `uploadBuffer`, `getFileBuffer`, `getFileUrl`, `deleteFile`, `exists`) — `S3Service` (`shared/infrastructure/s3/s3.service.ts`) становится одной из реализаций
- [ ] `DocumentVersionService`, `DocumentConversionProcessor` (`shared/infrastructure/bullmq/...`), `FileProviderService` зависят от `FileStorage`, не от `S3Service`

### 3.6 Убрать `any` и включить `strict` инкрементально

- [x] `LdapStrategy.validate(user: any)` → типизированный payload (см. 2.1)
- [ ] `AuthService.signIn(req: any)` / `switchRole(req: any)` / `getMe(req: any)` / `signOut(req: any)` → типизированные аргументы (`RequestUser` из `shared/domain/types`, DTO); контроллеры (`modules/auth/presentation/auth.controller.ts`) передают `@User()`/DTO, а не весь `Request`
- [ ] Поэтапно включить `strict: true` в `tsconfig.json`, закрывая находки `tsc --noEmit`

### 3.7 Убрать дублирование логики провижининга пользователя (принцип S)

`AuthService.signIn` (`modules/auth/application/auth.service.ts`) и `SyncService.syncUsers` (`modules/sync/application/sync.service.ts`) ранее независимо содержали одинаковый `upsert` пользователя.

- [x] Вынесено `UserProvisioningService.provisionFromExternal(externalUser)` (`modules/user-provisioning/application/user-provisioning.service.ts`), используется в обоих местах
- [x] `SyncService` перестал напрямую держать Prisma-логику создания пользователей (через `UserRepository.upsertProvisionedUser` в `modules/user/domain/user.repository.ts`)

### 3.8 Рекурсия и N+1 запросы

- [x] `NodeService.delete` — рекурсивный обход заменён на `NodeTreeRepository.recursiveDelete` (Recursive CTE) + пакетный `deleteMany`
- [ ] `PoliticService.checkUserToNodeAccess` — рекурсия «на каждый родитель» по одному запросу; собрать цепочку nodeIds одним обходом и сделать один `findMany` по `nodeAccess`
- [ ] `NodeService.getPath` — запрос в цикле; собрать цепочку за один запрос

### 3.9 Типизация очереди BullMQ

- [ ] `DocumentConversionService` (`shared/infrastructure/bullmq/queues/document-conversion/document-conversion.service.ts`) — привести `Queue` к `Queue<DocumentConversionJobDto>`
- [ ] Обработчики `onCompleted`/`onFailed` типизировать по `Job<DocumentConversionJobDto>`

---

## Фаза 4: Тестирование и документация (2–3 дня)

### 4.1 Unit-тесты критичной бизнес-логики

- [ ] `NodeTreeService`: `isDescendant` (вкл. циклы), `validateParent`, `getPath` (`modules/node/domain/`)
- [ ] `NodeAccessPolicyService`: `resolveNodePermissions` (наследование, циклы), `checkUserToNodeAccess` (`modules/politic/application/`)
- [ ] `TokenService`: ротация refresh-токена, отклонение replay-токена (`modules/token/application/`)
- [x] `LdapStrategy`: маппинг атрибутов, fallback uid (см. 2.5)
- [ ] `DocumentConversionProcessor`: успешный путь и путь `FAILED` (`shared/infrastructure/bullmq/...`)

### 4.2 E2E-тесты

- [ ] Сценарий `auth/signIn` → работа с `/node/children` → смена роли
- [ ] Guards: `ScopeGuard` (нет scope → 403), `NodeAdminGuard` (нет ADMIN-прав → 403), `@Public()` маршруты

### 4.3 Документация

- [ ] Обновить `PROJECT_CONTEXT.md` (устарел: описывает локальный `uploads`, не знает про `shared/`, S3, `sync`, `file-provider`, `admin`)
- [ ] Обновить `README.md`: новые env-переменные (S3, employees API), gRPC-порт 50051, структура DDD
- [ ] Зафиксировать решение по поиску: ES как отдельный микросервис, контракт между ним и API (формат hit'ов, индексы)

### 4.4 CI

- [ ] Пайплайн: `npm run lint` + `npm test` + `npm run build` перед деплоем (см. `.gitlab-ci.yml`)
- [ ] После завершения всех фаз: `grep -ri "console.log" src/` — только разрешённые места

---

## 📎 Соответствие старой → новой структуры (справочно)

| Было | Стало |
| --- | --- |
| `src/common/guards/*` | `src/shared/presentation/guards/*` |
| `src/common/decorators/*` | `src/shared/presentation/decorators/*` |
| `src/common/pipes/*` | `src/shared/presentation/pipes/*` |
| `src/common/types/*` | `src/shared/domain/types/*` |
| `src/common/constants.ts` | `src/shared/domain/constants.ts` |
| `src/common/dto/search/*` | `src/modules/search/presentation/dto/*` |
| `src/common/interfaces/search/*` | `src/modules/search/domain/*` |
| `src/infrastructure/s3/*` | `src/shared/infrastructure/s3/*` |
| `src/infrastructure/logger/*` | `src/shared/infrastructure/logger/*` |
| `src/infrastructure/context/*` | `src/shared/infrastructure/context/*` |
| `src/infrastructure/http/clients/*` | `src/shared/infrastructure/http/clients/*` |
| `src/infrastructure/employees-parser/*` | `src/modules/employees-parser/*` |
| `src/modules/prisma/*` | `src/shared/infrastructure/prisma/*` |
| `src/modules/access-control/*` | `src/shared/application/permission/*` |
| `src/modules/bullmq/*` | `src/shared/infrastructure/bullmq/*` |
| `src/user-provisioning/*` | `src/modules/user-provisioning/*` |
| `src/modules/<фича>/<фича>.controller.ts` | `src/modules/<фича>/presentation/<фича>.controller.ts` |
| `src/modules/<фича>/<фича>.service.ts` | `src/modules/<фича>/application/<фича>.service.ts` |
| `src/modules/<фича>/<фича>.repository.ts` | `src/modules/<фича>/domain/<фича>.repository.ts` |
| `src/modules/<фича>/dto/*` | `src/modules/<фича>/presentation/dto/*` |
| `src/modules/<фича>/types/*` | `src/modules/<фича>/domain/types/*` |
