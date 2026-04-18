# Woohoo — Feature Planning

Post-MVP work that's been scoped but deliberately not shipped. Each section is self-contained; pick up by loading this file and working the section.

---

## Comment threading

Render saved comments in the detail page's Comments tab as an indented tree instead of a flat chronological list. Matches how Reddit natively displays the conversation and makes it obvious which reply is attached to which parent.

**Schema change.** Add `parentTimelineItemId String?` on `TimelineItem` (nullable self-reference). Migrate. Index on `(woohooId, parentTimelineItemId)` for tree-building queries.

**Extension capture.** During `ext/src/content/reddit/comment.ts` ancestor traversal, capture the parent comment's Reddit ID and include it in the save payload. The server resolves that to the local `TimelineItem.id` of the parent (if it exists in the same Woohoo) and stores it. If the parent isn't saved locally, leave `parentTimelineItemId` null — the comment becomes a root in the rendered tree.

**Server routing.** No behavior change to the save rules (peer vs. founder routing stays as-is). The parent link is additional metadata; it doesn't steer which Woohoo the comment lands in.

**Render.** In `web/app/(app)/my-woohoos/[id]/page.tsx`'s `CommentsView`, build an adjacency list from the flat `comments` array, traverse roots-first, render each `CommentCard` with a left-padding per depth level (cap depth at ~4 to avoid squished text on mobile; deeper replies flatten back to the cap). Keep chronological ordering within siblings.

**Edge cases.**
- Parent deleted but children exist → children become roots. No orphan UI state needed.
- Cross-peer comments (Peer B replying inside Peer A's thread) live in their *own* Woohoo per save rules — the tree in Peer A's Woohoo simply won't contain them. That's intentional.
- Founder replies: already attached to the peer's Woohoo via save rules. They render as tree nodes like any other comment.

**Verification.**
- Save a peer comment, then save the founder's reply to it → founder reply renders indented under the peer comment.
- Save a peer comment, then save a reply to it from the same peer → reply renders indented under the parent.
- Delete the parent → the child re-renders as a root (no crash, no "deleted" placeholder).
- Depth cap: save a 6-deep thread → nodes at depth 4+ all render at the same indent.
