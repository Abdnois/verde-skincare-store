# VERDÉ

A skincare storefront for a small-batch centella range: a framed hero with
floating product cards, a filterable catalogue, product pages with reviews, a
skin quiz that builds a routine, wishlist, bag drawer, checkout and order
history. It is built as a React single-page app served by a Cloudflare Worker
that also exposes a small JSON API.

The store is a front-end demo: there is no payment processor, no email
delivery and no database. See [Demo behaviour](#demo-behaviour) before showing
it to anyone as a live shop.

## Technologies

| Layer | Choice |
| --- | --- |
| UI | React 19, React Router 8 |
| Styling | Tailwind CSS 4 (tokens in `src/styles.css`), Motion for transitions, lucide-react icons |
| Build | Vite 8 with `@vitejs/plugin-react` and `@cloudflare/vite-plugin` |
| Language | TypeScript 5.9 (strict, `tsc --noEmit` for checking) |
| Server | Hono 4 running as a Cloudflare Worker (`src/worker/index.ts`) |
| Runtime target | Cloudflare Workers, `compatibility_date` 2026-09-29 |

## Prerequisites

- **Node.js 22.12+** — required by Wrangler 4 and Vite 8. Developed and verified
  on Node 24.
- **npm** — the repository is locked with `package-lock.json`
  (`packageManager: npm@11.19.1`). Bun is not required and no bun lockfile is
  kept.
- No Cloudflare account, API keys or environment variables are needed to run
  the site locally. The dev server runs the Worker in Miniflare.

## Install

```sh
npm ci
```

`npm ci` installs exactly the versions in `package-lock.json` and fails if the
lockfile and `package.json` disagree. Use `npm install` only when you intend to
change dependencies, and commit the resulting lockfile.

## Develop

```sh
npm run dev
```

Vite serves the app and the Worker together at <http://localhost:5306> (the port
is fixed with `strictPort`, so the command fails rather than silently moving if
5306 is taken). Editing a page or Worker route hot-reloads in place.
`GET /api/health` returns `{ "ok": true }` when the Worker is up.

## Typecheck and build

```sh
npm run typecheck   # tsc --noEmit, no output
npm run build       # vite build, then scripts/postbuild.mjs
```

`npm run build` writes the deployment layout described in
[Deployment](#deployment). `scripts/postbuild.mjs` then removes hidden files and
source maps from `dist/`, because the Sites uploader rejects them; it resolves
its paths with `fileURLToPath`, so it works on Windows as well as POSIX.

## Production preview

```sh
npm run build
npm run preview     # http://localhost:4173
```

`vite preview` serves the built `dist/` through the Cloudflare plugin, so the
Worker routes are live and the SPA fallback behaves as it does in production.
This is a local check only — it does not deploy anything. Set a different port
with `npm run preview -- --port 5000`.

## Demo behaviour

Everything below works end to end in the browser, but it is deliberately local
and disposable. Read this before pitching the site as production-ready.

- **Checkout takes no payment.** The form collects contact and shipping details
  only; there is no card field and no processor. It posts the bag to
  `POST /api/orders`, which validates the fields and returns a reference like
  `DL-OV48SQ`.
- **Orders are not stored on a server.** The confirmation page and `/orders`
  read from `localStorage`, so an order exists only in that browser and
  disappears if site data is cleared. Nothing is emailed, so the "receipt is on
  its way" style copy in the UI is aspirational.
- **Contact, newsletter and review submissions are acknowledged, not
  delivered.** The Worker validates them and returns a ticket or id; no email
  is sent, no ticket queue exists and no review is moderated by a server.
  Reviews you write are saved locally.
- **Cart, wishlist and quiz answers** also live in `localStorage`.
- **Product data, prices, reviews, quiz questions, FAQ and copy** are static
  content in `src/content.ts`.

To make it a real shop you would replace the `/api/orders` handler with a
payment provider's checkout session, persist orders in a database (for example
D1), and connect a transactional email service for receipts. None of that is
wired up here.

## Deployment

The build produces two directories:

```
dist/
  client/          static assets: index.html, hashed JS/CSS, images, favicon
  skincare_shop/   index.js (the Worker) + wrangler.json
```

Two config files describe the same target:

- **`deploy.json`** — the manifest this project's hosting uses. It points at
  `./dist/skincare_shop/index.js` as the ESM entrypoint and `./dist/client` as
  the asset directory, with `"spa": true` so client-side routes fall back to
  `index.html`. Build before deploying; the paths must exist on disk.
- **`wrangler.jsonc`** — the Worker definition for local dev and for deploying
  to your own Cloudflare account: `main` is `src/worker/index.ts`, the `ASSETS`
  binding uses `not_found_handling: "single-page-application"` with
  `run_worker_first: true`, and observability is enabled.

Keep `compatibility_date` in `deploy.json` and `wrangler.jsonc` in sync. No
secrets are required by the current feature set; if you add a payment or email
provider, put its key in the host's secret store rather than in the repository.

## Project layout

| What | File |
| --- | --- |
| All copy, products, reviews, quiz, FAQ, shipping options | `src/content.ts` |
| Photography (one constant) | `PHOTOS` in `src/content.ts` |
| Design tokens and keyframes | `src/styles.css` (`@theme`), mirrored in `src/lib/tokens.ts` for the style guide |
| Components | `src/components/` (`ui.tsx` primitives, `ProductCard`, `ProductArt`, `Art`, `Drawer`, `Nav`, `Chrome`) |
| Screens | `src/pages/` |
| Cart, wishlist, orders, reviews, toasts | `src/lib/store.tsx` |
| Worker routes | `src/worker/index.ts` |
| Build cleanup | `scripts/postbuild.mjs` |

Screens: `/` home, `/shop` catalogue, `/product/:slug`, `/quiz`, `/wishlist`,
`/checkout`, `/order/:reference`, `/orders`, `/contact`, `/about`,
`/styleguide`, and a 404 for anything else.

`/styleguide` renders colours, type, spacing, radii, shadows and motion, plus
every component in each state (hover, focus and pressed are pinned with
`data-force`, e.g. `<Button force="hover">`). It is a development reference.

## Photography

Every image goes through `PHOTOS` in `src/content.ts`: hero, the Our Lab
portrait, four review avatars and one packshot per product, all in
`public/images/`. They are AI-generated stand-ins; replace them with real
photography by dropping files in `public/images/` and editing the paths. Remove
an entry and that spot falls back to an SVG still life
(`src/components/ProductArt.tsx`, `HeroArt` in `src/components/Art.tsx`), so the
store never shows a broken image. Keep the hero subject right of centre — the
headline sits on the left, and the mobile layout depends on that crop.

## Worker API

| Route | Success | Failure |
| --- | --- | --- |
| `GET /api/health` | 200 `{ ok: true }` | |
| `POST /api/orders` | 201 `{ reference }` | 400 bad JSON, empty bag or invalid items; 422 with `fields` |
| `POST /api/newsletter` | 201 `{ ok: true }` | 422 with `fields` |
| `POST /api/contact` | 201 `{ ticket }` | 400, 422 with `fields` |
| `POST /api/reviews` | 201 `{ id }` | 400, 422 with `fields` |
| any other `/api/*` | | 404 JSON |
| everything else | static assets via `env.ASSETS` | |

Validation is server-side and duplicated in the forms for immediate feedback.
Responses are generated on the fly; nothing is written to storage.

## Contrast note

White copy sits on the `hero-wall` (lit in the middle, dark at the edges) or the
even `wall-calm` used by text-heavy panels. Keep text off the light pool behind
the bottle, or it drops below WCAG AA.
