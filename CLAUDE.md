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
npm run db:seed:content   # fill the CMS tables; never overwrites edited copy
npm run db:studio    # Prisma Studio

SEED_FORCE=1 npm run db:seed:content   # realign sections + settings to the defaults
```

After changing `prisma/schema.prisma`, run `npx prisma generate` **and restart any
running dev server** — a process that booted with the old client will have `undefined`
where the new models should be, and the content getters will silently serve their
fallbacks instead of the database.

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

`ProjectsGrid` caches by `filter:page`, so each platform keeps its own page count and its
own downloaded pages; switching filters always lands on page 1.

### Platform filters

The chips above the grid answer **"what is this project built on"**, not "which libraries
does it list". `PLATFORMS` in `src/lib/projects.ts` is an ordered list — WordPress,
PrestaShop, then React / Next.js as the fallback — and `buildPlatformFilters()` gives each
project the **first** platform whose `match` appears in its `techList`, so every project
lands in exactly one chip and the counts sum to the catalogue.

The earlier version ranked technologies by frequency, and the shape of the data defeated
it: every `TypeScript` project was already a `React` project and `PHP` differed from
`WordPress` by a single card, so the chips were nested rather than complementary; ties were
broken alphabetically, which silently pushed `WordPress` out of the top row; and PrestaShop,
used by one project, could never earn a chip at all. Ordering by platform also answers the
question a visitor actually has, and an e-commerce build on WordPress lands under
`WordPress` without anyone having to adjudicate.

Adding a platform is one entry in `PLATFORMS`. A project on no known platform simply gets
no chip and stays reachable through "All".

Two things are easy to get wrong here:

- **Both sides must build the list from the same input**, for the same reason
  `projectCardOrderBy` is shared — the server component derives the chips while rendering
  page 1, and `GET /api/projects?platform=` re-derives them to resolve the slug. A slug the
  API cannot resolve falls through to the *unfiltered* grid on purpose, so a stale bookmark
  shows everything rather than nothing.
- **The API must honour the priority order**, which is what `PlatformFilter.exclude`
  carries. Filtering on `techList hasSome match` alone would let a headless WordPress build
  that lists `NextJS` appear under two chips, and the grid would then hold more projects
  than the chip advertises.

The active filter is mirrored into the URL as `?platform=<slug>` (plus a `#projects` hash)
via `history.replaceState`, so a filtered grid can be linked to and survives a refresh.
`pushState` was rejected deliberately: on a one-page site, stacking a history entry per chip
turns Back into "undo my last five clicks". The filter is adopted from the URL in an effect
**after** hydration — `/` is prerendered without a filter, so reading the query during
render would not match the server HTML.

`PlatformFilters` is a `role="toolbar"` with roving tabindex: one Tab stop for the group,
arrows to move, Home/End for the ends. On phones the row scrolls sideways instead of
wrapping (wrapping stranded a lone chip on a second line, and got worse with each platform
added), with `mask-image` fading whichever end still has content behind it — a mask rather
than an overlay because the row sits on the page background, which changes with the theme.

### Ordering

`displayOrder` is maintained as a **gapless 0..n-1 sequence**. `PATCH /api/projects/reorder`
receives the ids of one admin page plus that page's `startOrder`, splices them into the full
ordered list, and rewrites every row in a transaction. Writing only the page's rows would
let values collide across pages. `POST /api/projects` appends with `max(displayOrder) + 1`.

### The CMS

Everything on the public site is editable from `/admin`. Four tables back it:

- **`SiteSection`** — one row per block of the homepage, keyed `hero` / `about` / `skills` /
  `projects` / `contact`. One generic shape (eyebrow, heading, highlight, subheading,
  `body[]`, image, cta) covers all five; `SECTION_FIELDS` in `src/lib/content-defaults.ts`
  decides which inputs the editor shows per key, so `skills` offers only its two headings
  and `projects` those plus a `subheading` (the line under "What I've Built", which frames
  the grid as a selection rather than the whole body of work). `highlight` is a substring of
  `heading` that `Main` paints in the brand colour — that is how "Hi, I'm **André**" stays
  editable without HTML in the database.
- **`Skill`** and **`SocialLink`** — ordered collections, drag-sorted through
  `SortableList`, each rewritten to a gapless 0..n-1 sequence by its `reorder` endpoint.
  The social links render in three places (hero, mobile menu, contact card) that used to
  hardcode the same URLs.
