# Woohoo — Launch TODO

Live list of what still needs to happen to call v1 shipped, and the ordered roadmap after.

---

## 1. Pre-launch blockers (won't ship without these)

- [x] **Publish Chrome Web Store listing.** Submitted — awaiting review.
- [x] **Publish Firefox AMO listing.** Submitted — awaiting review.
- [ ] **Replace `href="#"` on `/extension` page** (`web/app/(marketing)/extension/page.tsx:43-50`) with real Chrome Web Store + Firefox AMO URLs once both approvals land.
- [ ] **Seed `Plan` rows in prod DB** (`free` + `pro`). Without the Free row the `databaseHooks.user.create.after` in `lib/auth.ts` silently no-ops for new signups — `getUserPlan()` fallback keeps them working but `Subscription` rows will be missing when Pro goes live.
- [ ] **Verify prod env vars.** `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=https://woohoo.to`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Confirm the Hetzner VPS deploy is on the current build (trigger `.github/workflows/deploy.yml` or SSH + `docker compose up -d`).
- [ ] **Verify Firefox build works end-to-end.** `npm run build:firefox` → load `ext/dist/` as a temporary add-on → save a DM and a comment. MV3 on Firefox has quirks around service workers.
- [ ] **Smoke test on a brand-new Google account.**
  1. Sign in via `/auth` → land on empty dashboard (`NoWoohoosYet`)
  2. Install extension → sign in from popup → tab should auto-close on success
  3. Save a peer DM in a Reddit chat
  4. Save a peer-authored comment on a post
  5. Reply to that comment as the founder → save your own reply → confirm it merges into the peer's Woohoo as a 1-level-nested child
  6. Set a follow-up for today → appears under **Today** on the dashboard
  7. Set one for yesterday → appears under **Overdue**
  8. Archive a Woohoo → falls out of active list, does not count toward limit
  9. Unarchive → counts again; if at 100/100, blocks with plan-limit 403
  10. Delete a Woohoo and a single timeline item — both cascade correctly

## 2. Paddle approval & payments setup (start now — async)

Paddle is our merchant of record (replaces the Stripe plan from an earlier draft of this doc — Paddle handles VAT/GST and is friendlier to solo Indian founders). **Domain approval takes Paddle several business days**, so submit early and do the rest in parallel.

Paddle's website requirements: the site must link to or contain **terms of service, privacy policy, and refund policy**. Subdomains aren't approved by default — if we ever want checkout on `app.woohoo.to`, that's a separate submission.

- [ ] **Submit `woohoo.to` for Paddle domain approval.** Do this first so the clock starts. Use the Paddle sandbox seller dashboard.
- [ ] **Add `/terms` page** on the marketing site (Paddle requirement).
- [ ] **Add `/refund` page** on the marketing site (Paddle requirement).
- [ ] **Link Terms, Privacy, Refund from the footer** on every marketing page (Paddle checks this).
- [ ] **Update `/privacy`** to list Paddle (not Stripe) as the payments sub-processor.
- [ ] **Wire up Paddle checkout** once approved. Replace the mailto on Pricing section + `/settings/plan` upgrade button with a Paddle overlay/inline checkout for the Pro plan.
- [ ] **Paddle webhook route** (`POST /api/webhooks/paddle`) that upserts `Subscription.status` from `subscription.created | updated | canceled | past_due` events. Verify signatures with the Paddle webhook secret.
- [ ] **`SubscriptionEvent` append-only log.** Add alongside the Paddle webhook handler — every webhook event writes one row (`userId`, `type`, `fromTier`, `toTier`, `fromStatus`, `toStatus`, `paddleEventId`, `occurredAt`, raw payload `jsonb`). Gives us audit trail, churn/upgrade analytics, and debugging ("when did this user become Pro?") without round-tripping to Paddle. Keep `Subscription` as the single mutable "current state" row; don't switch to latest-row-wins.
- [ ] **Dunning:** `past_due` status should block unarchive/new-save with a friendly "update card" message, same 403 shape as `plan_limit_reached`.
- [ ] **Customer portal link** from `/settings/plan` so users can manage card + cancel via Paddle's hosted page.
- [ ] **Decide monthly vs. annual pricing.** The landing already advertises `$50/yr` — one Paddle product or two price IDs?

