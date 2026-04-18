# Woohoo MVP Visual Polish — Multi-Session Feedback Overview

## Context

Reviewed the current MVP surfaces (dashboard, My Woohoos detail view, sidebar, extension content + popup) against references (Vercel and Resend sidebars). Goal: make the MVP look "sexy AF" before shipping. Rather than attempting all polish in one pass, we're saving the full feedback below as a durable reference and then tackling one surface per session so we can go deep on each.

**Workflow:** Each session, reload this file → pick the next section → move that section from "Pending" to "In progress" → implement → mark "Done" → repeat.

---

## Session tracker

- [x] Sidebar — account row with dropdown (avatar, theme toggle, sign out); ThemeToggle.tsx deleted; monorepo convention documented in CLAUDE.md.
- [x] Dashboard — hero stats strip, 2×2 layout (Today+Overdue top, Going cold bottom full-width), WoohooCard gets initials avatar + explicit counts ("2 DMs · 4 comments") + overdue variant (red left border + red follow-up text). Polish flows to My Woohoos since WoohooCard is shared.
- [x] Woohoo detail — header gets 48px peer avatar + meta line (counts · last-interaction timeAgo · Open chat), created-date removed from view; timeline split into Messages | Comments tabs (default opens the tab with content); native datetime-local swapped for a `DateTimePicker` composite (shadcn Popover + Calendar + time input, primitives installed into `packages/ui`); `CommentCard` rewritten as a compact bordered card with `isFromPeer` prop (OP variant has left-edge primary accent + "You replied" header); day divider lifted out of the per-item wrapper. Follow-up polish pass rebuilt `DateTimePicker` from scratch (custom day/month/year views, Today button, custom time input), fixed `lastInteractionAt` to track MAX(timeline_item.interactionAt), killed the save-flicker, and made timeline delete buttons always-visible.
- [ ] **Extension (content modals + popup)** — in progress: theme matching, SaveModal auto-close + bottom-right toast, standalone ext DateTimePicker, popup stats + Open dashboard. Plan: `~/.claude/plans/wobbly-dazzling-feigenbaum.md`.
- [x] Cross-cutting polish — wordmark `tracking-tight`; detail h1 bumped to `text-2xl tracking-tight`; zero-state h1 bumped to `text-xl tracking-tight`; HeroStats count numbers promoted to `text-base font-semibold tracking-tight` so they read as data vs. labels. WoohooCard follow-up label switched from absolute date to human-readable (`Follow up today` / `in 5d` / `Overdue yesterday` / `Overdue 4d` — no weeks/months). Shared `EmptyState` primitive at `web/components/empty-state.tsx` replaces five text-only empty states with icon + sentence (Coffee / CheckCircle2 / Flame / Inbox / MessageSquare / MessageSquareText). CommentCard hover background removed (not clickable). Tabs trigger now has a `hover:text-foreground` + `cursor-pointer` for scannable clickability. `variant="today"` was tried but dropped — not earning its weight.
- [ ] Save-rule enforcement (separate session before MVP ships) — deterministic comment routing by author; remove SaveModal checkbox. Detailed brief in "Deferred / backlog" below.

---

## Deferred / backlog

Detail for the non-obvious items pending across future sessions. Keep this in sync as decisions land.

### 1. Save-rule enforcement (must happen before MVP ships)

**Why.** Comment saves currently merge via ancestor traversal: if the new comment's ancestor chain contains an already-saved comment, the save attaches to that Woohoo. This conflates cross-peer threads (Peer B replying inside Peer A's saved thread ends up in Peer A's Woohoo) and forces the extension to expose a checkbox so the user can override the merge. Neither is right. Rules below make routing deterministic and let us kill the checkbox.

**The rules** (server-side, authoritative):

1. **Peer-authored comments** (author is not the founder):
   - Always save to that peer's own Woohoo, keyed by `(platform, authorId)`.
   - Create the Woohoo for that peer on the fly if one doesn't already exist.
   - Ancestor chain is ignored — even if this comment is a reply inside another already-saved peer's thread, it belongs to its own author's Woohoo, not the parent thread's Woohoo. This is the behavior change from today.

2. **Founder-authored comments** (author is the logged-in founder):
   - Walk the ancestor chain for a peer-authored comment.
   - If one exists anywhere in the ancestry → attach this founder comment to that peer's Woohoo. (Supports "save my reply to a lead's thread.")
   - If no peer ancestor exists → **reject the save.** Founders don't get their own Woohoo, and standalone top-level founder comments aren't captured anywhere.