- **`SiteSettings`** — a single `singleton` row with the metadata and the resume PDF path.

`src/lib/content.ts` is the only reader. **Every getter falls back to the copy the
components used to hardcode** (`src/lib/content-defaults.ts`), so an empty table or an
unreachable database renders the site as it looked before the CMS rather than blanking a
section. That safety net is also what hides a stale Prisma client, so don't take a
correct-looking page as proof the database is being read.

The fallback is **per row, not per field**: once a `SiteSection` row exists, an empty column
in it renders empty. Adding a field to `SECTION_DEFAULTS` therefore changes nothing on a
populated database — the matching row has to be updated too. Prefer a targeted update over
`SEED_FORCE=1`, which realigns every section and can revert unrelated edits.

`content-defaults.ts` deliberately imports nothing: the seed script loads it outside Next,
and the admin client components need its labels without pulling Prisma into the browser
bundle.

Shared route-handler plumbing lives in `src/lib/cms.ts` (`requireAdmin`, `revalidateSite`,
`zodError`) and the payload shapes in `src/lib/cms-schemas.ts` — schemas cannot live in a
`route.ts`, since Next rejects exports from a route module that are not handlers.

### Scroll reveal

`Reveal` (client) adds `.is-visible` the first time an element intersects the viewport, then
stops observing. The **hidden** state lives in CSS (`.reveal` in `globals.css`), not in
React, so nothing flashes before hydration; the `<noscript>` override in the root layout and
the `prefers-reduced-motion` branch both keep that from trapping content.

Per-item stagger is CSS too. `.reveal-stagger` delays each child by **its position in its
own row**, with one set of `nth-child` rules per column count. It cannot be a `delay` prop:
the column count is a breakpoint decision the server cannot know, and a delay computed from
the array index only has two endings — it grows until the last cards crawl in, or it gets
capped and then lands a whole block of them at the same instant. (It was capped at index 7,
which is why rows 3+ of the skills grid used to rise together.)

The column counts in those rules mirror `grid-cols-2 lg:grid-cols-4` on the skills grid;
change one and the other has to follow. The trailing `:hover` rule that zeroes the delay
**must stay last** — it carries the same specificity as the `nth-child` rules and only wins
the tie by coming after them. Without it the stagger also delays the hover lift.

`ScrollToTop` is a fixed control that fades in once the reader is a viewport past the top,
using two thresholds so it cannot flicker on a boundary, and reads scroll once per animation
frame. While hidden it stays mounted (so it can fade both ways) but drops out of the tab
order and the accessibility tree.

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

The CMS endpoints go through `revalidateSite()` in `src/lib/cms.ts`, which busts `/` **and
`/resume`** — both are prerendered (`○` in the build output), and `/resume` reads the
resume PDF path from settings.

`/projects/[slug]` is currently dynamic (`ƒ`), so revalidating it is defensive; it becomes
load-bearing the moment `generateStaticParams` is added.

Revalidation only clears the cache of the server that runs it. Editing against localhost
does **not** refresh the deployed site: production keeps its build-time HTML until a
mutation goes through the production admin, or the project is redeployed.

### Admin CMS

`/admin` is tabbed: Projects · Content · Skills · Social · Settings (`AdminNav`).

The projects list shows 10 per page with search over title/slug/technologies. Ordering has
two paths: drag-to-reorder within the page, and a **position input** per row showing the
project's global position, which moves it to any page. Both hit
`PATCH /api/projects/reorder`, which accepts either `{ids, startOrder}` or `{id, position}`.
A **Show all** toggle (`?all=1`) drops paging so dragging can reach every row. Ordering is
disabled while a search filter is active, since ordering a filtered list is meaningless.

Every `DndContext` **must keep its stable `id`** — without it dnd-kit derives
`aria-describedby` from a module-level counter that differs between server and client,
producing a hydration error on every reload.

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

The platform chip is derived from `techList`, so a new WordPress or PrestaShop project joins
its filter with no extra step — but only if it uses those exact labels. Keep `techList`
spelling consistent with the existing rows for the same reason.

## Gotchas

- Running `npm run dev` (Turbopack) after a `next build` overwrites `.next` and makes
  `next start` fail with `routesManifest.dataRoutes is not iterable`. Delete `.next` and
  rebuild before serving production locally.
