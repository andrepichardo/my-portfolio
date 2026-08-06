# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server (Turbopack) on :3000
npm run build        # prisma generate && next build
npm start            # serve the production build
npm run lint         # next lint (prints a deprecation notice; still works)
npx tsc --noEmit     # typecheck without building — fastest correctness gate

npm run db:push      # push prisma/schema.prisma to the database
npm run db:seed      # upsert the admin user + the original 6 projects (tsx prisma/seed.ts)
npm run db:studio    # Prisma Studio
```

There is no test framework in this project — no runner, no test files. `tsc --noEmit`,
`next lint` and a real `next build` are the available verification. Behaviour that depends
on rendering or caching has to be checked by actually running the app.

`.env` is required for almost everything (see `.env.example`): `DATABASE_URL`, `AUTH_SECRET`,
`RESEND_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`. The seed script creates/updates the single
admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

## Stack

Next.js 15 App Router · React 19 · TypeScript · Tailwind v4 · Prisma 7 + PostgreSQL ·
Auth.js v5 (`next-auth@5.0.0-beta`) · deployed on Vercel.

Tailwind v4 has no `tailwind.config`: theme extensions live in `src/app/globals.css` under
`@theme` (e.g. the custom `xs` breakpoint at 450px), dark mode is a `@custom-variant`
driven by a `.dark` class from `next-themes`, and `.btn` is a component class there.
Brand gradient is `#5651e5 → #709dff`.

## Architecture

The public site is a one-page scroll (`Main`, `About`, `Skills`, `Projects`, `Contact`
composed in `src/app/page.tsx`) plus per-project detail pages at `/projects/[slug]`, a
`/resume` page, and a CMS under `/admin`.

### Data layer

`src/lib/prisma.ts` exports a singleton client built on the **`@prisma/adapter-pg` driver
adapter** over a `pg` Pool, not Prisma's default engine. Two `as any` casts there work
around a `@types/pg` version mismatch — they are deliberate. `prisma.config.ts` (Prisma 7)
is excluded from Next's TS checks via `tsconfig.json`.

`Project.techList` is a `String[]` in Postgres, but the create/update API accepts it as a
**comma-separated string** and splits it. Anything calling `POST /api/projects` or
`PUT /api/projects/[id]` must send the string form.

### Auth

Split in two on purpose. `src/lib/auth.config.ts` is Edge-safe — it imports neither Prisma
nor bcrypt — and is what `src/middleware.ts` runs to guard `/admin/((?!login).*)`.
`src/lib/auth.ts` adds the Credentials provider (bcrypt + Prisma) and is used by route
handlers via `auth()`. Sessions are JWT. Don't import Prisma or bcrypt into `auth.config.ts`.

Running `next start` locally needs `AUTH_TRUST_HOST=true`; on Vercel it is automatic.

### Images: two sources, one string field

`Project.imageUrl` is a plain string, so it can hold either a static path
(`/projects/thoughthub.png`, files in `public/projects/`) or an uploaded image
(`/api/images/<id>`). Uploads go through `POST /api/images`: sharp rotates by EXIF, resizes
to max 1600px wide, re-encodes to WebP q80, and stores the bytes in the `Image` table.
`GET /api/images/[id]` serves them with `immutable` caching forever — rows are never
mutated, ids are unique, so replacing an image means creating a new row and pointing the
project at it (and deleting the old row if nothing else references it).

### Projects grid: pagination split across server and client

The homepage renders **only page 1** on the server (`src/components/Projects.tsx`, 4 cards)
and fetches later pages from `GET /api/projects?page=&limit=` in `ProjectsGrid` (client),
which caches fetched pages in state and prefetches on hover. `PROJECTS_PAGE_SIZE`,
`projectCardSelect` and `projectCardOrderBy` all live in `src/lib/projects.ts` and are
shared by both sides.

**The server component and the API must sort identically** or page 1 and page 2 won't line
up. That is why `projectCardOrderBy` exists and includes `createdAt` as a tiebreak: tied
`displayOrder` values would otherwise let Postgres return rows in any order per query, and
a card could appear on two pages or none.

