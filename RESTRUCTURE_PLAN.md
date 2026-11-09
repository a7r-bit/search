# План реорганизации структуры проекта — DDD-разбивка

> **Статус: ✅ выполнено (2026-11-09).** Все 4 группы выполнены: `npm run build` — 0 ошибок,
> `npm test` — 30/30 тестов. Переносы сделаны через `git mv` (история сохранена).
>
> Цель: привести `src/` к единому, интуитивному правилу «что где лежит».
> Подход: **feature-first bounded contexts** — каждая фича = ограниченный контекст
> с внутренними слоями `presentation / application / domain / infrastructure`,
> плюс общее ядро `shared/`.
>
> Метод: перенос по группам через `git mv` (сохраняет историю) + правка относительных
> импортов + `npm run build` после каждой группы. Алиасов путей нет — все импорты
> относительные, поэтому меняется глубина импортов.

## 📐 Правило (единое на весь проект)

| Слой | Папка | Что лежит |
|---|---|---|
| Бounded context (фича) | `modules/<фича>/` | Всё, что относится к одной бизнес-области |
| ─ Presentation | `modules/<фича>/presentation/` | `*.controller.ts`, `dto/`, `mappers/` |
| ─ Application | `modules/<фичa>/application/` | `*.service.ts` (use-cases, оркестрация) |
| ─ Domain | `modules/<фичa>/domain/` | `*.repository.ts`, entities, value objects, `types/`, доменные интерфейсы |
| ─ Infrastructure | `modules/<фичa>/infrastructure/` | Фиче-специфичные адаптеры / внешние клиенты (если есть) |
| ─ Модуль | `modules/<фичa>/<имя>.module.ts` | Корневой файл модуля (не в подпапке) |
| Ядро — domain | `shared/domain/` | Общие типы, value objects, `constants.ts` |
| Ядро — application | `shared/application/` | Общие use-cases / domain-сервисы (permission-resolver) |
| Ядро — infrastructure | `shared/infrastructure/` | Технические адаптеры без бизнес-логики: `prisma`, `s3`, `logger`, `context`, `http`, `bullmq` |
| Ядро — presentation | `shared/presentation/` | Глобальные `guards/`, `decorators/`, `pipes/` |
| Конфиг | `config/` | (опционально) валидация env |

> **Не переименовываем** имена фич в этом проходе (`politic` остаётся `politic`),
> чтобы не трогать маршруты/строковые ссылки. Ренейм — отдельный опциональный шаг.

---

## 🎯 Целевое дерево

```
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── config/                                   [опционально]
├── shared/
│   ├── domain/
│   │   ├── constants.ts
│   │   └── types/        (request-user, path-part, group-dto)
│   ├── application/
│   │   └── permission/   (permission-resolver.service, permission.module)
│   ├── infrastructure/
│   │   ├── prisma/
│   │   ├── s3/
│   │   ├── logger/
│   │   ├── context/
│   │   ├── http/         (http.module + clients/*)
│   │   └── bullmq/
│   └── presentation/
│       ├── guards/
│       ├── decorators/
│       └── pipes/
└── modules/
    ├── auth/                (module + presentation/ + application/)
    ├── user/                (module + presentation/ + application/ + domain/)
    ├── user-provisioning/   (module + application/ + domain/)
    ├── role/                (module + application/)
    ├── token/               (module + presentation/ + application/)
    ├── node/                (module + presentation/ + application/ + domain/)
    ├── politic/             (module + presentation/ + application/)
    ├── liked-node/          (module + presentation/ + application/)
    ├── document-version/    (module + presentation/ + application/)
    ├── sync/                (module + presentation/ + application/)
    ├── search/              (module + presentation/ + application/ + domain/)
    ├── ldap/                (module + application/ + domain/)
    ├── pdf/                 (module + presentation/ + application/)
    ├── gotenberg/           (module + application/)
    ├── employees-parser/    (module + application/ + domain/)
    ├── admin/
    ├── file-provider/       (module + presentation/ + application/ + protos/)
    └── (bullmq → shared/infrastructure/bullmq)
```