- **The brand gradient plus a transparent border needs `bg-origin-border`.** A gradient is
  sized to the padding box but painted out to the border box, and the leftover strip under
  the border is filled by *repeating* it — so the light end of the gradient shows up as a
  fringe on the left edge and the dark end on the right, in both themes. It bit the active
  filter chip and the back-to-top button's hover state; both keep a border to avoid a layout
  shift, so both need `bg-origin-border`. Elements with the gradient and no border
  (pagination, project cards, `.btn`) are unaffected.
- `ADMIN_EMAIL` in `.env` has to match the `User` row that actually exists, or signing in
  against `/api/auth/callback/credentials` returns a 302 to
  `/admin/login?error=CredentialsSignin` with no other clue. `npm run db:seed` would fix the
  mismatch by creating a second user, but it also rewrites project rows — see the open
  threads below.
- The README is the untouched `create-next-app` boilerplate and describes a `pages/`
  router this project does not use — ignore it.

## Recent work (2026-08-14) — platform filters, reveal stagger

Three commits, `5c62b68..ba81a8d`:

1. **`5c62b68` platform filters on the projects grid** — `buildPlatformFilters()`,
   `?platform=` on the public feed, and `PlatformFilters`. Started as frequency-ranked
   technology chips and was reworked into the platform taxonomy described above.
2. **`24e774e` filter in the URL; chip borders** — `replaceState` sync and URL restore, plus
   the border/contrast fixes on the chips (the counts had their light and dark values
   swapped and failed WCAG AA at ~2.5:1 in both themes).
3. **`ba81a8d` staggered reveal, back-to-top, mobile filters** — `.reveal-stagger`, the
   `ScrollToTop` control, and the phone carousel (scroll snap, edge fades, toolbar
   keyboard).

**Peña Izquierdo** (`/pena-izquierdo`, penaizquierdo.com) was added — a Santo Domingo
insurance brokerage on WordPress + Elementor Pro + ACF over an Astra child theme, no public
repo. Like the other recent ones it lives **only in Postgres**, not in `prisma/seed.ts`.
That makes twelve published projects: eight React / Next.js, three WordPress, one
PrestaShop.

`techList` was normalised across three rows so the chips could not double-count the same
tool: `TanStack Query`→`React Query` (portal-311), `HeadlessUI`→`Headless UI` (thoughthub),
`ReactJS`→`React` (becas). Only `techList` was touched — `becas.technologies`, the subtitle
on its card, still reads "ReactJS".

Uncommitted at the time of writing: the `projects` **subheading** ("A pick of the work I'm
proudest of…"), which needed `SECTION_FIELDS`, a default, rendering in `Projects.tsx`, and a
targeted update of the `projects` row.

Open threads:

- Production has still never been revalidated — none of this is deployed, and Propio's card
  there points at a deleted image row that 404s.
- Propio's card still shows **real tenant data** (name, unit, rent and deposit) on a public
  page. The 1430×935 left crop offered twice has never been applied.
- `prisma/seed.ts` still knows only the original 6 projects and still pins `becas`/`gobdo`
  to the pre-redesign PNGs, so `db:seed` on the live database would revert two cards and
  drop the other six from a fresh one.
- The white text on the brand gradient sits at ~2.3:1 against the light end (`#709dff`).
  It is inherited from the design system — pagination and `.btn` share it — so fixing it
  means changing the gradient in `globals.css`, not patching one component.

## Earlier work (2026-08-07) — the CMS

`/admin` became a full CMS for the whole site: `SiteSection`, `Skill`, `SocialLink` and
`SiteSettings` were added (additive push, `Project` untouched), the public components now
read through `src/lib/content.ts`, `Contact` was split so only the form ships as a client
component, and the social links were de-duplicated out of four files into `SocialIcon` plus
one table. `/resume`'s rendered CV stays in code by choice; only its PDF path is managed.

Nine projects were also added or re-shot from the live sites (Villa del Arte, Propio,
Portal 311, CRM 311, EM Store; Becas and Gob.do re-captured after redesigns).

Open threads:

- `prisma/seed.ts` still pins `imageUrl` for **becas** and **gobdo** to the old static PNGs,
  so a `db:seed` would revert those two cards to pre-redesign screenshots.
- Production has never been revalidated since these edits were made against localhost, so
  the deployed homepage is stale — and Propio's card points at an image row that was
  deleted, which 404s.

## Earlier work (2026-08-06)

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
