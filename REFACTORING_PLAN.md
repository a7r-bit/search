# План рефакторинга архитектуры проекта Search

> **Дата создания:** 2025-06-18
> **Последнее обновление:** 2026-10-13
> **Цели:** Улучшение соответствия требованиям LDAP, полное удаление поискового движка Elasticsearch (реализован как отдельный микросервис), улучшение общей архитектуры и соответствия SOLID

**Легенда статусов:** ✅ выполнено · 🔄 частично · ⬜ не начато

## 📌 Актуальное состояние проекта (на 2026-10-13)

Что изменилось с момента создания плана:

- Появился слой `src/infrastructure/`: логгер (Winston, разделение domain/infrastructure), CLS-контекст, `s3`, `employees-parser` (перенесён из `modules`). Эта структура (интерфейс в domain + реализация в infrastructure) — образец для остальных слоёв.
- Новые модули: `sync` (синхронизация отделов/пользователей из внешнего API), `file-provider` (gRPC-сервис, порт 50051), `admin` (adminJS, включается `ENABLE_ADMIN=true`).
- Хранение файлов: локальный диск → S3 (`S3Service`, папки `original/` и `converted/`).
- Дублирование `TokenModule` в `app.module.ts` **исправлено** (импортируется один раз).
- Фаза 1 (удаление ES) **выполнена в рабочем дереве** (не закоммичена): `modules/search`, `global-search`, очередь `elasticsearch`, `common/elasic-search-models` и `docker/elasticsearch` удалены, ссылки в сервисах, `docker-compose.yml` и `.env.example` убраны. Проверено 2026-10-13: `npm run build` проходит, ссылок на «elastic» в `src/`, `docker/`, `.env.example` нет.

---

## 📊 Обзор изменений

| Фаза      | Описание                                   | Оценка (дни) | Статус |
| --------- | ------------------------------------------ | ------------ | ------ |
| Фаза 0    | Подготовка и исправление критических багов | 1–2          | 🔄 (осталось: баг FileProvider, `npm test`) |
| Фаза 1    | Удаление Elasticsearch                     | 3–4          | ✅     |
| Фаза 2    | Улучшение LDAP интеграции                  | 4–5          | 🔄     |
| Фаза 3    | Улучшение общей архитектуры (SOLID)        | 4–5          | ⬜     |
| Фаза 4    | Тестирование и документация                | 2–3          | ⬜     |
| **Итого** |                                            | **14–19**    |        |

---

## Фаза 0: Подготовка (1–2 дня)

### 0.1 Исправить критические баги до начала рефакторинга

- [x] **app.module.ts:** дублирование импорта `TokenModule` — исправлено, модуль импортируется один раз
- [x] **Переименование файла:** `src/modules/token/token.connroller.ts` → `src/modules/token/token.controller.ts`
- [x] **Логирование:** заменить `console.log` на `Logger`/Winston-логгер (инфраструктура уже есть, см. `src/infrastructure/logger/`):
    - `src/modules/ldap/ldap.module.ts` — 3 вызова `console.log` в конструкторе `LdapStrategy`
    - `src/modules/bullmq/queues/elasticsearch/elasticsearch.producer.ts` — `console.log` в `updateAsync` и `deleteAsync`
- [ ] **Баг `FileProviderService.getFileUrl`** (`src/modules/file-provider/file-provider.service.ts`): теряется gRPC-статус. Внутреннее исключение использует `status: status.NOT_FOUND` вместо `code:`, а `catch`-блок проглатывает **все** ошибки (включая `NotFound` из `S3Service`) в одну `RpcException` без кода. Исправить: передавать `code:`, в `catch` пробрасывать уже существующую `RpcException` как есть (паттерн как в `getAccessToFile`).
    - Примечание: `documentVersion.mediaFile.fileUrl` — **не** баг: это поле DTO `MediaFileDto`, маппится из `mediaFile.filePath` (S3-ключ), и корректно передаётся в `S3Service.getFileUrl`.

### 0.2 Запустить тесты и убедиться в baseline

- [ ] Выполнить `npm test` — проверить что текущие тесты проходят
- [ ] Выполнить `npm run lint` — собрать текущий линтинг - ✖ 187 problems (171 errors, 16 warnings)
- [x] Выполнить `npm run build` — убедиться, что сборка чистая
- [x] Создать бэкап ветки перед началом рефакторинга

---

## Фаза 1: Удаление поискового движка Elasticsearch (3–4 дня)

### 1.1 Удалить зависимости из package.json

**Удалить пакеты:**

