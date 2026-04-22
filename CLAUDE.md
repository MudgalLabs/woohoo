# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Woohoo

### The Problem

Anyone whose leads, feedback, ideas, or criticism live inside DMs and comment threads — indie founders, freelancers, agencies, coaches, small service businesses — loses signal every week to the same problem. A post blows up, DMs start rolling in, comments pile up. Some are feature requests, some are warm leads saying "I'll try it this weekend", some are feedback, some are criticisms. There is no good way to capture and act on these interactions. Mental tracking fails. Spreadsheets are too slow and need discipline. Scrolling back through notifications and chat inboxes three days later is painful. Important signals get lost.

### The Solution

Woohoo is a lightweight follow-up tool for DMs and comments. It captures interactions worth acting on (messages, comments, replies) with one click via a browser extension, organizes them into **Woohoos** (one per platform + person), and nudges you to follow up at the right time. You still reply on the platform like a human — Woohoo just makes sure nothing slips.

Today the extension supports Reddit; X, LinkedIn, and more are next. The data model, API, and UI are built platform-agnostic — Reddit is the first integration, not a hardcoded assumption.

### Core Concept: A Woohoo

A **Woohoo** is a thread of saved interactions between you and one person on one platform. It is identified by `(platform, peer_id)` — e.g., `(reddit, u/some_user)`, and in the future `(x, @handle)`, `(linkedin, <profile_id>)`, etc. Each Woohoo has:

- A **timeline** of saved messages/comments, each linking back to its original URL on the platform, sorted by when it happened or when it was saved
- An optional **follow-up date** so you get reminded
- An `archivedAt` lifecycle — archived Woohoos drop out of the dashboard and stop counting toward the plan limit
- Metadata: platform, peer username, when the Woohoo was created, last interaction

> **A note on terminology:** the codebase uses "founder" as shorthand for the signed-in user (e.g., `founderExternalId`, "founder-authored comment"). That's a historical name — the actual audience is broader (see above). Treat "founder" as "the current Woohoo user" when reading the code.

**Example flow:** Someone comments "Cool product, DM me the link" on your Reddit post. You save the comment → new Woohoo created. You DM them, they reply "I'll check it out this weekend" → you save that DM → added to the same Woohoo's timeline. You set a follow-up for Monday. On Monday, the dashboard shows this Woohoo under "Follow up today". One click opens the Woohoo view; another click opens the Reddit chat room directly.

### Shipped today

The platform-agnostic core (data model, API, dashboard, plans, auth) is shipped. Reddit is the first and currently only extension integration.

1. **Extension (Reddit):** Injects a "Save" button on hover for Reddit chat DMs **and** post comments (`shreddit-comment`). 1-click opens a save modal, 1 more click confirms. Captures content, platform, peer ID, timestamp, source URL. Optional follow-up date-time picker. Popup shows session, stats, and a manual Reddit username fallback field. Content script scope is `https://www.reddit.com/*`; adding a new platform means a new adapter under `src/content/<platform>/` and widening the manifest scope.
2. **Backend:** `POST /api/woohoos/save` upserts a Woohoo by `(userId, platform, peerId)` and appends a `TimelineItem`. Platform is an enum — all routing, querying, and UI already key off it. See "Save routing rules" below — comment threading is non-trivial.
3. **Dashboard:** Three sections — "Follow up today", "Overdue", "Going cold" (no follow-up + no save in 7 days). Timezone-aware. Cards show platform, peer, last interaction, follow-up date, DM/comment counts.
4. **My Woohoos page** (`/my-woohoos`): grid with **Active** and **Archived** tabs, ordered by `lastSavedAt desc`.
5. **Woohoo detail view** (`/my-woohoos/[id]`): header, inline `FollowUpEditor`, timeline tabs split into DMs vs. Comments (comments support 1-level reply nesting), archive/delete buttons for the Woohoo, delete per timeline item, "Open chat" link.
6. **Plans & usage:** Free plan capped at 100 active Woohoos; Pro plan (unlimited, "Request early access" via mailto) resolved through `lib/plans.ts`. Sidebar widget (`SidebarUsage`) surfaces usage; `/settings/plan` shows the detail view and upgrade CTA.
7. **Settings:** `/settings` timezone editor; `/settings/plan` plan & usage view.
8. **Marketing site:** Full landing (`(marketing)/_landing/sections/*`), `/extension` install page, `/privacy` policy.
9. **Auth:** Google OAuth via better-auth; extension signs in by opening `/auth?from=ext&extId=…` in a tab and the web app posts the session token back via `chrome.runtime.sendMessage` (see `auth/ext-return`). No email/password in prod (toggleable via `ENABLE_EMAIL_PASSWORD_AUTH`).

### What's next (ordered)

