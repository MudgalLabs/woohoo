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

### MVP Scope (shipped)

1. **Extension:** Injects a "Save" button on hover for Reddit chat DMs **and** post comments (`shreddit-comment`). 1-click opens a save modal, 1 more click confirms. Captures content, platform, peer ID, timestamp, source URL. Optional follow-up date-time picker.
2. **Backend:** `POST /api/woohoos/save` upserts a Woohoo by `(userId, platform, peerId)` and appends a `TimelineItem`. See "Save routing rules" below — comment threading is non-trivial.
3. **Dashboard:** Three sections — "Follow up today", "Overdue", "Maybe getting cold". Cards show platform, peer, last interaction, follow-up date, DM/comment counts.
4. **My Woohoos page** (`/my-woohoos`): grid of all Woohoos ordered by `lastSavedAt desc`.
5. **Woohoo detail view** (`/my-woohoos/[id]`): header, inline follow-up editor, timeline tabs split into DMs vs. Comments, delete buttons for the Woohoo and individual timeline items, "Open Chat" link.

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

### Data model (`web/prisma/schema.prisma`)

Three domain models beyond better-auth tables:

- **`Woohoo`** — unique on `(userId, platform, peerId)`. Fields: `peerName`, `chatUrl`, `followUpAt`, `lastInteractionAt`, `lastSavedAt`. Cascades from `User`.
- **`TimelineItem`** — belongs to a Woohoo. Unique on `(woohooId, externalId)` (prevents duplicate saves). `type: dm | comment`, `contentText`, `contentHtml`, `sourceUrl`, `authorId`, `authorName`, `interactionAt`, `savedAt`.
- **Enums** — `Platform` (currently `reddit` only), `TimelineItemType` (`dm` | `comment`).

### API routes (`web/app/api/`)

All non-auth routes accept **either** a `Bearer <session.token>` header (used by the extension) **or** a better-auth cookie (used by the web app). See `lib/get-session-from-request.ts`.

- `POST /api/woohoos/save` — upsert Woohoo + create TimelineItem. See routing rules below.
- `GET /api/woohoos/check` — pre-save check: returns `{ saved, woohooId?, timelineItemId?, ancestorMatch? }`. Powers the extension's "Already saved" state and the "Saving to u/X's Woohoo" preview.
- `GET /api/woohoos` — list user's Woohoos with most-recent timeline item.
- `GET/PATCH/DELETE /api/woohoos/[id]` — detail fetch, update `followUpAt`, or delete (cascades to timeline items).
- `DELETE /api/timeline-items/[id]` — delete one item; recomputes the parent Woohoo's `lastInteractionAt`.
- `GET /api/stats` — `{ totalWoohoos, followUpToday }` for the header badge.

### Save routing rules (comments)

When a saved item is a comment, routing depends on authorship. The extension sends `founderExternalId` (the logged-in Reddit username) and `ancestorExternalIds` (nearest-first comment ancestors, up to ~10 deep).

- **Peer-authored comment** → always goes to the peer's own Woohoo (`peerId = authorId`).
- **Founder-authored comment with a saved peer ancestor** → threaded into that peer's Woohoo. This is how "founder replying inside a lead's thread" stays in one timeline.
- **Founder-authored comment with no saved ancestor** → falls back to the upsert-by-`peerId` path.

Change this logic in `web/app/api/woohoos/save/route.ts` (and keep `api/woohoos/check/route.ts` aligned — it mirrors the same match rules for the UI preview).

### Web app structure

- `app/` — Next.js App Router pages and API routes
    - `api/auth/[...all]/` — better-auth catch-all
    - `(app)/` — protected route group (layout enforces session, renders `AppHeader` + sidebar)
        - `dashboard/` — three-section dashboard (Follow up today / Overdue / Maybe getting cold)
        - `my-woohoos/` — list page (`WoohooCard` grid)
        - `my-woohoos/[id]/` — detail page (`FollowUpEditor`, `ChatBubble`, `CommentCard`, delete buttons)
    - `(marketing)/extension/` — public extension info page
    - `sign-in/`, `sign-up/` — auth pages