- `@elastic/elasticsearch`
- `@nestjs/elasticsearch`

**Оставить (для конвертации PDF):**

- `pdf-parse` — нужен для извлечения текста из PDF

### 1.2 Удалить модуль `search/` целиком

**Удалить файлы:**

```
src/modules/search/
├── elasticsearch-index.config.ts    ❌ УДАЛИТЬ
├── elasticsearch-index.service.ts   ❌ УДАЛИТЬ
├── index.ts                         ❌ УДАЛИТЬ
├── search.module.ts                 ❌ УДАЛИТЬ
└── search.service.ts                ❌ УДАЛИТЬ
```

### 1.3 Удалить BullMQ очередь `elasticsearch`

**Удалить файлы:**

```
src/modules/bullmq/queues/elasticsearch/
├── elasticsearch.processor.ts   ❌ УДАЛИТЬ
├── elasticsearch.producer.ts    ❌ УДАЛИТЬ
└── elasticsearch.types.ts       ❌ УДАЛИТЬ
```

**Изменить `src/modules/bullmq/bullmq.module.ts`:**

- [x] Убрать `BullModule.registerQueue` для очереди `elasticsearch`
- [x] Убрать `SearchModule` из `imports`
- [x] Убрать `ElasticsearchProcessor` из `providers`
- [x] Убрать `ElasticSearchProducer` из `providers` и `exports`

### 1.4 Обновить `document-conversion.processor.ts`

**Файл:** `src/modules/bullmq/queues/document-conversion/document-conversion.processor.ts`

- [x] Удалить import `SearchService`, `ElasticTypes`, `DocumentVersionIndexDto`, `instanceToPlain`
- [x] Удалить `searchService` из constructor
- [x] Удалить блок индексации после обновления статуса:

```typescript
// УДАЛИТЬ этот блок:
await this.searchService.indexDocument(
    ElasticTypes.DocumentVersion,
    documentVersionId,
    instanceToPlain(
        new DocumentVersionIndexDto(
            text,
            documentVersion.createdAt,
            documentVersion.nodeId,
            documentVersion.mediaFile.fileName,
            documentVersion.mediaFile.filePath,
            documentVersion.version,
        ),
    ),
);
```

> Извлечение текста `pdfService.extractTextFromPdfByBuffer` оставить только если результат нужен для других целей; при полном удалении ES вызов можно убрать вместе с переменной `text`.
> ⚠️ **Не сделано:** `text` извлекается, но теперь не используется — мёртвый код, удалить (включая вызов `pdfService.extractTextFromPdfByBuffer`, если извлечение больше не нужно).

### 1.5 Обновить `node.service.ts`

**Файл:** `src/modules/node/node.service.ts`

- [x] Удалить import `ElasticTypes`, `ElasticSearchProducer`, `NodeIndexProps`, `instanceToPlain`
- [x] Удалить `esProducer` из constructor
- [x] Удалить вызовы `esProducer.indexAsync()` в методах `create()`, `update()`, `move()`
- [x] Удалить вызов `esProducer.deleteAsync()` в методе `delete()` (вместе с `try/catch`)

### 1.6 Обновить `document-version.service.ts`

**Файл:** `src/modules/document-version/document-version.service.ts`

- [x] Удалить import `ElasticTypes`, `ElasticSearchProducer`
- [x] Удалить `esProducer` из constructor
- [x] Удалить вызов `esProducer.updateAsync()` в методе `update()`
- [x] Удалить вызов `esProducer.deleteAsync()` в методе `remove()`
- [x] Удалить вызов `esProducer.deleteAsync()` в методе `removeByNodeId()`

### 1.7 Удалить `GlobalSearchModule` целиком

**Удалить файлы:**

```
src/modules/global-search/
├── dto/
│   ├── index.ts                        ❌ УДАЛИТЬ
│   ├── search-file.dto.ts              ❌ УДАЛИТЬ
│   ├── search-highlight.dto.ts         ❌ УДАЛИТЬ
│   ├── search-response.dto.ts          ❌ УДАЛИТЬ
│   └── search-result-item.dto.ts       ❌ УДАЛИТЬ
├── mappers/
│   └── search-result.mapper.ts         ❌ УДАЛИТЬ
├── global-search.controller.ts         ❌ УДАЛИТЬ
├── global-search.module.ts             ❌ УДАЛИТЬ
├── global-search.service.ts            ❌ УДАЛИТЬ
└── index.ts                            ❌ УДАЛИТЬ
```

- [x] Каталог `src/modules/global-search/` удалён (проверено 2026-10-13)