- Additional platform adapters: X (tweet replies, DMs), LinkedIn (post comments, DMs), Instagram, etc. Each is a new value on the `Platform` enum + a new content-script adapter in `ext/src/content/`.
- Real Pro upgrade flow (Stripe) — today "Upgrade" is a mailto to `hey@woohoo.to`
- Daily follow-up digest email (Pro promise on the pricing page)
- Auto-discovery: scan platform APIs (e.g., Reddit subreddit search) for relevant posts/comments matching keywords, auto-suggest new Woohoos
- AI lead scoring: rank Woohoos by conversion likelihood
- AI reply suggestions (view in Woohoo, send manually on platform)

### What Woohoo is NOT

- Not an outbound tool — you still reply on the platform, manually
- Not a full CRM (no deals pipeline, no company tracking, no forecast)
- Not a social media scheduler or analytics tool

---

Woohoo is a lightweight follow-up tool for DMs and comments. It captures interactions worth acting on via a browser extension (1-click save, no tab switching), organizes them into Woohoos (one per platform + person), and nudges you to follow up — so nothing slips. It is an npm workspace monorepo sharing a PostgreSQL database:

- **`web/`** — Next.js 16 full-stack app (App Router, React 19, Tailwind v4, shadcn/ui, better-auth, Prisma)
- **`ext/`** — Browser extension MV3 (React 19, Vite, @crxjs/vite-plugin). Content-script scope is currently `https://www.reddit.com/*`; new platforms plug in as additional content-script adapters and a widened manifest scope. Builds both Chrome and Firefox artifacts (`build:chrome`, `build:firefox`).
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
npm run start   # start the built server (used inside the Docker image)
```

### Extension (`cd ext/`)

```bash
npm run dev            # Vite dev server with HMR (Chrome profile)
npm run build          # build both Chrome and Firefox artifacts
npm run build:chrome   # Chrome-only build
npm run build:firefox  # Firefox-only build
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
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth credentials
- `ENABLE_EMAIL_PASSWORD_AUTH` — optional, set to `"true"` to expose email/password alongside Google (off in prod)

## Architecture

### Data model (`web/prisma/schema.prisma`)

Domain models beyond better-auth tables:

- **`Woohoo`** — unique on `(userId, platform, peerId)`. Fields: `peerName`, `chatUrl`, `followUpAt`, `lastInteractionAt`, `lastSavedAt`, `archivedAt`. Cascades from `User`.
- **`TimelineItem`** — belongs to a Woohoo. Unique on `(woohooId, externalId)` (prevents duplicate saves). `type: dm | comment`, `contentText`, `contentHtml`, `sourceUrl`, `authorId`, `authorName`, `interactionAt`, `savedAt`, `parentId` (self-relation, 1-level reply threading for comments).
- **`Plan`** — unique on `tier` (`free` | `pro`). Fields: `name`, `activeWoohooLimit` (nullable = unlimited), `priceCents`.
- **`Subscription`** — unique on `userId`. Links a user to a plan, tracks `status` (`active | canceled | past_due | trialing`) and `endsAt`.
- **Enums** — `Platform` (currently `reddit` only), `TimelineItemType` (`dm` | `comment`), `PlanTier`, `SubscriptionStatus`.

A better-auth `databaseHooks.user.create.after` upserts a Free `Subscription` row for every new signup (see `lib/auth.ts`). **`Plan` rows must be seeded in prod** for that hook to succeed — `getUserPlan()` falls back to a hard-coded Free plan if no subscription exists, but the hook tries to link to the real Free plan row.

### API routes (`web/app/api/`)

All non-auth routes accept **either** a `Bearer <session.token>` header (used by the extension) **or** a better-auth cookie (used by the web app). See `lib/get-session-from-request.ts`.

- `POST /api/woohoos/save` — upsert Woohoo + create TimelineItem. Pre-checks the plan limit (blocks creations and unarchive-via-save with a 403 `plan_limit_reached`). See routing rules below.
- `GET /api/woohoos/check` — pre-save check: returns `{ saved, woohooId?, timelineItemId?, ancestorMatch? }`. Powers the extension's "Already saved" state and the "Saving to u/X's Woohoo" preview.
- `GET /api/woohoos` — list user's Woohoos with most-recent timeline item. Accepts `?archived=true|all` (default returns active only).
- `GET/PATCH/DELETE /api/woohoos/[id]` — detail fetch, update `followUpAt` / `archived`, or delete (cascades to timeline items). `PATCH` gates unarchive through the plan limit.
- `DELETE /api/timeline-items/[id]` — delete one item; recomputes the parent Woohoo's `lastInteractionAt`.
- `GET /api/stats` — `{ totalWoohoos, followUpToday }` for the extension popup and app header.
- `PATCH /api/me/timezone` — updates the signed-in user's timezone (validated via `isValidTimezone` in `lib/date-tz.ts`).