## 3. Launch polish (soft blockers — noticeable if missed)

- [ ] **Plan-limit error UX.** Extension `SaveModal.tsx:266-269` shows a blocking paragraph but no action. Add a link/button to `/my-woohoos?view=archived` so the user can free up a slot without leaving the flow.
- [ ] **Save modal — network failure state.** `handleSave` currently shows `result.error` but doesn't distinguish offline/timeout from server errors. Cheap to improve.
- [ ] **Founder username UX.** Popup shows the Reddit username field as an override, but nothing signals to the user *why* it matters. One-line hint: "Only used to detect when you reply inside a saved thread."
- [ ] **Marketing mobile pass.** Spot-check Hero, Pricing, Dashboard sections at ~375px. The dashboard demo especially is dense on small screens.
- [ ] **Verify OG image generation** on all marketing pages post-deploy (OG images are generated at build time per recent commit `b2864db`).

## 4. Post-launch — ordered roadmap

### v1.1 — Platform expansion (the 90% of your audience)

Both X and LinkedIn are pure additions — extend the `Platform` enum, add content scripts, reuse the entire save/routing/dashboard stack unchanged. Per-platform checklist:

- Add enum value + migration (`Platform.x`, `Platform.linkedin`)
- Content script: `ext/src/content/<platform>/dm.ts` + `comment.ts` + `founder.ts`
- `peerHandle` / `peerProfileUrl` / `PlatformIcon` branches in `web/components/PlatformIcon.tsx`
- Manifest: add `matches` + `host_permissions` (browser will prompt user — expected)
- Update privacy policy (extension permissions section lists supported platforms)
- Update FAQ + pricing + `/extension` page copy
- Store listing update (new screenshots, new permission justification)

**X / Twitter**
- Comment surface = tweet replies (conversation tree). Ancestor IDs are tweet status IDs — cleanly scrape-able from DOM.
- DM surface = `/messages/<conv_id>`. Separate from feed.
- `peerId` = handle (without `@`). Stable enough for MVP.
- Open chat URL = `https://x.com/messages/<conv_id>`.
- Watch for: X's DOM is heavily minified and reshuffles; prefer ARIA/role selectors over class names. Also `twitter.com` and `x.com` both serve — add both to host matches.
- Founder identity: available from `/i/api/1.1/account/verify_credentials.json` (needs cookie auth) or scraped from the sidebar profile link. Match Reddit's strategy (API first, DOM fallback).

**LinkedIn**
- Comment surface = post comments on feed posts, articles, and Pulse. Comments do nest (replies), so ancestor walking works.
- DM surface = `/messaging/thread/<urn>`.
- `peerId` = LinkedIn URN (`urn:li:fsd_profile:xxx`). URNs are stable; vanity slugs are not — use the URN.
- Open chat URL = `https://linkedin.com/messaging/thread/<urn>`.
- Watch for: LinkedIn injects extra modals for "sales-restricted" / "premium" gates; save button must handle being hidden/unhidden gracefully. Also LinkedIn has been aggressive about DOM-based extensions historically — keep the footprint small.
- Founder identity: fetch `/voyager/api/me` (cookie-auth JSON) or scrape the "Me" menu.

### v1.2 — Pricing → revenue

The heavy lifting (Paddle domain approval, checkout, webhooks, dunning, customer portal) is tracked in §2. Post-launch, v1.2 is mainly about optimising the flow:

- [ ] Upgrade nudges in-app (plan-limit 403s should deep-link to Paddle checkout, not `mailto:`).
- [ ] Annual-vs-monthly toggle on `/settings/plan` (one-click switch).
- [ ] Receipts / invoices surfaced in `/settings/plan` (Paddle hosts these — just deep-link).

### v1.3 — Deliver the Pro promise