3. **SaveModal checkbox** (extension): **remove.** Under rules 1 and 2 the destination is deterministic. The modal still shows the user *where* it will land (peer handle + Woohoo it's attaching to), but the user doesn't steer it.

**Open sub-decision: how does the extension know which Reddit username is the founder?**
- Option A — **scrape from the Reddit page DOM** (account dropdown / `<faceplate-tracker>` near the top-right). Zero-config; breaks if Reddit changes markup.
- Option B — **ask the user once** in the extension popup and store in `chrome.storage.local`. Robust; costs a first-run step.
- Option C (recommended) — **hybrid:** auto-detect from DOM, cache, allow edit in popup. Zero-config happy path with a manual override.

**Touches:**
- `web/app/api/woohoos/.../save/route.ts` (exact path TBD) — server is the source of truth for routing. Reads author identity, peer identity, and ancestor chain from the payload; applies rules 1–2; returns the target Woohoo (or 4xx for the founder-no-peer-ancestor reject).
- `ext/src/content/reddit/comment.ts` — traversal simplifies. No more "find saved ancestor to merge into." Instead: classify author (founder vs peer), and (only for founders) collect ancestor peer-authored comment IDs so the server can locate the target Woohoo.
- `ext/src/components/SaveModal.tsx` — drop the checkbox. Update the "saving to" label to reflect the deterministic destination. Surface the reject case ("You can only save your reply when it's inside a lead's thread.") cleanly — disabled save or pre-submit warning, don't fail silently.
- `ext/src/popup/*` (or new settings surface) — founder-username config with auto-detect + manual override.
- `web/prisma/schema.prisma` — no schema change required for the rules themselves.

**Verification:**
- Peer A's comment saved → lands in Peer A's Woohoo. ✓
- Founder's reply to Peer A's comment → attaches to Peer A's Woohoo. ✓
- Founder's standalone top-level comment save attempted → rejected with explanatory UX. ✓
- Peer B's reply inside Peer A's already-saved thread → lands in Peer B's (newly-created) Woohoo, not Peer A's. ✓ (behavior change)
- Checkbox removed from SaveModal. ✓
- Founder-username auto-detect works on a fresh install; manual override via popup also works.

### 2. Comment threading (post-MVP)

Add `parentTimelineItemId String?` to `TimelineItem`, migrate, update the extension payload to capture it during ancestor traversal, render the Comments tab as an indented tree. MVP renders flat chronological.

### 3. Extension session (content modals + popup)

From feedback overview below:
- **Dark/light theme match.** Light modals on dark Reddit read as third-party popups. Detect `prefers-color-scheme` + Reddit's theme class; match.
- **"Saved" toast placement.** Currently covers the message it confirms. Move to bottom-right of the chat pane, auto-dismiss ~2s.
- **Popup is unbranded.** Add a small stats line ("12 woohoos · 3 to follow up today") and an "Open dashboard" button. Currently only offers sign-out.
- **Datetime picker swap.** Replace the extension's native `<input type="datetime-local">` with the `DateTimePicker` composite. The picker is now dependency-free (after the polish-pass rewrite it no longer pulls `react-day-picker` or `date-fns` — all views hand-rolled). Lift from `web/components/` into `@woohoo/ui` at that time; the cost argument is gone.

### 4. Cross-cutting polish session

From feedback overview below:
- **Typography hierarchy.** Headings heavier, metadata lighter/smaller, tighter letter-spacing on the wordmark.
- **Brand color.** Coral `woohoo` mark appears only on the logo + follow-up dates. Add one more intentional use — Save CTA accent, active nav pill, or subtle card glow on "Today" items.
- **Empty-state illustrations.** Replace text-only "Everything looks warm. Keep it up." with a small icon or illustration.

### 5. Smaller deferred items

- **Per-author message grouping** in the Messages tab: show the peer avatar once per author run (iMessage/Slack style) rather than invisible on every bubble.
- **`peerName` display.** Schema already has `peerName`; we fall back to `peerId` for the header initial. When `peerName` is populated, consider rendering it alongside the handle in the detail header.
- **Legacy `@woohoo/ui` vs `web/components/ui/` duplication** for `button` and `input`. Clean up once the shared version is strictly better. Flagged in CLAUDE.md.
- **Remove unused shadcn `Calendar` primitive** from `packages/ui/src/components/calendar.tsx`. No longer consumed after `DateTimePicker` rewrite; `react-day-picker` + the calendar re-export can be dropped.
- **Tailwind v4 arbitrary-var audit** across `packages/ui`. `dropdown-menu.tsx` and `popover.tsx` still use v3-era `origin-[--radix-...-transform-origin]` syntax. Harmless for layout (only animation origin affected) but the same bug class as the calendar's `[--cell-size]` that collapsed the date grid. Convert to `(--...)` form.
- **"View original" link in `ChatBubble`** is still hover-gated (`opacity-0 group-hover:opacity-100`). Delete buttons were un-gated in the polish pass for touch-device reasons; this one was left alone but has the same argument.

---

## Full feedback overview (reference — do not delete)

### Sidebar (biggest gap vs Vercel/Resend)
- **Missing user identity.** Both Vercel and Resend anchor the sidebar with a user/workspace pill at top and an account row at bottom. Ours has neither — the sidebar feels "logged out." Move the signed-in email + avatar to the bottom; kill the standalone "Sign out" row (bury it in a menu).
- **Too empty.** Two items floating in a wall of black looks unfinished. Either shrink the sidebar width and drop icons-only (like a tool palette), or add a section label ("Workspace") and a search/quick-find (⌘K) — Vercel's `F`-key affordance is a cheap way to feel professional.
- **Theme toggle as a nav row is loud.** Demote to a small icon button next to the account row.

### Dashboard
- **No "hero" signal.** Before the three columns, show a single line: "3 to follow up today · 2 overdue · 8 active." Gives the page a purpose-at-a-glance. Right now the first thing the eye finds is a column header, not an answer.
- **Cards feel flat.** Add a platform glyph (Reddit snoo) as a small badge, a "3 messages" count, and an avatar placeholder. Overdue card could tint the border/left-edge red instead of just red text — more scannable.
- **Layout wastes space.** At desktop width, three vertical columns of 1-2 cards look sparse. Consider a 2-up grid with "Today" + "Overdue" side-by-side above, "Going cold" below full-width.

### Woohoo detail
- **Header card is weak.** Big peer avatar (48-64px), name, platform badge, last-interaction-summary as a secondary line. Right now "Created April 18, 2026" is the loudest non-username element — it's the least useful info.
- **Native datetime picker has to go.** The single thing making the product look unfinished. Swap for shadcn's `<Calendar>` + time inputs. Same in the extension.
- **Timeline is doing too much with too little.** Chat-bubble style mixes with comment-style rows awkwardly — OP's own replies are bubbles but saved comments are plain. Pick one lane: treat everything as a timeline event (avatar + content card) or commit to a chat transcript and style comments as quoted cards inline.

### Extension
- **Light modals on dark Reddit is the biggest visual issue.** Beige dialogs read as "third-party popup" — follow Reddit's theme (detect `prefers-color-scheme` or Reddit's own theme class). That alone will make saves feel native.
- **"Saved" toast covers the message you just saved.** Move to bottom-right of the chat pane, auto-dismiss in 2s.
- **Popup is unbranded.** Add a tiny stats row ("12 woohoos · 3 to follow up today") and a "Open dashboard" button — right now it only does sign-out, which users rarely want.