### Save routing rules (comments)

When a saved item is a comment, routing depends on authorship. The extension sends `founderExternalId` (the logged-in Reddit username) and `ancestorExternalIds` (nearest-first comment ancestors, up to ~10 deep).

- **Peer-authored comment** → always goes to the peer's own Woohoo (`peerId = authorId`).
- **Founder-authored comment with a saved peer ancestor** → threaded into that peer's Woohoo, and its `parentId` rolls up to the ancestor's **root** timeline item so the detail view stays at 1-level nesting regardless of how deep the real Reddit tree is.
- **Founder-authored comment with no saved ancestor** → falls back to the upsert-by-`peerId` path.

Change this logic in `web/app/api/woohoos/save/route.ts` (and keep `api/woohoos/check/route.ts` aligned — it mirrors the same match rules for the UI preview).

### Plans & limits (`web/lib/plans.ts`)

- `getUserPlan(userId)` — resolves the user's plan via their `Subscription` row, or returns a hard-coded Free fallback so callers never have to branch on "no subscription".
- `getActiveWoohooCount(userId)` — count of `archivedAt: null` Woohoos.
- `assertCanActivateWoohoo(userId)` — throws `PlanLimitError` (carrying `limit` and `planName`) if creating or unarchiving one more Woohoo would exceed the plan's `activeWoohooLimit`. Called by `POST /api/woohoos/save` and `PATCH /api/woohoos/[id]`. The 403 response includes `code: "plan_limit_reached"`, `limit`, `planName` so the extension and web app can surface a specific upgrade nudge.

### Web app structure