---

## 🗺️ Маппинг «файл → новое место»

### 1) `shared/` (ядро)

| Откуда | Куда |
|---|---|
| `common/constants.ts` | `shared/domain/constants.ts` |
| `common/types/request-user.ts` | `shared/domain/types/request-user.ts` |
| `common/types/path-part.dto.ts` | `shared/domain/types/path-part.dto.ts` |
| `common/types/group-dto.ts` | `shared/domain/types/group-dto.ts` |
| `common/guards/*.ts` (6) | `shared/presentation/guards/` |
| `common/decorators/*.ts` (7) | `shared/presentation/decorators/` |
| `common/pipes/*.ts` (2) | `shared/presentation/pipes/` |
| `modules/access-control/resolver.service.ts` | `shared/application/permission/permission-resolver.service.ts` |
| `modules/access-control/resolver.module.ts` | `shared/application/permission/permission.module.ts` |
| `modules/prisma/prisma.{service,module}.ts` | `shared/infrastructure/prisma/` |
| `infrastructure/s3/*.ts` (3) | `shared/infrastructure/s3/` |
| `infrastructure/logger/**` (9) | `shared/infrastructure/logger/` |
| `infrastructure/context/**` (3) | `shared/infrastructure/context/` |
| `infrastructure/http/**` (4) | `shared/infrastructure/http/` |
| `modules/bullmq/**` (5) | `shared/infrastructure/bullmq/` |

После этого `common/` и `infrastructure/` как топ-каталоги **удаляются** (стали `shared/`).

### 2) Фичи в `modules/` — слои внутри каждой

Общий шаблон: `*.controller.ts` → `presentation/`, `*.service.ts` → `application/`,
`*.repository.ts` → `domain/`, `dto/`+`mappers/` → `presentation/`, `*.module.ts` остаётся в корне фичи.

| Фича | Переносы |
|---|---|
| **auth** | `auth.controller.ts`→`presentation/`, `auth.service.ts`→`application/`, `dto/`(3)→`presentation/dto/` |
| **user** | `user.controller.ts`→`presentation/`, `user.service.ts`→`application/`, `user.repository.ts`→`domain/`, `mappers/`→`presentation/mappers/`, `dto/`(4)→`presentation/dto/`, `types/user.types.ts`→`domain/types/` |
| **user-provisioning** *(из `src/`-корня)* | `src/user-provisioning/*` → `modules/user-provisioning/`; `.service.ts`→`application/`, `dto/`(2)→`domain/dto/` |
| **role** | `role.service.ts`→`application/` |
| **token** | `token.controller.ts`→`presentation/`, `token.service.ts`→`application/`, `dto/`(3)→`presentation/dto/` |
| **node** | `node.controller.ts`→`presentation/`, `node.service.ts`→`application/`, `node.repository.ts`+`node-tree.repository.ts`→`domain/`, `dto/`(11)→`presentation/dto/`; `node.module.ts` и `node-infrastructure.module.ts` остаются в корне фичи |
| **politic** | `politic.controller.ts`→`presentation/`, `politic.service.ts`→`application/`, `dto/`(7)→`presentation/dto/` |
| **liked-node** | `.controller.ts`→`presentation/`, `.service.ts`→`application/` |
| **document-version** | `.controller.ts`→`presentation/`, `.service.ts`→`application/`, `dto/`(6)→`presentation/dto/` |
| **sync** | `.controller.ts`→`presentation/`, `.service.ts`→`application/` |
| **search** | `search.controller.ts`→`presentation/`, `search.service.ts`+`search.service.spec.ts`→`application/`, `common/dto/search/*`(3)→`presentation/dto/`, `common/interfaces/search/*`(3)→`domain/` |
| **ldap** | `ldap.module.ts`+`ldap.module.spec.ts` остаются; `ldap-failure.ts`+`spec`, `ldap.user.payload.ts`→`domain/`, `config/`→`domain/config/` |
| **pdf** | `.controller.ts`→`presentation/`, `.service.ts`→`application/` |
| **gotenberg** | `gotenberg.service.ts`→`application/` |
| **employees-parser** *(из `infrastructure/`)* | `infrastructure/employees-parser/*` → `modules/employees-parser/`; `.service.ts`→`application/`, `dto/`→`domain/dto/` |
| **admin** | без изменений |
| **file-provider** | `.controller.ts`+`file-provider.dto.ts`→`presentation/`, `.service.ts`→`application/`, `protos/` **остаётся на месте** (stable path для gRPC + nest-cli assets) |