### Cross-cutting polish
- **Typography hierarchy is too uniform.** Headings, metadata, body text all feel similar weight. Push headings heavier, metadata lighter/smaller, tighten letter-spacing on the wordmark.
- **Brand color is underused.** The coral `woohoo` mark is great but only appears as logo + follow-up dates. Use it sparingly for one more thing — Save CTA accent, active nav pill, or subtle card glow on "Today" items.
- **Empty states are text-only.** "Everything looks warm. Keep it up." would sing with a small illustration or icon above it.

---

## Previous session: Dashboard

### What shipped
- **Hero stats strip** at top of `web/app/(app)/dashboard/page.tsx`: `N to follow up today · M overdue · K going cold`, with overdue bolded in `text-destructive` when > 0. Falls back to "All caught up" when everything is zero.
- **2×2 desktop layout:** `grid grid-cols-2 gap-8` for Today (left) + Overdue (right) on top row; Going cold full-width below. Mobile stays single-column stacked (overdue first since most urgent).
- **WoohooCard polish** (shared by dashboard + My Woohoos):
  - Initials avatar (`@woohoo/ui` `Avatar` + `AvatarFallback`) — strips `u/` or `@` prefix, uppercases first char.
  - Explicit counts by type: `2 DMs · 4 comments · Saved 3h ago` (each part only renders when > 0). Pulled from a shared helper `lib/timeline-counts.ts` that does one `prisma.timelineItem.groupBy({ by: ['woohooId', 'type'] })` per page load.
  - `variant="overdue"` prop: `border-l-4 border-l-destructive/80` on the card and `text-destructive` on the follow-up date (replaces "Follow up" prefix with "Overdue").
  - Hover state: `hover:border-border/80 hover:bg-accent/30` (subtle lift, not flashy).