- [ ] **Daily follow-up digest** (morning + evening email). Pro-only. Promised on the Pricing section (`sections/Pricing.tsx`).
- [ ] Email infra: Resend for v1 (swap to Bodhveda email channel post-launch). Sender runs from a separate Node cron service on the VPS; see plan in `.claude/plans/`.
- [ ] Unsubscribe + per-user cadence preference (morning-only, evening-only, both).

### v1.4 — Power user quality-of-life

- [ ] Per-Woohoo private **notes** (one text field on the detail page; bumps `Woohoo.updatedAt`).
- [ ] Per-Woohoo **tags** (free-form; for "warm lead" / "feedback" / "partnership" labeling).
- [ ] **Search** across Woohoos and timeline items (Postgres full-text is enough for v1).
- [ ] **CSV export** from `/settings` — lives up to the open-source, "your data" ethos.

### v1.5 — Discovery & AI (the 10x plays)

- [ ] **Auto-discovery (Reddit).** Use the official Reddit API to scan subreddits/posts for keyword matches and suggest Woohoos. Opt-in, rate-limited, keyword list per user.
- [ ] **AI lead scoring.** Rank Woohoos by likelihood to convert based on content signals (length of reply, question marks, "I'll try", "DM me", etc.). Start with a heuristic score, graduate to an LLM call if the heuristic correlates with real outcomes.
- [ ] **AI reply suggestions.** In the Woohoo detail view, a "Draft reply" button that generates a short, on-tone response using the saved context. User still copies + sends on-platform (stays true to "not an outbound tool").

---

## 5. Other platforms — quick take

Short answer: **Reddit + X + LinkedIn is the indie-founder / B2B-sales 95%.** The rest are worth knowing but rarely worth the dev cost.

- **Product Hunt** — high ROI, narrow window. Launch-day comments are gold warm leads. Simple DOM, stable permalinks. Worth a shot after LinkedIn if you see a cohort of PH-launching users. **Recommended.**
- **Discord** — community-driven SaaS (dev tools, crypto, creators) lives here. Technically feasible via Discord web, but ToS on automation is strict — frame it as *capture only* (which Woohoo already is). **Moderate priority** if your user interviews surface it.
- **Indie Hackers** — extremely on-nose for your target user, tiny audience. Low dev cost (simple DOM). **Good "delight" bet**, not a growth lever.
- **YouTube** — comments on videos + Community tab. Relevant for course-selling YouTubers, tech creators running a SaaS on the side. Narrow but high-ROI for that cohort. **Moderate** — revisit if you see YouTuber signups.
- **Instagram** — mostly B2C creators/lifestyle brands; comments are short and noisy, DMs are where the signal lives. Meta's stance on third-party extensions is hostile. **Low priority** for founders/sales users.
- **TikTok** — comments + DMs. Young audience, B2C app launchers. DOM is notoriously hard to scrape (obfuscated class names, heavy SPA state). **Low priority.**
- **Facebook** — Messenger + group comments. Older demographic, mostly B2C. Few indie founders rely on it. **Skip** unless a user-interview surprise.
- **Hacker News** — comments are gold for feedback, but mostly anonymous handles = no "follow-up" surface. Use case is *feedback capture*, not *lead management*. Could be a "Save to notes" lightweight integration — different flow from Woohoos. **Defer / different product.**

**Recommendation:** after X + LinkedIn, do a user-survey check-in before picking platform #4. The correct answer is probably one of **Product Hunt** (launch-centric founders) or **Discord** (community-led SaaS), depending on who actually signs up in v1.1.

---

## 6. Ideas pool (not scheduled)

- Browser extension side panel for a faster glance at today's follow-ups
- Slack integration: daily digest into a personal Slack DM instead of email
- Team plan: share a Woohoo with a co-founder (rare ask, but consistent with "small team" pitch)
- Calendar: auto-create Google Calendar event when follow-up is set
- Self-host docs + one-command `docker compose` setup (AGPL promise from the landing page — worth formalizing a `SELF_HOSTING.md`)