### 1.8 Обновить `app.module.ts` и баррел `src/modules/index.ts`

**Файлы:** `src/app.module.ts`, `src/modules/index.ts`

- [x] Убрать `GlobalSearchModule` из `imports` в `app.module.ts`
- [x] Убрать экспорт `GlobalSearchModule` из `src/modules/index.ts`

### 1.9 Удалить `ElasticTypes` из `common/constants.ts`

**Файл:** `src/common/constants.ts`

- [x] Удалить enum `ElasticTypes` целиком

### 1.10 Удалить `common/elasic-search-models/`

**Удалить файлы:**

```
src/common/elasic-search-models/
├── document-version-Index.dto.ts  ❌ УДАЛИТЬ (обрати внимание: в имени заглавная "I")
├── node-index.dto.ts              ❌ УДАЛИТЬ
└── index.ts                       ❌ УДАЛИТЬ
```

### 1.11 Обновить docker-compose.yml

- [x] Убрать сервис `elasticsearch` из compose файла
- [x] Убрать `depends_on: elasticsearch` из сервиса `app`
- [x] Убрать volume `esdata` из секции `volumes`

### 1.12 Удалить docker конфигурацию Elasticsearch

```
docker/elasticsearch/   ❌ УДАЛИТЬ папку целиком
```

### 1.13 Обновить .env.example

- [x] Убрать переменные:
    - `ELASTICSEARCH_HOST`
    - `ELASTICSEARCH_PORT`
    - `ELASTIC_USERNAME`
    - `ELASTIC_PASSWORD`
    - `ELASTIC_NODE_NAME`
    - `ELASTIC_STACK_VERSION`
    - `ES_MAX_RETRIES`
    - `ES_REQUEST_TIMEOUT_MS`
    - `ES_PING_TIMEOUT_MS`
    - `CLUSTER_NAME`

### 1.14 Проверка после удаления

- [x] `npm run build` — нет ошибок типов (остаточные импорты), проверено 2026-10-13
- [x] `npm run lint` - ✖ 156 problems (146 errors, 10 warnings)
- [x] Поиск по коду: `grep -ri "elastic" src/ docker/ .env.example` — ссылок нет (проверено 2026-10-13)

---

## Фаза 2: Улучшение LDAP интеграции (4–5 дней)

### 2.1 Рефакторинг `LdapStrategy` — улучшить типизацию и обработку ошибок

**Файл:** `src/modules/ldap/ldap.module.ts`

- [x] Создать интерфейс `LdapUserPayload` с чёткой типизацией всех полей (создан: `src/modules/ldap/ldap.user.payload.ts`):

    ```typescript
    interface LdapUserPayload {
        uidNumber: string;
        sAMAccountName?: string;
        givenName?: string;
        sn?: string;
        mail?: string;
        displayName?: string;
        dn?: string;
    }
    ```

- [x] Обновить метод `validate(user: any)` → `validate(user: Record<string, unknown>): Promise<LdapUserPayload>`
- [-] Реализовать метод `extractGroups(user)` для извлечения групп пользователя из LDAP атрибутов
- [ ] Добавить fallback логику для разных атрибутов uid (`sAMAccountName`, `uid`) — сейчас `const uidNumber = String(user.sAMAccountName ?? '')`: если атрибут не пришёл, `uidNumber` станет пустой строкой, fallback на `user.uid` отсутствует
- [x] Заменить `console.log` в конструкторе на внедрённый Winston-логгер (`@Inject(LoggerKey)` из `src/infrastructure/logger/domain/logger.ts`)

### 2.2 Добавить конфигурационный интерфейс для LDAP

- [x] **Новый файл:** `src/modules/ldap/config/ldap-config.interface.ts` (создан; фактический путь — с подпапкой `config/`)

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

**Файлы:** `src/modules/ldap/ldap.module.ts`

- [x] Собрать `LdapConfig` в конструкторе стратегии через `ConfigService` (сейчас `bindDN: process.env.LDAP_ADMIN_DN` — единственный прямой доступ к `process.env`, заменить на `config.get<string>('LDAP_ADMIN_DN')`)
- [ ] `searchFilter` вынести в конфигурацию (`(uid={{username}})` vs `(sAMAccountName={{username}})`), а не хардкодить — **не сделано**: значение всё ещё захардкожено в конструкторе (`'(|(sAMAccountName={{username}})(uid={{username}}))'`), из env не читается
- [ ] Валидировать обязательные переменные окружения при старте (наст. стиль как в `TokenService` / `SearchModule` — бросать `Error` с понятным сообщением)
- [x] Убедиться, что пароль (`LDAP_ADMIN_PASSWORD`) не попадает в логи — выполнено: конструктор конфигурацию не логирует, `validate()` пишет только `uidNumber`
- [ ] Поле `tlsEnabled` читается (`LDAP_TLS_ENABLED`), но не используется: URL всегда `ldap://` — либо подключить к `ldaps://`, либо убрать