- **Prisma queries** in `dashboard/page.tsx` and `my-woohoos/page.tsx` now include `_count: { select: { timeline: true } }`.

### Relevant files touched
- `web/app/(app)/dashboard/page.tsx` — hero strip, 2×2 layout, overdue variant wired on the Overdue section only.
- `web/app/(app)/my-woohoos/WoohooCard.tsx` — avatar, message count, overdue variant, hover polish.
- `web/app/(app)/my-woohoos/page.tsx` — added `_count` to query.

### Deferred to later sessions
- Coral brand accent on "Today" cards (cross-cutting polish session).
- Empty-state illustrations (cross-cutting polish session).
- Woohoo detail header + timeline — next session.

---

## Previous session: Sidebar

### Direction (locked with user)
- **Vercel-style full sidebar:** wordmark top, nav middle, account row anchored at bottom. Theme toggle demoted to a menu item or small icon inside the account row.
- **⌘K quick-find:** deferred to a later session.

### Monorepo convention (locked)
- `packages/ui` (`@woohoo/ui`) — shared, reusable shadcn primitives. `components.json` lives here; `npx shadcn@latest add` is run **from this directory**. Currently contains: button, card, input, label, alert-dialog.
- `web/components/ui/` — app-specific shadcn primitives that won't be reused (sidebar, sheet, separator, skeleton, tooltip). Imported via `@/components/ui/*`.
- `packages/api` (`@woohoo/api`) — shared API client + types, used by web and ext.
- Rule of thumb: new generic primitives → `packages/ui`. App-coupled/layout-y primitives → `web/components/ui`.
- Legacy note: button + input exist in both locations. Don't clean up as part of this session.

### Relevant files (from exploration)
- `web/app/(app)/layout.tsx:19` — wires `SidebarProvider` + `Sidebar` (`collapsible="icon"`) with cookie-persisted state. Renders header (wordmark), `AppNav`, `SidebarRail`, `AppSidebarFooter`.
- `web/app/(app)/AppNav.tsx:13` — hardcoded `navItems` array, uses `usePathname()` for active state, composes `SidebarMenuButton asChild` + Next.js `Link`.
- `web/app/(app)/AppSidebarFooter.tsx` — current "theme toggle" + "sign out" rows. Main edit target.
- `web/app/(app)/ThemeToggle.tsx` — `next-themes` `useTheme()`; renders as `SidebarMenuButton`. Logic folds into dropdown; file gets deleted.
- `web/lib/auth-client.ts` — `authClient.signOut()`.
- `web/lib/get-session.ts` — server helper for session (name, email, image).
- `web/components/ui/sidebar.tsx` — shadcn sidebar primitive (stays here; app-specific).
- `packages/ui/src/components/` — destination for new shared primitives.
- `packages/ui/src/index.ts` — must add re-exports for new primitives.

### Primitives to install
- `avatar` → into `packages/ui` (generic, reusable).
- `dropdown-menu` → into `packages/ui` (generic, reusable).

Install: `cd packages/ui && npx shadcn@latest add avatar dropdown-menu`. This writes to `packages/ui/src/components/avatar.tsx` and `packages/ui/src/components/dropdown-menu.tsx`, updates `packages/ui/package.json` with `@radix-ui/react-avatar` + `@radix-ui/react-dropdown-menu`, and requires adding re-exports in `packages/ui/src/index.ts`. Consumer `AppSidebarFooter.tsx` imports via `import { Avatar, AvatarImage, AvatarFallback, DropdownMenu, ... } from "@woohoo/ui";`.