- `lib/` — shared server/client utilities
    - `auth.ts` — better-auth server config (email+password, Prisma adapter)
    - `auth-client.ts` — client-side better-auth instance
    - `prisma.ts` — Prisma client singleton (use this, don't instantiate a new one)
    - `get-session.ts` — cookie-based session helper (server components)
    - `get-session-from-request.ts` — Bearer-or-cookie helper (use in API route handlers so the extension can authenticate)
    - `timeline-counts.ts` — `getTimelineCountsByWoohoo()`; grouped counts of dm vs. comment per Woohoo for card badges
- `components/` — app-level components (`DateTimePicker`, `PlatformIcon`, `empty-state`, etc.)
- `prisma/` — schema and migrations (PostgreSQL, Prisma 7). Generated client output is `app/generated/prisma/` — import from `@/app/generated/prisma/client`.

### Extension structure

- `src/content/` — content script injected on Reddit pages
    - `reddit/dm.ts` — observes the chat popup, scans `.room-message-body`, injects a hover save button on each message. Handles lazy-loaded messages via a MutationObserver.
    - `reddit/comment.ts` — observes `/r/*/comments/*` post pages, scans `shreddit-comment`, walks ancestors to collect `ancestorExternalIds` for threading.
    - `reddit/founder.ts` — reads the logged-in Reddit username so the content script can send `founderExternalId` with every save.
    - `views/`, `store/`, `lib/` — modal UI, extension state, helpers.
- `src/popup/` — extension popup UI (sign-in, session state)
- `src/sidepanel/` — side panel UI
- `src/components/` — shared components (SaveButton, SaveModal, etc.)
- `manifest.config.ts` — MV3 manifest. Content script scope is `https://www.reddit.com/*`. Host permissions also cover `woohoo.to` and localhost for API calls.

The extension talks to the backend through `WoohooApiClient` from `@woohoo/api`, authenticated via Bearer token (stored in extension storage after sign-in).

### UI components

The shadcn story is split across two directories:

- **`packages/ui/src/components/`** — reusable primitives (button, card, input, label, alert-dialog, avatar, dropdown-menu, …). `components.json` lives at `packages/ui/components.json`. Add new primitives here with `cd packages/ui && npx shadcn@latest add <component>`, then re-export from `packages/ui/src/index.ts`. Consume from `web/` via `import { Button } from "@woohoo/ui"`.
- **`web/components/ui/`** — app-specific primitives that are unlikely to be reused (sidebar, sheet, separator, skeleton, tooltip). Imported via `@/components/ui/*`.

Rule of thumb: generic primitive → `packages/ui`. Layout/app-specific primitive → `web/components/ui`.

### Shared API client (`packages/api`)

`WoohooApiClient` (in `packages/api/src/client.ts`) is the single HTTP surface consumed by both `web/` and `ext/`. It wraps: `signIn`, `signOut`, `getSession`, `saveItem`, `checkSaved`, `deleteWoohoo`, `deleteTimelineItem`, `getStats`. Accepts an `onUnauthorized` callback so callers can trigger re-auth on 401.

Types shared across apps live in `packages/api/src/types.ts`: `WoohooUser`, `AuthSession`, `RedditMessage`, `SaveItemPayload`, `SaveItemResponse`, `CheckSavedResponse`, `StatsResponse`. **When you add a new API endpoint, add its types here and a method on `WoohooApiClient` — don't call `fetch` directly from `ext/` or feature components.**

### Auth

Authentication is handled entirely by better-auth. The schema includes standard better-auth tables: `User`, `Session`, `Account`, `Verification`. Don't manually manage sessions — use `getSession()` from `lib/get-session.ts` on the server and `authClient` from `lib/auth-client.ts` on the client.

### Deployment

- Web deploys to Cloudflare Workers via `opennextjs-cloudflare` (`npm run deploy` from `web/`)
- Extension builds to `ext/release/woohoo.zip` for Chrome Web Store upload
- Production Docker setup uses `compose.deploy.yaml` (overrides `compose.yaml`)