### 2.4 Обработка ошибок и наблюдаемость

- [ ] Обернуть ошибки аутентификации: отдельная обработка «пользователь не найден» / «неверный пароль» / «LDAP недоступен» (сейчас ошибка падает в общий обработок Passport)
- [ ] Логировать неудачные попытки входа через `this.logger.warn(...)` без данных о пароле
- [ ] При недоступности LDAP логировать причину (network/timeout/auth) для диагностики

### 2.5 Тесты LDAP-стратегии

- [ ] Unit-тест `LdapStrategy.validate`: маппинг атрибутов, fallback `sAMAccountName` → `uid`, отсутствующие опциональные поля
- [ ] Unit-тест сборки `LdapConfig`: пропущенные env-переменные → ошибка старта
- [ ] Тест, что пароль не логгируется

---

## Фаза 3: Улучшение общей архитектуры и SOLID (4–5 дней)

### 3.1 Разделить `SearchService` (принцип I — Interface Segregation)

`SearchService` сейчас объединяет чтение (`search`) и запись (`indexDocument` / `updateDocument` / `deleteDocument`), а потребуются разные: `GlobalSearchService` нужен только поиск, конвертер/процессоры — только индексирование.

- [ ] Вынести два интерфейса, например `SearchReader` (search) и `IndexWriter` (index/update/delete)
- [ ] Типизировать результат `search`: вернуть доменный DTO (`SearchHit`), а не сырой ответ ES — вызывающий код (`global-search.service.ts`) сейчас ходит по `hits.hits`, `hits.total.value` и ломается при смене поискового бэкенда (принцип L)
- [ ] Заменить `doc: any` в producer-методах на типизированные payload'ы по индексам

### 3.2 Абстрагировать guards от конкретных сервисов модулей (принцип D — Dependency Inversion)

`src/common/guards/*` сейчас импортируют конкретные сервисы из `src/modules/*` (TokenService, RoleService, UserService, PoliticService) — общий слой зависит от фичевого, направление зависимостей обратное.

- [ ] Описать интерфейсы в `common/` (или `infrastructure/`): `TokenVerifier`, `RoleResolver`, `UserProvider`, `NodeAccessChecker`
- [ ] Реализации оставить в модулях (`TokenService`, `RoleService`, `UserService`, `PoliticService`), пробрасывать через токены DI (`useExisting`/`useFactory`)
- [ ] `AccessGuard` и `CheckGroupPolitic`/`NodeAdminGuard` конструктором зависят только от интерфейсов
- [ ] Унифицировать источник nodeId в guards: `CheckGroupPolitic` читает только `query.parentId`, `NodeAdminGuard` — `params.nodeId ?? query.nodeId` (принцип L — поведение «подменяется» в зависимости от маршрута)

### 3.3 Разделить «боги»-сервисы (принцип S — Single Responsibility)

- [ ] **NodeService** (CRUD + валидация дерева + raw-SQL + ES-эффекты + права):
    - `NodeRepository` (обёртка над Prisma, включая `getDescendantIds`)
    - `NodeTreeService` (`validateParent`, `isDescendant`, `getPath`)
    - ES-эффекты — только через `IndexWriter` или доменные события (см. 3.4)
- [ ] **DocumentVersionService** (CRUD + S3 + нормализация имени + очередь + ES):
    - работа с хранилищем — только через интерфейс `FileStorage`
    - `normalizeUploadedFileName` вынести в утилиту
    - постановку в очередь — через интерфейс `ConversionQueue`
- [ ] **PoliticService** (CRUD групп + доступы к узлам + рекурсивные проверки + пользователи групп):
    - `GroupService` (CRUD, addUsersToGroup, ...)
    - `NodeAccessPolicyService` (`checkUserToNodeAccess`, `resolveNodePermissions`, `hasAdminOnNode`)

### 3.4 Индексирование — побочный эффект через события (принципы S и O)

Сейчас `NodeService`, `DocumentVersionService` и конвертер напрямую знают об ES-производственных очередях.

