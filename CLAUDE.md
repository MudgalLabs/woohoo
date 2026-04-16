# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Woohoo

Woohoo lets users save DMs, comments, and replies from social media (currently Reddit) before they get lost to the scroll. It consists of two applications sharing a PostgreSQL database:

- **`web/`** — Next.js 16 full-stack app (App Router, React 19, Tailwind v4, shadcn/ui, better-auth, Prisma)
- **`ext/`** — Chrome extension MV3 (React 19, Vite, @crxjs/vite-plugin), currently scoped to `https://www.reddit.com/*`

## Development Commands

### Starting the full stack

```bash
make dev        # starts docker db + tmux session with web and ext dev servers
make up         # start only the PostgreSQL container
make kill       # kill the tmux session
```

### Web app (`cd web/`)

```bash
npm run dev     # Next.js dev server (port 3000, turbopack)
npm run build   # production build
npm run lint    # ESLint
npm run preview # preview Cloudflare Workers deployment locally
npm run deploy  # deploy to Cloudflare Workers (opennextjs-cloudflare)
```

### Extension (`cd ext/`)

```bash
npm run dev     # Vite dev server with HMR
npm run build   # build to dist/ + release/woohoo.zip
```

### Database

```bash
# Run from web/
npx prisma migrate dev --name <name>   # create and apply a new migration
npx prisma migrate deploy              # apply migrations (used in Docker/prod)
npx prisma generate                    # regenerate the Prisma client after schema changes
```

## Environment Setup

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` — use the host-side URL (`localhost:42071`) for running `npm run dev` outside Docker; use the container-side URL (`woohoo_db:5432`) when running inside compose
- `BETTER_AUTH_SECRET` — random secret for signing sessions
- `BETTER_AUTH_URL` — set to `http://localhost:3000` for local dev

## Architecture

### Web app structure

- `app/` — Next.js App Router pages and API routes
  - `api/auth/[...all]/` — better-auth catch-all handler (handles all `/auth/*` endpoints)
  - `dashboard/` — protected area (requires session)
  - `sign-in/`, `sign-up/` — auth pages
- `lib/` — shared server/client utilities
  - `auth.ts` — better-auth server config (email+password, Prisma adapter)
  - `auth-client.ts` — client-side better-auth instance
  - `prisma.ts` — Prisma client singleton (use this, don't instantiate a new one)
  - `get-session.ts` — server-side session helper
- `components/` — React components (shadcn/ui based)
- `prisma/` — schema and migrations (PostgreSQL, Prisma 7)

### Extension structure

- `src/content/` — content script injected on Reddit pages
- `src/popup/` — extension popup UI
- `src/sidepanel/` — side panel UI
- `src/components/` — shared components (SaveButton, SaveModal, etc.)
- `manifest.config.ts` — extension manifest (permissions, content script matches)

### Auth

Authentication is handled entirely by better-auth. The schema includes standard better-auth tables: `User`, `Session`, `Account`, `Verification`. Don't manually manage sessions — use `getSession()` from `lib/get-session.ts` on the server and `authClient` from `lib/auth-client.ts` on the client.

### Deployment

- Web deploys to Cloudflare Workers via `opennextjs-cloudflare` (`npm run deploy` from `web/`)
- Extension builds to `ext/release/woohoo.zip` for Chrome Web Store upload
- Production Docker setup uses `compose.prod.yaml` (overrides `compose.yaml`)