### Implementation plan

**0. Update CLAUDE.md.**
Add a short "Monorepo layout" / "UI components" section documenting:
- The monorepo has `web/`, `ext/`, `packages/ui` (`@woohoo/ui`), `packages/api` (`@woohoo/api`).
- New reusable shadcn primitives go in `packages/ui`. Run `npx shadcn@latest add <component>` from `packages/ui` (where `components.json` lives). Re-export from `packages/ui/src/index.ts`.
- App-specific primitives (sidebar, sheet, skeleton, separator, tooltip) live in `web/components/ui/` and are imported via `@/components/ui/*`.
- Legacy duplication of button/input in both locations is known; don't treat as a bug.

**1. Fetch session for the footer.**
- In `web/app/(app)/layout.tsx`, call `getSession()` (already available) and pass `session.user` (name, email, image) as a prop into `<AppSidebarFooter user={...} />`. Layout is already a server component.

**2. Rewrite `AppSidebarFooter.tsx`.**
- Imports for `Avatar`, `AvatarImage`, `AvatarFallback`, `DropdownMenu`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuTrigger` all come from `@woohoo/ui`. `SidebarFooter`, `SidebarMenu`, `SidebarMenuButton`, `SidebarMenuItem` stay on `@/components/ui/sidebar`.
- Remove both existing `SidebarMenuButton` rows (theme toggle + sign out as nav rows).
- Replace with a single `SidebarMenuButton size="lg"` that acts as a `DropdownMenu` trigger, composed via `asChild`. Content inside the trigger:
  - `<Avatar className="h-6 w-6">` with `AvatarImage src={user.image}` + `AvatarFallback>{initials}</AvatarFallback>`.
  - Two-line text block: bold name (truncate), muted email (truncate). Hide entire text block when sidebar is in icon-collapsed state — use the `group-data-[collapsible=icon]:hidden` pattern that shadcn uses elsewhere in `sidebar.tsx`, or rely on `SidebarMenuButton`'s existing hide-text behavior.
  - Trailing `ChevronsUpDown` icon (from `lucide-react`), also hidden in collapsed mode.
  - Add `tooltip={user.email}` on the button so the collapsed state shows identity on hover.
- `DropdownMenuContent` (side="right", align="end" when expanded; side="right", align="start" when mobile — shadcn docs have the canonical pattern):
  - `DropdownMenuLabel` with name + email stacked.
  - `DropdownMenuSeparator`.
  - `DropdownMenuItem` — Theme toggle. Reuse logic from `ThemeToggle.tsx`: `useTheme()`, toggle between dark/light, icon + label switches.
  - `DropdownMenuSeparator`.
  - `DropdownMenuItem` — Sign out. Keep existing `authClient.signOut()` + `router.push("/sign-in")` flow.
- Delete `ThemeToggle.tsx` (logic folds into the dropdown item). If `ThemeToggle` is imported elsewhere, search first — current usage is only in `AppSidebarFooter`.

**3. Polish the header.**
- `web/app/(app)/layout.tsx` header currently shows the wordmark full-size in expanded mode, "W" mark in collapsed. Leave the logic but tighten:
  - Verify the wordmark has consistent padding matching the nav items (left-align with nav icons).
  - Ensure the "W" mark in collapsed mode centers correctly at the reduced width.
- No workspace switcher needed (single-user app). Do not replicate Vercel's top account pill — the account lives at the bottom only to avoid redundancy.

**4. Sidebar rail / width.**
- Keep existing width default from shadcn (16rem expanded / 3rem icon). Do not tune width in this pass.

### Out of scope this session
- ⌘K command palette (deferred).
- Collapsed-rail behavioral tweaks beyond what shadcn already supports.
- Workspace/team switcher at top.
- Header page-title component (lives in `AppHeader` — untouched).
- Dashboard, detail view, extension, cross-cutting polish — separate sessions.

### Verification
1. `cd web && npm run dev` and sign in.
2. Expanded sidebar: account row at bottom shows avatar (image or initials fallback), name, email truncated, chevron icon. Looks anchored like Vercel/Resend.
3. Click account row → dropdown opens with name/email header, theme toggle, sign out.
4. Theme toggle flips dark/light. Label + icon update. Dropdown stays open or closes per shadcn default (document whichever happens — don't over-engineer).
5. Sign out → lands on `/sign-in`.
6. Toggle sidebar to icon mode (⌘/Ctrl+B). Account row collapses to just the avatar; tooltip on hover shows email. Dropdown still opens on click.
7. Mobile: sidebar opens as Sheet; account row + dropdown still work. Dropdown should position sensibly (may need `align`/`side` tweaks — verify).
8. `npm run lint` clean.

---

## Previous session: Woohoo detail

### What shipped
- **Header redesign** (`web/app/(app)/my-woohoos/[id]/page.tsx`): 48px peer Avatar (`@woohoo/ui`) with initial of `peerName ?? peerId`, platform icon + peer handle + external-link-to-Reddit as the title, meta line `N DMs · M comments · Last interaction 2h ago · Open chat`. Created-date dropped from the visible layout. External-link icon on the handle demoted to hover-only. Follow-up control sits directly below the meta line.
- **`DateTimePicker` composite** (`web/components/DateTimePicker.tsx`): trigger `Button` with `CalendarIcon` + formatted value / "Set follow-up" placeholder, `Popover` content containing shadcn `Calendar` (single mode) + native `<input type="time">` + Clear/Done footer. Internal state is `Date | null`, single source of truth. Date + time reconstructed via `new Date(y,m,d,h,m)` in local tz then serialized with `.toISOString()` by the caller. Stable `defaultMonth` via `useState(() => new Date())` to avoid hydration mismatches.
- **`FollowUpEditor` rewrite**: thin wrapper — optimistic `setCurrent(next)` + PATCH `/api/woohoos/[id]`, revert on failure. No more pencil/check/cancel edit-mode chrome.
- **Tabs** (`@woohoo/ui` re-exports from shadcn `tabs`): Messages | Comments with item-count suffix. `defaultTab` opens Comments only when DMs are empty and comments exist; otherwise Messages. Server-side partition of `woohoo.timeline` into `dms` + `comments` arrays.
- **`CommentCard` rewrite** (`web/app/(app)/my-woohoos/[id]/CommentCard.tsx`): compact bordered card, full width within the content column. New `isFromPeer` prop. Peer variant: header `r/subreddit · timeAgo`. OP variant: left-edge `border-l-2 border-l-primary/60` + "You replied · r/subreddit · timeAgo" header. Body, then "View on Reddit →" footer (right-aligned, always visible). Delete button floats top-right, hover-revealed. Tree-line + per-comment avatar removed.
- **Day-divider lift** in the Messages view: divider sibling to the `ChatBubble`, not nested inside its per-item flex column. Prevents future alignment inheritance issues.
- **Empty states**: each tab has a short muted sentence pointing the founder at the extension as the capture path.
- `ChatBubble` untouched functionally; styling was already consistent with the new comment card.
- `peerInitial`, `countsLabel`, `timeAgo` exported from `WoohooCard.tsx` for reuse in the detail page.

### Primitives added
- `packages/ui/src/components/tabs.tsx`, `popover.tsx`, `calendar.tsx` (all via `cd packages/ui && npx shadcn@latest add`). Re-exported from `packages/ui/src/index.ts`. Deps added to `packages/ui/package.json`: `@radix-ui/react-tabs`, `@radix-ui/react-popover`, `react-day-picker`, `date-fns`. Calendar's default shadcn imports used `@woohoo/ui/components/button` which isn't an export subpath — switched to relative imports to match the rest of the package.

### Scope deliberately deferred
- **Save-rule enforcement.** Locked with user: peer-authored comments save to that peer's Woohoo; OP-authored comments attach to the nearest peer-rooted parent, else blocked; third-party comments route to their own Woohoo (create if needed). Extension's SaveModal checkbox becomes irrelevant and should be removed. Touches `web/app/api/woohoos/...` and `ext/src/content/reddit/comment.ts` + `ext/src/components/SaveModal.tsx`. Owns its own session before MVP ships.
- Comment threading (`parentTimelineItemId` + tree rendering in the Comments tab). Renders flat chronological today; tree is a follow-up.
- `DateTimePicker` composite living in `web/components/` rather than `@woohoo/ui` — bundle-weight decision pending the extension session. Lift when the extension actually reuses it.

### Verification
1. `make dev` (web + db). Sign in.
2. Open a Woohoo with mixed DMs + comments. Expected: 48px avatar with initial left of the name; meta reads "N DMs · M comments · Last interaction Xh ago · Open chat"; no created-date visible.
3. Click the follow-up picker button → Popover opens with Calendar + time input. Pick date+time → Done closes, trigger shows formatted value. Refresh persists. Open again → Clear → goes null.
4. Tabs: both visible with counts. Default opens Messages. If Woohoo has only comments, default opens Comments. Switching tabs is instant.
5. Messages tab: bubbles unchanged (peer left, OP right). Day dividers render.
6. Comments tab: bordered cards; peer comments show `r/subreddit · timeAgo`; OP comments (if any) show primary left-edge + "You replied"; hover reveals delete top-right.
7. Edge cases: comments-only Woohoo opens Comments by default; DMs-only Woohoo has empty Comments tab showing empty-state copy; long comment bodies wrap cleanly.
8. Dark/light theme: both tabs read well.
9. `cd web && npx tsc --noEmit` clean (verified).
10. `cd web && npm run lint`: pre-existing `Math.random` error in `web/components/ui/sidebar.tsx:665` from shadcn primitive — unrelated to this session. No new lint errors introduced.

---

## Previous session: Woohoo detail — polish pass

Follow-on to the Woohoo detail session. Triggered by user feedback on the date picker, a "last interaction" bug, and a touch-device concern on the delete affordance.

### What shipped

- **Calendar primitive fix** (`packages/ui/src/components/calendar.tsx`). The date grid was collapsing 2-digit days into an unreadable smear. Root cause: shadcn's `calendar.tsx` was copied from a Tailwind v3-era source and used `[--cell-size]` arbitrary-value syntax everywhere. Under Tailwind v4 that no longer auto-wraps in `var()` — it's treated as the literal string `--cell-size`, which evaluates to invalid CSS and silently collapses widths to min-content. Converted all six sites to v4's `(--cell-size)` parentheses form. (See the "Tailwind v4 arbitrary-var audit" bullet in Deferred for follow-ups on `dropdown-menu.tsx` / `popover.tsx`.)

- **`DateTimePicker` rebuilt from scratch** (`web/components/DateTimePicker.tsx`). User wanted: clickable month/year in the header to switch views, a Today shortcut, a non-native time input, and a trigger button that doesn't jitter when the value changes. Rewrite removes `react-day-picker` + `date-fns` as dependencies — the picker is now self-contained.
  - Three views, swapped via local `view: "day" | "month" | "year"` state. Day view = 7×6 grid built from `new Date(year, month, 1 - startWeekday + i)`. Month view = 3×4 grid of short month names. Year view = scrollable grid (current year ±60/+20), auto-scrolls the selected year into view on mount.
  - Navigation: day-view header exposes month name and year as separate clickable `HeaderButton`s; clicking month → month view, clicking year → year view. Month view's year label also opens year view. Picking a year returns to month view, picking a month returns to day view (Apple Calendar pattern).
  - Custom `TimeField` component: text input with `inputMode="numeric"`, arrow-key increment/decrement, Enter-to-commit, focus-scoped edit buffer so external value changes (e.g., AM/PM toggle) flow through without an effect. AM/PM is a separate toggle button next to the fields.
  - Trigger button: `font-mono` + zero-padded everything (`Apr 05, 09:00 AM`) to prevent width reflow between single- and double-digit hour/day values. Mono only applied when a value is set; placeholder uses the default proportional font.
  - Today + Clear grouped in the footer left, Done on the right.
  - `handleOpenChange` resets view + viewMonth when the popover opens — moved out of a `useEffect` to satisfy the `react-hooks/set-state-in-effect` lint rule.

- **`FollowUpEditor` flicker fix** (`web/app/(app)/my-woohoos/[id]/FollowUpEditor.tsx`). Dropped the `saving` state and the `disabled={saving}` prop. The shadcn Button's `disabled:opacity-50` → full-opacity transition was visible as a flash on every date change. Now saves optimistically: `setCurrent(next)` first, fire-and-await the PATCH, revert on failure. (Recorded as a durable feedback memory — see `feedback_optimistic_saves.md`.)

- **`lastInteractionAt` correctness** (`web/app/api/woohoos/save/route.ts`, `web/app/api/timeline-items/[id]/route.ts`). The detail header was showing "Last interaction 19d ago" on a Woohoo whose newest saved message was 4 days old. Root cause: save route unconditionally overwrote `lastInteractionAt` with the just-saved item's `interactionAt`. Saving an older message after a newer one moved the timestamp backwards.
  - Save route: stopped writing `lastInteractionAt` in the ancestor-match update branch and the upsert's update branch. After `timelineItem.create`, runs `prisma.timelineItem.aggregate({ _max: { interactionAt } })` scoped to the woohoo and writes that. The upsert `create` branch still seeds with `interactionAt` since a brand-new woohoo has no existing items.
  - Delete route: switched from `deleteMany` to `findFirst + delete` so we know which `woohooId` to recompute. Same aggregate-max pattern after delete; handles both "deleted the newest item" and "deleted the only item" (falls back to `null`).
  - **Backfill applied to local DB**: ran the same `MAX(interactionAt)` update as a one-shot SQL against `woohoo_db` — 6 rows corrected. Any other environment (prod, teammates' local) will need the same backfill.

- **Always-visible delete buttons** on timeline items (`ChatBubble.tsx`, `CommentCard.tsx`). Were previously gated by `opacity-0 group-hover:opacity-100` which means touch users can't reach them. Removed the gating wrappers. Matches the header's always-visible Woohoo-delete affordance.

### Files touched
- `packages/ui/src/components/calendar.tsx` — Tailwind v4 syntax fix. (Component itself is now unused; see Deferred.)
- `web/components/DateTimePicker.tsx` — full rewrite. ~450 lines, one file.
- `web/app/(app)/my-woohoos/[id]/FollowUpEditor.tsx` — simplified, dropped `saving`.
- `web/app/api/woohoos/save/route.ts` — aggregate-max recompute; dropped `lastInteractionAt` from update branches.
- `web/app/api/timeline-items/[id]/route.ts` — aggregate-max recompute; `findFirst + delete` instead of `deleteMany`.
- `web/app/(app)/my-woohoos/[id]/ChatBubble.tsx` — dropped delete-button opacity wrapper.
- `web/app/(app)/my-woohoos/[id]/CommentCard.tsx` — dropped delete-button opacity wrapper.

### Scope deliberately deferred
- Removing the now-unused `Calendar` primitive from `packages/ui` (and its `react-day-picker` dep). Listed in "Smaller deferred items."
- Tailwind v4 syntax audit on `dropdown-menu.tsx` / `popover.tsx`. Listed in "Smaller deferred items."
- `ChatBubble`'s "View original" link still hover-gated. Not touched because the user's ask was scoped to the delete button. Listed in "Smaller deferred items."
- Lifting `DateTimePicker` into `@woohoo/ui`. Still waiting on the extension session as the trigger (noted in extension deferred section, updated to reflect the picker is now dep-free).

### Verification
1. `cd web && npx tsc --noEmit` — clean.
2. `cd web && npx eslint <touched files>` — clean (the old `react-hooks/set-state-in-effect` errors are gone after the `onOpenChange` + focus-buffer restructure).
3. Open any Woohoo, click the follow-up button. Calendar renders with properly spaced days (no more jammed 2-digit columns). Click the month name → month grid. Click year → scrollable year list, selected year centered.
4. Pick a date — trigger button updates without a flicker or opacity flash. Width stays constant between `9:00 AM` and `10:00 AM`, and between `Apr 5` and `Apr 15`, thanks to mono + zero-padding.
5. Type in the hour/minute fields, use arrow keys. Toggle AM/PM. Click Today → snaps to current date. Click Clear → follow-up goes null.
6. Save a message in the extension, then save an older message on the same Woohoo. Refresh the detail page — "Last interaction" reflects the newer of the two, regardless of save order.
7. Delete a timeline item. `lastInteractionAt` updates to the max of what's left (or disappears if timeline is empty).
8. On a phone/tablet (or with devtools mobile emulation): delete buttons visible on every message and comment without hovering.

### Post-session housekeeping
- Memory saved: `project_tailwind_v4_syntax.md` (v4 `(--var)` rule + latent issues in other shadcn primitives), `feedback_optimistic_saves.md` (don't toggle `disabled={saving}` on short autosaves).
- **No commits yet.** Seven files changed; suggested split: (1) calendar Tailwind v4 fix, (2) DateTimePicker rewrite + FollowUpEditor simplification, (3) `lastInteractionAt` correctness (save + delete routes), (4) always-visible delete buttons.
