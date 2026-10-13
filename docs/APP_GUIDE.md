# Hu Jieming — App Guide

Everything a new developer (or future me) needs to work on this codebase.
It describes **how this app actually works** — routes, data layer, theming,
languages, the manager, and the naming rules that keep it consistent.

> Stack: Next.js 15 (App Router) · React 19 · MUI + Tailwind · framer-motion ·
> lucide-react · next-themes · MongoDB (raw driver) + Prisma · react-query.

---

## 1. What this app is

A single-artist website for **胡介明 / Hu Jieming**: artworks, exhibitions,
news, CV/resume, about, contact — plus a full in-app **manager** (CRUD,
ordering, image sync, exports, site settings) behind a pattern lock.

Public site and manager live in the **same Next.js app**. The manager is not a
separate admin app; it is `/manager/*` with its own nav and auth gate.

---

## 2. Routes

### Public

| Route | Page component | Notes |
| --- | --- | --- |
| `/` | — | **307 redirect → `/artworks`** (see `next.config.js` + `src/app/page.jsx`) |
| `/artworks` | `pages/artworks/ArtworkPageComponent` | works list (cards); language-filtered; year desc |
| `/artworks/[slug]` | `pages/artworks/ArtworkDetailPageComponent` | single work; self-fetching |
| `/artworks/archive` | `pages/artworks/ArtworkArchivePageComponent` | year-grouped timeline ⇄ image list (view switch) |
| `/exhibitions` (+ detail) | `pages/exhibition/*` | |
| `/news` | `pages/news/NewsPageComponent` | |
| `/resume` | `pages/resume/ResumePageComponent` | CV — API-driven, grouped by `type` |
| `/about` | `pages/about/AboutPageComponent` | |
| `/contact` | `pages/contact/ContactPageComponent` | |

### Manager (`/manager/*`)

`about · artwork (+ create / [id]/edit / batch_edit / order / reorder) ·
exhibition · event · writing · bibliography · series · resume · video · web ·
image (+ batch_edit / order) · enquire · artist-contact · subscribe · meta`

The manager nav comes from `Meta.menu.managerMenu` (see §5). The manager uses
its own nav (`components/navs/ManagerNav.jsx`) — *not* `MainNav`.

---

## 3. Layout skeleton

```
src/app/layout.jsx                providers only (no UI logic)
└─ LayoutContent                  boot: construction page / query client / footer
   └─ LayoutMainContent           nav slot + back button + <main>; manager ⇒ ManagerAuthGate
      ├─ MainNav        (public)  brand, menus, language switcher (in the nav row)
      ├─ ManagerNav     (manager) centred nav + language switcher (fixed top-right)
      └─ ManagerAuthGate          PatternLock until authenticated
```

* `BackButton` is auto-rendered on detail pages (≥2 path segments), hidden on
  `/artworks/archive` (that page renders its own inline back control).
* The light/dark toggle lives **only in the footer** (`buttons/ThemeToggleButton`).

---

## 4. Data layer

Two access paths, one database:

1. **REST-ish API routes** — `src/app/api/<entity>/route.js` (+ `[id]`,
   `batch_edit`) are generated from a config per entity:
   `src/app/api/_config/<entity>_api_config.js`.
2. **Prisma** — used for relation helpers and a few server bits
   (`src/app/api/_lib/prisma_relations.js`). Mongo is the store.

### The API shells

| File | Role |
| --- | --- |
| `src/app/api/_lib/api_shell.js` | list (GET), create (POST), update (PUT), delete (DELETE) factory |
| `src/app/api/_lib/api_id_shell.js` | single-document by id |
| `src/app/api/_lib/mongo.js` | client/collection access |
| `src/app/api/_lib/list_cache.js` | short-lived list cache (`X-List-Cache: HIT/MISS`), dropped on writes |

### Per-entity config keys

```js
{
  collectionName,            // Prisma/Mongo collection
  validFields,               // allow-list — anything else is stripped on write
  searchableFields, arrayFields, jsonFields,
  defaultSortField, defaultSortOrder,
  beforeCreate, beforeUpdate, transformResponse,   // hooks
}
```

`transformResponse` receives the **whole array** on list endpoints and a single
object on the id endpoint — handle both.

### Prisma

* `prisma/schema.prisma` mirrors the Mongo collections.
* **Never run `prisma db push` / migrations against the shared cluster.** The
  only safe command is `npx prisma generate` (also part of `npm run build`).

---

## 5. Site Meta (single source of site settings)

The site's own settings live in **one `Meta` document** (`/api/meta`), edited at
**`/manager/meta`**:

* footer copy (`app_footer_*`), **menus** (`menu.mainMenu` / `menu.managerMenu`,
  each `{ en, cn }` with optional `dropdown` children), SEO tags, and
  **`formTypes`** (the per-entity `type` dropdown options).

* Read it with `useSiteMeta()` (client) or `/api/meta` (server).
* Ships defaults (used when the doc/DB is unavailable) live in
  `src/data/site_meta/*.json` + `src/data/forms/form_type.json`, assembled in
  `src/utils/siteMetaDefaults.js`.
* **The Meta doc wins over the JSON defaults** — to change the live nav you must
  update the doc (e.g. via `PUT /api/meta`, which is what the manager UI does),
  not just the JSON.

`formTypes` mirrors the entities that have a `type` field in Prisma:
`artwork · video · series · resume · web · writing · event · bibliography ·
image · exhibition`. Entities without their own list **reuse a sibling list**
(exhibition ← event, series ← artwork, resume ← about, bibliography ← writing).
There is deliberately **no `fair`** entry — `prisma/schema.prisma` has no Fair
model (shows/fairs are Events).

---

## 6. Theming (light / dark)

