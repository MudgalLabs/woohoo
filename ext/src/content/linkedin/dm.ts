import type { Message } from "@/components/types";
import { cleanHTML, normalizeLinks, queryAllDeep } from "@/content/lib/dom";
import { getActive } from "@/content/store/activeSaveButton";

/**
 * LinkedIn renders message line breaks as <br> nodes inside the body <p>.
 * Plain textContent collapses those to nothing, so clone the subtree and
 * swap <br> for "\n" before extracting — otherwise multi-line DMs land in
 * the backend as a single concatenated line.
 */
function extractTextWithLineBreaks(el: Element): string {
    const clone = el.cloneNode(true) as Element;
    clone.querySelectorAll("br").forEach((br) => {
        br.replaceWith(document.createTextNode("\n"));
    });
    return clone.textContent?.trim() ?? "";
}

function extractUrnFromProfileHref(href: string): string | null {
    const match = /\/in\/([^/?#]+)/.exec(href);
    return match ? match[1] : null;
}

export interface LinkedInPeer {
    peerId: string;
    peerName: string | null;
}

/**
 * Extracts the peer (other participant) for a single conversation wrapper.
 * Handles both surfaces via one query:
 * - Full-page thread: `.msg-convo-wrapper.msg-thread` → peer link lives in
 *   `.msg-title-bar .msg-thread__link-to-profile`.
 * - Popup overlay: `.msg-convo-wrapper.msg-overlay-conversation-bubble` →
 *   peer link lives in `.msg-overlay-conversation-bubble-header`, wrapping
 *   a `<span>` with the display name.
 *
 * For group chats, LinkedIn surfaces one "primary" profile link in the
 * header; we take the first `/in/*` anchor we see.
 */
function extractPeer(wrapper: HTMLElement): LinkedInPeer | null {
    const link = wrapper.querySelector<HTMLAnchorElement>(
        ".msg-title-bar .msg-thread__link-to-profile[href*='/in/'], " +
            ".msg-overlay-conversation-bubble-header a[href*='/in/']",
    );
    if (!link) return null;

    const href = link.getAttribute("href") || "";
    const urn = extractUrnFromProfileHref(href);
    if (!urn) return null;

    // Thread header: title="Open Alex Morgan's profile"
    const titleAttr = link.getAttribute("title") || "";
    const titleMatch = /^Open (.+?)(?:[’']s)? profile/i.exec(titleAttr);
    let peerName: string | null = titleMatch?.[1] ?? null;

    // Popup header: a <span> with the display name inside the link.
    if (!peerName) {
        const span = link.querySelector<HTMLElement>(
            "span.hoverable-link-text, .msg-entity-lockup__entity-title",
        );
        peerName = span?.textContent?.trim() || null;
    }

    // Fallback: any non-empty text content inside the link.
    if (!peerName) {
        const text = link.textContent?.trim();
        if (text) peerName = text;
    }

    return { peerId: urn, peerName };
}

/**
 * LinkedIn's message URN embeds the conversation ID. Format:
 *   urn:li:msg_message:(urn:li:fsd_profile:<sender>,2-<base64>)
 * where the base64 decodes to `<msgTimestamp>-<counter>&<convoUuid>_<int>`.
 * The thread URL uses `2-<base64 of convoUuid_int>`, so we split the decoded
 * string on `&`, take the right half, re-encode, and prepend `2-`.
 *
 * Returns null if the format drifts — callers fall back to the peer's
 * profile URL in that case.
 */
function deriveThreadUrnFromMessageUrn(messageUrn: string): string | null {
    try {
        const match = /,2-([^)]+)\)$/.exec(messageUrn);
        if (!match) return null;
        const decoded = atob(match[1]);
        const ampIndex = decoded.indexOf("&");
        if (ampIndex < 0) return null;
        const convoPart = decoded.slice(ampIndex + 1);
        if (!convoPart) return null;
        return `2-${btoa(convoPart)}`;
    } catch {
        return null;
    }
}

/**
 * Derives the `chatUrl` (Woohoo's "Open chat" link) for a conversation.
 * - Thread page: the thread URL is the conversation URL.
 * - Popup: derive the thread URL from any rendered message's URN; this
 *   lets "Open chat" in Woohoo land directly on the thread. Falls back to
 *   the peer's profile URL if the popup has no messages yet or the URN
 *   format can't be decoded.
 */
function extractChatUrl(wrapper: HTMLElement, peer: LinkedInPeer): string {
    if (wrapper.classList.contains("msg-thread")) {
        const { origin, pathname } = window.location;
        return `${origin}${pathname.replace(/\/+$/, "")}/`;
    }

    const firstMsg = wrapper.querySelector<HTMLElement>("[data-event-urn]");
    const messageUrn = firstMsg?.getAttribute("data-event-urn");
    if (messageUrn) {
        const threadUrn = deriveThreadUrnFromMessageUrn(messageUrn);
        if (threadUrn) {
            return `https://www.linkedin.com/messaging/thread/${threadUrn}/`;
        }
    }

    return `https://www.linkedin.com/in/${peer.peerId}/`;
}

interface Conversation {
    wrapper: HTMLElement;
    peer: LinkedInPeer;
    chatUrl: string;
}

/**
 * Walks the page for every visible conversation surface: the full-page
 * thread at `/messaging/thread/<urn>/` AND any overlay popups at the
 * bottom-right of any LinkedIn page. Minimized popups are skipped — their
 * messages aren't interactive, so injecting buttons there is wasted work.
 */
function findConversations(): Conversation[] {
    // queryAllDeep walks into shadow roots — LinkedIn's bottom-right overlay
    // (chat list + popup bubbles) is mounted under #interop-outlet's open
    // shadow root, so a plain document.querySelectorAll would miss it.
    const wrappers = queryAllDeep(".msg-convo-wrapper");
    const results: Conversation[] = [];
    wrappers.forEach((wrapper) => {
        // Skip collapsed popups — their message list is in the DOM but
        // hidden; users can't hover anything.
        if (
            wrapper.classList.contains(
                "msg-overlay-conversation-bubble--is-minimized",
            )
        ) {
            return;
        }
        const peer = extractPeer(wrapper);
        if (!peer) return;
        const chatUrl = extractChatUrl(wrapper, peer);
        results.push({ wrapper, peer, chatUrl });
    });
    return results;
}

/**
 * Walks the document subtree and returns every open shadow root we find.
 * LinkedIn mounts the messaging overlay (chat list + popup bubbles) under
 * `#interop-outlet`, whose shadow root a body-level MutationObserver can't
 * see — so we need to attach observers directly to each shadow root too.
 */
function collectShadowRoots(root: Node): ShadowRoot[] {
    const roots: ShadowRoot[] = [];
    const walk = (node: any) => {
        if (!node) return;
        if (node.shadowRoot) {
            roots.push(node.shadowRoot);
            walk(node.shadowRoot);
        }
        const children = node.children || [];
        for (const child of children) walk(child);
    };
    walk(root);
    return roots;
}

/**
 * Fires the callback whenever the DOM changes (debounced 150ms) so callers
 * can rescan conversations — handles popups opening/closing/minimizing,
 * new messages arriving, scroll-up pagination, and SPA route changes. We
 * observe document.body for main-tree changes AND every open shadow root
 * we know about; shadow roots discovered later (e.g. #interop-outlet
 * mounting after initial load) are picked up on the next scan because
 * their host's addition to body triggers the main observer.
 */
export function observeLinkedInMessages(callback: () => void) {
    let scheduled = false;
    const observedRoots = new WeakSet<ShadowRoot>();

    const schedule = () => {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => {
            scheduled = false;
            // Pick up any shadow roots that appeared since the last tick so
            // subsequent mutations inside them fire the observer too.
            for (const root of collectShadowRoots(document.body)) {
                if (observedRoots.has(root)) continue;
                observedRoots.add(root);
                observer.observe(root, { childList: true, subtree: true });
            }
            callback();
        }, 150);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    schedule();

    return () => observer.disconnect();
}

export type ParsedMessage =
    | { saveable: true; message: Message }
    | { saveable: false; id: string; reason: string };

function parseMessage(li: HTMLElement): ParsedMessage | null {
    // Optimistic / pending sends don't yet have a URN — skip them entirely
    // (not even the save-button shell). Next mutation tick catches the item
    // once the server confirms and the attribute lands.
    const externalId = li.getAttribute("data-event-urn");
    if (!externalId) return null;

    // Empty-text messages are reshares, reactions-only, files, calls, etc.
    // We still inject the save button so users see Woohoo is working on the
    // surface — the modal then tells them saves only apply to text.
    const bodyEl = li.querySelector<HTMLElement>(
        ".msg-s-event-listitem__body",
    );
    const contentText = bodyEl ? extractTextWithLineBreaks(bodyEl) : "";
    if (!contentText) {
        return {
            saveable: false,
            id: externalId,
            reason: "Only text messages can be saved.",
        };
    }

    // Strip LinkedIn's class/style/data-* + Ember <!----> comment artifacts,
    // then rewrite any anchors to open externally. <br> tags are preserved
    // so the Woohoo detail view renders multi-line messages correctly.
    const contentHTML = bodyEl
        ? normalizeLinks(cleanHTML(bodyEl.innerHTML))
        : "";

    // Group header (avatar + sender link + name) only lives on the first
    // message of a consecutive same-sender run. Walk back through sibling
    // <li>s until we find it.
    let groupLink: HTMLAnchorElement | null =
        li.querySelector<HTMLAnchorElement>(
            ".msg-s-event-listitem__link[href*='/in/']",
        );
    let groupNameEl: Element | null = li.querySelector(
        ".msg-s-message-group__name",
    );

    let cursor: Element | null = li.previousElementSibling;
    while ((!groupLink || !groupNameEl) && cursor) {
        if (!groupLink) {
            groupLink = cursor.querySelector<HTMLAnchorElement>(
                ".msg-s-event-listitem__link[href*='/in/']",
            );
        }
        if (!groupNameEl) {
            groupNameEl = cursor.querySelector(
                ".msg-s-message-group__name",
            );
        }
        cursor = cursor.previousElementSibling;
    }

    let authorId = "";
    if (groupLink) {
        authorId =
            extractUrnFromProfileHref(groupLink.getAttribute("href") || "") ??
            "";
    }
    const authorName = groupNameEl?.textContent?.trim() || "";

    // Prefer the precise "Sent at <date>, <time>" string off the sending
    // indicator; only present on founder-authored messages but it's the
    // cleanest signal when available.
    let timestamp = "";
    const indicatorTitle = li
        .querySelector<HTMLElement>(
            ".msg-s-event-with-indicator__sending-indicator[title]",
        )
        ?.getAttribute("title");
    if (indicatorTitle) {
        const match = /Sent at (.+)$/.exec(indicatorTitle);
        if (match) {
            const parsed = new Date(match[1]);
            if (!Number.isNaN(parsed.getTime())) {
                timestamp = parsed.toISOString();
            }
        }
    }
    if (!timestamp) {
        // Fallback: save-time. DOM-visible "Tuesday 4:30 PM" parsing is
        // ambiguous (relative to view date + TZ) — "now" is close enough for
        // v1 and the backend only needs any valid ISO.
        timestamp = new Date().toISOString();
    }

    return {
        saveable: true,
        message: {
            id: externalId,
            username: authorName || authorId,
            timestamp,
            contentText,
            contentHTML,
        },
    };
}

export interface SaveButtonContainer {
    element: HTMLDivElement;
    message: Message;
    saveable: boolean;
    unsaveableReason?: string;
    // Each container carries its own conversation scope so App.tsx can mount
    // the SaveButton with the right peer — critical when multiple popups
    // are open simultaneously (different peers in each).
    peerId: string;
    peerName: string | null;
    chatUrl: string;
}

/**
 * Builds a placeholder Message shell for unsaveable items so SaveButton has
 * the minimum it needs to track active state (`id` for the store toggle).
 * Fields other than id/timestamp are left empty — the modal won't read them.
 */
function stubMessage(id: string): Message {
    return {
        id,
        username: "",
        timestamp: new Date().toISOString(),
        contentText: "",
        contentHTML: "",
    };
}

/**
 * Scans every currently-rendered conversation (thread page + any open
 * popups) and injects a save-button mount point on each message with a
 * confirmed URN. Items without text content get a button too — SaveModal
 * renders an info state telling the user only text messages are saveable.
 * Idempotent — re-running skips any message that already has a cb-save-root.
 */
export function injectAndReturnSaveButtonContainers(): SaveButtonContainer[] {
    const conversations = findConversations();
    const containers: SaveButtonContainer[] = [];

    conversations.forEach((conv) => {
        const items = conv.wrapper.querySelectorAll<HTMLElement>(
            ".msg-s-event-listitem",
        );
        items.forEach((li) => {
            if (li.querySelector(".cb-save-root")) return;

            const parsed = parseMessage(li);
            if (!parsed) return;

            const message = parsed.saveable
                ? parsed.message
                : stubMessage(parsed.id);
            const unsaveableReason = parsed.saveable
                ? undefined
                : parsed.reason;

            li.style.position = "relative";
            li.style.paddingBottom = "20px";

            const element = document.createElement("div");
            element.className = "cb-save-root";

            const inactiveOpacity = "0.3";

            element.style.position = "absolute";
            element.style.left = "0px";
            element.style.bottom = "0px";
            element.style.zIndex = "10";
            element.style.opacity = inactiveOpacity;
            element.style.transform = "translateY(4px) scale(0.96)";
            element.style.transition =
                "opacity 160ms ease, transform 160ms cubic-bezier(0.2, 0, 0, 1)";

            let timeout: any;
            li.addEventListener("mouseenter", () => {
                clearTimeout(timeout);
                element.style.opacity = "1";
                element.style.transform = "translateY(0) scale(1)";
            });
            li.addEventListener("mouseleave", () => {
                timeout = setTimeout(() => {
                    if (getActive() === message.id) return;
                    element.style.opacity = inactiveOpacity;
                    element.style.transform = "translateY(4px) scale(0.96)";
                }, 80);
            });

            li.appendChild(element);

            containers.push({
                element,
                message,
                saveable: parsed.saveable,
                unsaveableReason,
                peerId: conv.peer.peerId,
                peerName: conv.peer.peerName,
                chatUrl: conv.chatUrl,
            });
        });
    });

    return containers;
}