---

## 🔀 Изменение корней импортов (что поменяется массово)

- `./common/...` → `./shared/domain/...` | `./shared/presentation/...`
- `./infrastructure/...` → `./shared/infrastructure/...`
- `../modules/prisma/...` → `../shared/infrastructure/prisma/...`
- `../modules/access-control/...` → `../shared/application/permission/...`
- `../user-provisioning/...` → `../modules/user-provisioning/...`
- `../../infrastructure/employees-parser/...` → `../modules/employees-parser/...`
- `common/dto/search`, `common/interfaces/search` → `modules/search/{presentation,domain}`
- Внутренние импорты фич: из-за подпапок меняется глубина (`.xxx` → `../application/xxx` и т.п.) — закроет `tsc`.

---

## ⚙️ Внешние ссылки (НЕ трогаем, проверим)

- `main.ts`: `join(__dirname, 'modules', 'file-provider', 'protos', 'file-provider.proto')` — путь стабилен ✅
- `nest-cli.json` assets: `modules/file-provider/protos/*.proto` — стабилен ✅
- `tsconfig` `outDir: dist`, `start:prod: node dist/main` — `main.ts` в корне, ✅
- `docker/`, `docker-compose.yml`, `.env.example`, `.gitlab-ci.yml` — не зависят от внутренних путей src

---

## 🚀 Порядок выполнения (по группам, build после каждой)

**Группа 1 — Ядро `shared/`**
Создаём `shared/`; переносим `common/*`, `infrastructure/*`, `modules/prisma`, `modules/access-control`;
пишем импорты; `npm run build`.

**Группа 2 — Размещение (без слоёв)**
`src/user-provisioning` → `modules/user-provisioning`;
`infrastructure/employees-parser` → `modules/employees-parser`;
`common/dto/search`+`common/interfaces/search` → `modules/search/...`;
`modules/bullmq` → `shared/infrastructure/bullmq`;
пишем импорты; `npm run build`.

**Группа 3 — Слои внутри фич**
Для каждой фичи (auth, user, role, token, node, politic, liked-node, document-version,
sync, search, ldap, pdf, gotenberg, employees-parser, file-provider) создаём
`presentation/ application/ domain/ [infrastructure/]` и переносим файлы.
Внутри группы — по одной фиче за шаг, build после каждой фичи.

**Группа 4 — Финальная проверка**
`npm run build` + `npm test` + `npm run lint`; чистка пустых папок; итоговый `git status`.

---

## ⚠️ Риски / оговорки

1. **Импорт-глубина** — главный источник ошибок; ловится `tsc` (build) на каждом шаге.
2. **`@Global()` модули** (`PrismaModule`, `PermissionResolverModule`/`AccessControlModule`) —
   после переноса проверим, что они по-прежнему регистрируются в `app.module.ts`.
3. **Привязка `node-infrastructure.module`** — он провайдит `NodeRepository`/`NodeTreeRepository`;
   переносим вместе с фичей node, не ломаем экспорты.
4. **Spec-файлы** остаются рядом с исходником (Jest `rootDir: src`, `*.spec.ts`).
5. **Имена фич не меняем** (`politic`) — ренейм отдельным шагом, если захотим.
6. После переноса `common/` и `infrastructure/` удаляем как пустые (через `git rm` / rmdir).