* `next-themes` — `attribute="class"`, `storageKey="theme"`, **default light**.
* `useReverseTheme()` returns `{ isDark, colors }` where `colors` =
  `{ text, background, border, … }` (pure reverse: light = white bg/black text).
* On every render it publishes CSS variables via `setThemeCSSVariables`:
  `--text-primary`, `--background-primary`, `--border-light`,
  `--interactive-background-hover`, `--drawer-bg`.
* **Rule: never hard-code black/white for UI chrome.** Use the CSS vars (manager
  pages), `colors` from `useReverseTheme()` (inline styles), or the Tailwind
  `dark:` siblings. Semantic colours (errors/success/brand) are exempt.
* Fonts: always `useFont(role)` (`roles` in `lib/typography.js`) — never a
  hard-coded family.

---

## 7. Language (EN / 中文)

* `LanguageContext` → `{ isCn, toggleLanguage }`. Everything conditional uses
  `isCn`.
* Components: `components/switchers/LanguageSwitcherInMenu` shows *the other*
  language and toggles. It is rendered in the public nav row (MainNav) **and**
  fixed at the manager's top-right (ManagerNav).
* **Never render a bilingual label like `Artist / 艺术家`.** Two shapes exist:
  * `{ cn, en }` / `{ EN, CN }` objects → resolve with `pickText` /
    `resolveLocalizedLabel`;
  * legacy *combined* strings (`"Artist / 艺术家"`) shipped by the manager schema
    configs → `resolveLocalizedLabel(label, isCn)` (in
    `src/utils/bilingualUtils.js`) splits and picks the current language.
    `ManagerStructureLayout` applies it to every `getFields()` result, so cards,
    list rows, dialogs and filter boxes never mix languages.
* **Data** is language-filtered with `utils/filterByLanguage(items, isCn)`
  (matches the row's `language` to `EN`/`CN`). Lists that skip this will show
  the EN and CN copy of the same record side by side (the artwork collection
  stores both — 124 EN + 124 CN rows).

---

## 8. The manager

* Every list page is described by a **schema config**
  (`src/components/pages/manager/config/<entity>SchemaConfig.js`) and rendered by
  `src/components/pages/manager/layouts/ManagerStructureLayout.jsx`.
* `dataConfig` is the important part:

```js
dataConfig: {
  titleField, descriptionField,
  imageField,          // cover key used by cards/list (e.g. "cover_img_url")
  languageField,       // "language" ⇒ list is language-filtered (null ⇒ not)
  alphabetFilterField,
  getFields(lang), getEmptyItem(), getDeleteDialogFields(lang),
  searchFields, sortFields,
  groupConfig: { enabled, field, applyTo, sortGroups },   // e.g. group works by year
}
```

* Cards/list: `ManagerCard.jsx` + `ListWithExpandInfo.jsx`. Media resolution for
  the list goes through `getMediaInfo(item, imageField, videoField)`.
* Filter bar: `ManagerStructureLayout` → `renderFilters`
  (`src/utils/filterRenderers.js`) → options from the **language-filtered**,
  already-filtered data.
* Theme-aware throughout (§6).

### Field-naming rule: covers

The **canonical artwork cover field is `cover_image_url`** — it is what the DB
rows and every public page use, and what `prisma/schema.prisma` declares.

Legacy manager code (schema config, forms, exports, batch edit) still asks for
`cover_img_url`. `src/app/api/_config/artwork_api_config.js` bridges the two:

* **read** → mirrors `cover_image_url` ⇄ `cover_img_url` (so the manager finds the
  image and the public site keeps working);
* **write** → collapses to the single canonical `cover_image_url`.

Other entities (exhibition/event/writing/series/bibliography) use `cover_img_url`
in their schemas/forms — apply the same alias there if their data ever lands
under `cover_image_url`.

---

## 9. Commands & gotchas

```bash
npm run dev      # next dev (default :3000)
npm run build    # npx prisma generate && next build
npx prisma generate   # the ONLY prisma write-path command allowed
```

**Dev-cache corruption.** `.next` periodically corrupts and every page 500s
with `Cannot find module './vendor-chunks/*.js'` (or `./NNN.js`). Fix:

```bash
lsof -ti:3000 | xargs kill -9
rm -rf .next && npm run dev
```

**Headless screenshots** of animated screens (pattern lock, accordions,
framer-motion cards) can come out blank because the intro animation doesn't run
under Chrome's virtual-time clock — that is a screenshot artefact, not a bug.
Force the state (or bump `--virtual-time-budget`) to inspect layout.

**Do not touch customer/production data.** The Mongo cluster used by this app is
shared. Only this app's own collections/`Meta` doc are in scope, and writes go
through the app's own API.

---

## 10. Directory map

```
src/
  app/                  routes (public + manager) and /api/*
    api/_config/        one config per entity (the API contract)
    api/_lib/           api shells, mongo, prisma relations, list cache
  components/
    navs/               MainNav (public) · ManagerNav (manager) · FilterBarDropdown
    layouts/            LayoutContent, LayoutMainContent, ManagerAuthGate
    pages/              one folder per screen; manager/{config,layouts,components,utils}
    forms/              create/edit forms per entity
    lockers/PatternLock the manager auth gate UI
    switchers/          LanguageSwitcherInMenu, ThemeSwitcher
    buttons/            ThemeToggleButton (footer), BackButton, …
  data/                 site_meta/*.json, forms/form_type.json (seeded defaults)
  hooks/                useSiteMeta, useReverseTheme, useFont, useFormTypeOptions, …
  lib/                  typography.js, siteMetaServer.js
  schemas/              zod schemas
  utils/                filterRenderers, bilingualUtils, filterByLanguage, mediaOrder, …
prisma/schema.prisma    models mirroring the Mongo collections
```