### Ordering

`displayOrder` is maintained as a **gapless 0..n-1 sequence**. `PATCH /api/projects/reorder`
receives the ids of one admin page plus that page's `startOrder`, splices them into the full
ordered list, and rewrites every row in a transaction. Writing only the page's rows would
let values collide across pages. `POST /api/projects` appends with `max(displayOrder) + 1`.

### Caching — the easiest thing to break

`/` is **statically prerendered** (confirm with the `○` marker in `next build` output). It
does not re-query the database per request in production. Every route handler that mutates
a `Project` therefore calls `revalidatePath("/")`:

- `POST /api/projects`
- `PUT` and `DELETE /api/projects/[id]` — these also revalidate `/projects/<slug>`, and the
  PUT reads the old slug *before* updating so a renamed project drops its stale detail path
- `PATCH /api/projects/reorder`

If you add another way to mutate projects, it needs the same call, otherwise the homepage
silently keeps serving the build-time snapshot until the next deploy. This is not visible
in `npm run dev` — only in `next build && next start`.

`/projects/[slug]` is currently dynamic (`ƒ`), so revalidating it is defensive; it becomes
load-bearing the moment `generateStaticParams` is added.

### Admin CMS

`/admin` lists projects 10 per page with search over title/slug/technologies, and
drag-to-reorder via dnd-kit (disabled while a search filter is active, since ordering a
filtered list is meaningless). `DndContext` **must keep its stable `id`** — without it
dnd-kit derives `aria-describedby` from a module-level counter that differs between server
and client, producing a hydration error on every reload.

Contact form posts to `/api/contact`, which sends through Resend.

## Adding a project

Either use `/admin/projects/new`, or drive the same endpoints programmatically: sign in
against `/api/auth/callback/credentials` with the CSRF token from `/api/auth/csrf`, `POST`
the screenshot to `/api/images`, then `POST /api/projects` with the returned `url` as
`imageUrl`. Card screenshots of live sites can be captured with headless Chrome
(`--headless=new --screenshot --window-size=1600,1000`); watch out for hero sliders, which
advance with `--virtual-time-budget` and change which slide you capture.

Card images are cropped by `object-cover` to roughly 1.53:1, so anything much wider loses
its left and right edges.

## Gotchas

- Running `npm run dev` (Turbopack) after a `next build` overwrites `.next` and makes
  `next start` fail with `routesManifest.dataRoutes is not iterable`. Delete `.next` and
  rebuild before serving production locally.
- The README is the untouched `create-next-app` boilerplate and describes a `pages/`
  router this project does not use — ignore it.

## Recent work (2026-08-06)

Four commits, `a5bc797..415f023`, all already committed:

1. **`a5bc797` paginated projects feed and client grid** — turned `GET /api/projects` into
   the public paginated feed (it previously returned every project, including unpublished
   ones, to anyone), added `ProjectsGrid` + `Pagination`, and cut the homepage to 4 cards.
2. **`6971752` deterministic card ordering** — added `projectCardOrderBy`.
3. **`80873f9`** — `title` attribute on the manual image-URL input.
4. **`415f023` revalidate homepage; fix DnD hydration** — the `revalidatePath` calls and the
   `DndContext` id described above.

Two projects were added to the database (not to the repo — they live only in Postgres):
**Villa del Arte Juan Dolio** (`/villa-del-arte`, WordPress/Elementor Pro/ACF) and
**Propio** (`/propio`, usepropio.com, repo `andrepichardo/propio-app`).

Open threads:

- More WordPress projects to add; only Villa del Arte is in so far.
- Propio's card currently uses a dashboard screenshot containing **real tenant data** (a
  full name, unit, rent and deposit amounts) on a public page. A 1430×935 left crop was
  offered — it fits the card aspect, keeps the branded sidebar, and drops the panel holding
  that data — but was never applied.
- `prisma/seed.ts` still only knows the original 6 projects, so a fresh `db:seed` on an
  empty database will not recreate the two new ones.
