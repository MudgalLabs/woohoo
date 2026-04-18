# Woohoo MVP Visual Polish — Multi-Session Feedback Overview

## Context

Reviewed the current MVP surfaces (dashboard, My Woohoos detail view, sidebar, extension content + popup) against references (Vercel and Resend sidebars). Goal: make the MVP look "sexy AF" before shipping. Rather than attempting all polish in one pass, we're saving the full feedback below as a durable reference and then tackling one surface per session so we can go deep on each.

**Workflow:** Each session, reload this file → pick the next section → move that section from "Pending" to "In progress" → implement → mark "Done" → repeat.

---

## Session tracker

- [x] Sidebar — account row with dropdown (avatar, theme toggle, sign out); ThemeToggle.tsx deleted; monorepo convention documented in CLAUDE.md.
- [ ] **Dashboard** — next
- [ ] Woohoo detail
- [ ] Extension (content modals + popup)
- [ ] Cross-cutting polish (typography, brand color, empty states)

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

## Current session: Sidebar

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