- [ ] Ввести доменные события (`NodeCreated`, `NodeUpdated`, `NodeDeleted`, `DocumentVersionConverted`...) через `EventEmitter2` или NestJS events
- [ ] Слушатели событий ставят задачи на индексирование; доменные сервисы события лишь эмитят
- [ ] Это же даст чистую точку расширения (принцип O): новый индекс/бэкенд = новый слушатель, без правки сервисов

### 3.5 Файловое хранилище за интерфейсом (принцип D)

- [ ] Интерфейс `FileStorage` (`uploadFile`, `uploadBuffer`, `getFileBuffer`, `getFileUrl`, `deleteFile`, `exists`) — `S3Service` становится одной из реализаций
- [ ] `DocumentVersionService`, `DocumentConversionProcessor`, `FileProviderService` зависят от `FileStorage`, не от `S3Service`
- [ ] Исправить баг из 0.1: в `FileProviderService.getFileUrl` теряются gRPC-статусы (`status:` вместо `code:` + `catch` проглатывает исключения)

### 3.6 Убрать `any` и включить `strict` инкрементально

- [ ] `LdapStrategy.validate(user: any)` → типизированный payload (см. 2.1)
- [ ] `AuthService.signIn(req: any)` / `switchRole(req: any)` / `getMe(req: any)` / `signOut(req: any)` → типизированные аргументы (`RequestUser`, DTO); контроллеры передают `@User()`/DTO, а не весь `Request`
- [ ] `ElasticSearchProducer.* doc: any` → типизированные payload'ы (см. 3.1)
- [ ] Поэтапно включить `strict: true` в `tsconfig.json`, закрывая находки `tsc --noEmit`

### 3.7 Убрать дублирование логики провижининга пользователя (принцип S)

`AuthService.signIn` и `SyncService.syncUsers` независимо содержат одинаковый `upsert` пользователя (connect роли `User` + `connectOrCreate` political-групп по отделам).

- [ ] Вынести `UserProvisioningService.provisionFromExternal(externalUser)`, использовать в обоих местах
- [ ] `SyncService` перестать напрямую держать Prisma-логику создания пользователей

### 3.8 Рекурсия и N+1 запросы

- [ ] `NodeService.delete` — рекурсивный обход с запросом на каждый узел; заменить на `getDescendantIds` (уже есть) + пакетный `deleteMany`
- [ ] `PoliticService.checkUserToNodeAccess` — рекурсия «на каждый родитель» по одному запросу; собрать цепочку nodeIds одним обходом и сделать один `findMany` по `nodeAccess`
- [ ] `NodeService.getPath` — запрос в цикле; аналогично собрать цепочку за один запрос (upsert-обход)

### 3.9 Типизация очереди BullMQ

- [ ] `DocumentConversionService` использует `Queue` без типа — привести к `Queue<DocumentConversionJobDto>`
- [ ] Обработчики `onCompleted`/`onFailed` типизировать по `Job<DocumentConversionJobDto>`

---

## Фаза 4: Тестирование и документация (2–3 дня)

### 4.1 Unit-тесты критичной бизнес-логики

- [ ] `NodeTreeService`: `isDescendant` (вкл. циклы), `validateParent`, `getPath`
- [ ] `NodeAccessPolicyService`: `resolveNodePermissions` (наследование, циклы), `checkUserToNodeAccess`
- [ ] `TokenService`: ротация refresh-токена, отклонение replay-токена
- [ ] `LdapStrategy`: маппинг атрибутов, fallback uid (см. 2.5)
- [ ] `DocumentConversionProcessor`: успешный путь и путь `FAILED` (мок зависимостей)

### 4.2 E2E-тесты

- [ ] Сценарий `auth/signIn` → работа с `/node/children` → смена роли
- [ ] Guards: `ScopeGuard` (нет scope → 403), `NodeAdminGuard` (нет ADMIN-прав → 403), `@Public()` маршруты

### 4.3 Документация

- [ ] Обновить `PROJECT_CONTEXT.md` (сейчас устарел: описывает локальный `uploads`, `docker-compose.dev.yml`, не знает про `infrastructure/`, S3, `sync`, `file-provider`, `admin`)
- [ ] Обновить `README.md`: новые env-переменные (S3, employees API), gRPC-порт 50051
- [ ] Зафиксировать решение по поиску: ES как отдельный микросервис, контракт между ним и API (формат hit'ов, индексы)

### 4.4 CI

- [ ] Пайплайн: `npm run lint` + `npm test` + `npm run build` перед деплоем (см. `.gitlab-ci.yml`)
- [ ] После завершения всех фаз: `grep -ri "console.log" src/` — только разрешённые места
