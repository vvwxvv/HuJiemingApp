# Hu Jieming (`myapp`)

Single-artist website for **胡介明 / Hu Jieming** — public site + in-app manager,
in one Next.js 15 (App Router) app.

```bash
npm install
npm run dev        # http://localhost:3000
```

`/` redirects to `/artworks`. The manager lives at `/manager/*` (pattern-lock).

**Read [`docs/APP_GUIDE.md`](docs/APP_GUIDE.md)** before changing anything — it
covers routes, the API/Prisma data layer, the `Meta` site-settings document,
the light/dark theming rules, the EN/CN language rules (including the
`cover_image_url` naming rule for covers), and the known dev-cache gotcha.

Do not run Prisma migrations against the shared cluster; `npx prisma generate`
is the only safe Prisma command (`npm run build` already runs it).
