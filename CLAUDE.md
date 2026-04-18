# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Woohoo

### The Problem

Founders, indie hackers, and solopreneurs use Reddit (and other platforms) to market their products. When a post blows up, they get flooded with comments and DMs — some are feature requests, some are warm leads saying "I'll try it this weekend", some are feedback, some are criticisms. There is no good way to capture and act on these interactions. Mental tracking fails. Spreadsheets are too slow and need discipline. Scrolling back through notifications and chat inboxes is painful. Important signals get lost.

### The Solution

Woohoo is a social CRM for indie founders. It captures important social media interactions (messages, comments, replies) with one click via a browser extension, organizes them into **Woohoos** (one per platform + person), and reminds founders to follow up at the right time.

### Core Concept: A Woohoo

A **Woohoo** is a thread of saved interactions between the founder and one person on one platform. It is identified by `(platform, peer_id)` — e.g., `(reddit, u/some_user)`. Each Woohoo has:

- A **timeline** of saved messages/comments, each linking back to its original URL on the platform, sorted by when it happened or when it was saved
- An optional **follow-up date** so the founder gets reminded
- Metadata: platform, peer username, when the Woohoo was created, last interaction

**Example flow:** Someone comments "Cool product, DM me the link" on a Reddit post. Founder saves the comment → new Woohoo created. Founder DMs them, they reply "I'll check it out this weekend" → founder saves that DM → added to the same Woohoo's timeline. Founder sets a follow-up for Monday. On Monday, the dashboard shows this Woohoo under "Follow up today". One click opens the Woohoo view; another click opens the Reddit chat room directly.

### MVP Scope (current focus)

1. **Extension (wedge):** Inject a "Save" button on Reddit chat DM messages. 1-click opens a save modal, 1 more click confirms. Captures: message content, platform, peer ID, message timestamp, chat room URL. Optional: set a follow-up date-time before saving.
2. **Backend:** API to receive saved messages, create a Woohoo if none exists for `(platform, peer)`, append to its timeline.
3. **Dashboard:** Three sections — "Follow up today", "Overdue", "Maybe getting cold" (no interaction saved for N days). Each shows a Woohoo card with platform, peer, last interaction summary, follow-up date.
4. **Your Woohoos page:** List of all Woohoos with 1-2 filters (e.g., platform, has follow-up) and 1-2 sort options (e.g., last saved, follow-up date).
5. **Woohoo detail view:** Header (platform, peer, created date), full timeline (comments/replies link to original URL on the platform), "Open Chat" button linking to the original chat room.

### Post-MVP (ordered)

- Save Reddit post comments (not just DMs) via extension
- Landing page for acquisition
- Free plan: up to 100 active Woohoos; Paid plan: unlimited Woohoos + platforms
- Multi-platform support: X (tweet replies, DMs), LinkedIn (post comments, DMs), Instagram, etc.
- Auto-discovery: use Reddit API to scan subreddits/posts for relevant comments matching keywords, auto-suggest new Woohoos
- AI lead scoring: rank Woohoos by conversion likelihood
- AI reply suggestions (view in Woohoo, send manually on platform)

### What Woohoo is NOT (for now)

- Not a tool for sending messages (no outbound via Woohoo)
- Not a full CRM (no deals pipeline, no company tracking)
- Not a social media scheduler or analytics tool

---

Woohoo is a social CRM for indie founders. It captures warm leads from Reddit DMs and comments via a browser extension (1-click save, no tab switching), organizes them into Woohoos (one per platform + person), and reminds founders to follow up — so no warm lead goes cold. It is an npm workspace monorepo sharing a PostgreSQL database:

- **`web/`** — Next.js 16 full-stack app (App Router, React 19, Tailwind v4, shadcn/ui, better-auth, Prisma)
- **`ext/`** — Chrome extension MV3 (React 19, Vite, @crxjs/vite-plugin), currently scoped to `https://www.reddit.com/*`
- **`packages/ui`** (`@woohoo/ui`) — shared, reusable shadcn primitives consumed by `web/` (and any future app)
- **`packages/api`** (`@woohoo/api`) — shared API client and types consumed by `web/` and `ext/`

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

### UI components

The shadcn story is split across two directories:

- **`packages/ui/src/components/`** — reusable primitives (button, card, input, label, alert-dialog, avatar, dropdown-menu, …). `components.json` lives at `packages/ui/components.json`. Add new primitives here with `cd packages/ui && npx shadcn@latest add <component>`, then re-export from `packages/ui/src/index.ts`. Consume from `web/` via `import { Button } from "@woohoo/ui"`.
- **`web/components/ui/`** — app-specific primitives that are unlikely to be reused (sidebar, sheet, separator, skeleton, tooltip). Imported via `@/components/ui/*`.

Rule of thumb: generic primitive → `packages/ui`. Layout/app-specific primitive → `web/components/ui`. Note: button and input currently exist in both locations for legacy reasons — prefer the `@woohoo/ui` version in new code.

### Auth

Authentication is handled entirely by better-auth. The schema includes standard better-auth tables: `User`, `Session`, `Account`, `Verification`. Don't manually manage sessions — use `getSession()` from `lib/get-session.ts` on the server and `authClient` from `lib/auth-client.ts` on the client.

### Deployment

- Web deploys to Cloudflare Workers via `opennextjs-cloudflare` (`npm run deploy` from `web/`)
- Extension builds to `ext/release/woohoo.zip` for Chrome Web Store upload
- Production Docker setup uses `compose.deploy.yaml` (overrides `compose.yaml`)