- `app/` — Next.js App Router pages and API routes
    - `api/auth/[...all]/` — better-auth catch-all
    - `(app)/` — protected route group (layout enforces session, renders `AppHeader`, sidebar, and `SidebarUsage` widget; also backfills the user's timezone via `TimezoneBackfill`)
        - `dashboard/` — three-section dashboard (Follow up today / Overdue / Going cold), TZ-aware
        - `my-woohoos/` — list page with Active/Archived tabs (`WoohooCard` grid)
        - `my-woohoos/[id]/` — detail page (`FollowUpEditor`, `ChatBubble`, `CommentCard`, `ArchiveWoohooButton`, `DeleteWoohooButton`, `DeleteTimelineItemButton`)
        - `settings/` — timezone form
        - `settings/plan/` — plan & usage view with upgrade CTA
    - `(marketing)/` — public marketing group (shares `Nav` + `Footer`)
        - `page.tsx` + `_landing/sections/*` — Hero, Strip, Problem, HowItWorks, ThreadMock, Dashboard, IsIsnt, Pricing, Faq, CtaBig (mocks live under `_landing/demo/`)
        - `extension/` — install page with Chrome/Firefox cards. **Links are `href="#"` placeholders until the store listings go live.**
        - `privacy/` — privacy policy
    - `auth/` — unified sign-in/sign-up page (Google OAuth). `auth/ext-return` posts the session token back to the extension via `chrome.runtime.sendMessage` after OAuth.
- `lib/` — shared server/client utilities
    - `auth.ts` — better-auth server config (Google social sign-in, Prisma adapter, bearer plugin for extension, `databaseHooks.user.create.after` seeds a Free `Subscription`)
    - `auth-client.ts` — client-side better-auth instance
    - `prisma.ts` — Prisma client singleton (use this, don't instantiate a new one)
    - `get-session.ts` — cookie-based session helper (server components)
    - `get-session-from-request.ts` — Bearer-or-cookie helper (use in API route handlers so the extension can authenticate)
    - `plans.ts` — plan resolution and limit gating (see above)
    - `timeline-counts.ts` — `getTimelineCountsByWoohoo()`; grouped counts of dm vs. comment per Woohoo for card badges
    - `date-tz.ts` — timezone-aware helpers (`startOfDayInTz`, `endOfDayInTz`, `dayDiffInTz`, `isValidTimezone`)
    - `constants.ts` — app routes + header metadata
- `components/` — app-level components (`DateTimePicker`, `PlatformIcon`, `empty-state`, `no-woohoos-yet`, etc.)
- `prisma/` — schema and migrations (PostgreSQL, Prisma 7). Generated client output is `app/generated/prisma/` — import from `@/app/generated/prisma/client`.

### Extension structure

- `src/content/` — content script injected on Reddit pages (`main.tsx` mounts `views/App.tsx`)
    - `reddit/dm.ts` — observes the chat popup + `/chat/room/*` page, scans `.room-message-body`, injects a hover save button on each message. Handles lazy-loaded messages via a MutationObserver.
    - `reddit/comment.ts` — observes `/r/*/comments/*` post pages, scans `shreddit-comment`, walks ancestors (up to ~10 deep) to collect `ancestorExternalIds` for threading.
    - `reddit/founder.ts` — resolves the logged-in Reddit username (primary: fetch `/api/me.json`; fallback: scrape the user drawer). Cached in `chrome.storage.local`. Used server-side to route comment saves deterministically.
    - `views/`, `store/`, `lib/` — modal UI, active-save-button state, DOM / theme helpers.
- `src/popup/` — extension popup UI (sign-in, session state, stats line, Reddit username override, sign-out, open-dashboard)
- `src/background/index.ts` — MV3 service worker (Chrome) / background script (Firefox). Handles internal messages (`GET_SESSION`, `SIGN_OUT`, `GET_STATS`) and the **external** `AUTH_SUCCESS` message the web app posts after OAuth. External messages are restricted to `https://woohoo.to` and `http://localhost:3000` via `ALLOWED_EXTERNAL_ORIGINS` + manifest `externally_connectable`.
- `src/components/` — shared components (`SaveButton`, `SaveModal`, `DateTimePicker`, `Branding`, `Toast`, `Logo`)
- `manifest.config.ts` — MV3 manifest. Content script scope is `https://www.reddit.com/*`. Host permissions also cover `woohoo.to` (and localhost in dev) for API calls. Permissions are intentionally minimal: `storage`. Firefox variant adds `browser_specific_settings.gecko` including `data_collection_permissions`.

The extension talks to the backend through `WoohooApiClient` from `@woohoo/api`, authenticated via Bearer token (stored in extension storage after sign-in).

### UI components

The shadcn story is split across two directories:

- **`packages/ui/src/components/`** — reusable primitives (button, card, input, label, alert-dialog, avatar, dropdown-menu, count-badge, tabs, …). `components.json` lives at `packages/ui/components.json`. Add new primitives here with `cd packages/ui && npx shadcn@latest add <component>`, then re-export from `packages/ui/src/index.ts`. Consume from `web/` via `import { Button } from "@woohoo/ui"`.
- **`web/components/ui/`** — app-specific primitives that are unlikely to be reused (sidebar, sheet, separator, skeleton, tooltip). Imported via `@/components/ui/*`.

Rule of thumb: generic primitive → `packages/ui`. Layout/app-specific primitive → `web/components/ui`.

### Shared API client (`packages/api`)

`WoohooApiClient` (in `packages/api/src/client.ts`) is the single HTTP surface consumed by both `web/` and `ext/`. It wraps: `signOut`, `getSession`, `saveItem`, `checkSaved`, `deleteWoohoo`, `deleteTimelineItem`, `getStats`. Accepts an `onUnauthorized` callback so callers can trigger re-auth on 401. `saveItem` surfaces `plan_limit_reached` errors with `limit` and `planName` so the UI can show a specific message.

Types shared across apps live in `packages/api/src/types.ts`: `WoohooUser`, `AuthSession`, `RedditMessage`, `SaveItemPayload`, `SaveItemResponse`, `CheckSavedResponse`, `StatsResponse`, `ApiError`. **When you add a new API endpoint, add its types here and a method on `WoohooApiClient` — don't call `fetch` directly from `ext/` or feature components.**

### Auth

Authentication is handled entirely by better-auth. The schema includes standard better-auth tables: `User`, `Session`, `Account`, `Verification`. The `User` model carries an additional `timezone` field (set via `/api/me/timezone`). Google is the only social provider wired up; email/password is behind `ENABLE_EMAIL_PASSWORD_AUTH`.

**Extension sign-in flow:** popup opens `/auth?from=ext&extId=<chrome.runtime.id>` in a tab. After Google OAuth, the web app redirects to `/auth/ext-return`, which calls `chrome.runtime.sendMessage(extId, { type: "AUTH_SUCCESS", token, user })`. The extension's background script validates the sender origin, writes `{ session: { token, user } }` to `chrome.storage.local`, and closes the tab. Manifest `externally_connectable` and `trustedOrigins` in `auth.ts` must both allow the web origin.

Don't manually manage sessions — use `getSession()` from `lib/get-session.ts` on the server, `getSessionFromRequest()` in API route handlers (for cookie+Bearer support), and `authClient` from `lib/auth-client.ts` on the client.

### Deployment

- Web is self-hosted on a Hetzner VPS via Docker. `.github/workflows/deploy.yml` builds the image from `web/Dockerfile` (multi-stage, Next.js standalone output), pushes to DockerHub, then SSHes to the VPS and runs `docker compose up -d` using `compose.yaml` + `compose.deploy.yaml`. Caddy (`caddy_net` external network) fronts the web container for TLS.
- Extension builds to `ext/dist/` + `ext/release/woohoo.zip` for Chrome Web Store / Firefox AMO upload
- Production Docker setup uses `compose.deploy.yaml` (overrides `compose.yaml`)
