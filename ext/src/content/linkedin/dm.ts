import type { Message } from "@/components/types";
import { cleanHTML, normalizeLinks } from "@/content/lib/dom";
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

/** Are we currently on a LinkedIn messaging thread page? */
export function isOnLinkedInThreadPage(): boolean {
    return window.location.pathname.startsWith("/messaging/thread/");
}

/**
 * Current thread URL — LinkedIn's `/messaging/thread/<urn>/` path is itself
 * the "chat URL" we store on the Woohoo.
 */
export function getActiveLinkedInChatUrl(): string | null {
    if (!isOnLinkedInThreadPage()) return null;
    const { origin, pathname } = window.location;
    return `${origin}${pathname.replace(/\/+$/, "")}/`;
}

export interface LinkedInPeer {
    peerId: string;
    peerName: string | null;
}

/**
 * Reads the other participant from the thread's title bar. LinkedIn's
 * .msg-thread__link-to-profile anchor carries both: href → profile URN, and
 * title="Open <Name>'s profile" → the display name.
 */
export function getActivePeer(): LinkedInPeer | null {
    const link = document.querySelector<HTMLAnchorElement>(
        ".msg-title-bar .msg-thread__link-to-profile[href*='/in/']",
    );
    if (!link) return null;

    const href = link.getAttribute("href") || "";
    const urn = extractUrnFromProfileHref(href);
    if (!urn) return null;

    const titleAttr = link.getAttribute("title") || "";
    // LinkedIn uses a smart apostrophe: "Open Alex Morgan’s profile"
    const titleMatch = /^Open (.+?)(?:[’']s)? profile/i.exec(titleAttr);
    let peerName: string | null = titleMatch?.[1] ?? null;
    if (!peerName) {
        const h2 = link.querySelector(".msg-entity-lockup__entity-title");
        peerName = h2?.textContent?.trim() || null;
    }

    return { peerId: urn, peerName };
}

function extractUrnFromProfileHref(href: string): string | null {
    const match = /\/in\/([^/?#]+)/.exec(href);
    return match ? match[1] : null;
}

/**
 * Fires the callback whenever the DOM changes (debounced 150ms) so callers
 * can rescan the message list for newly-rendered items — handles initial
 * mount, scroll-up pagination via Voyager GraphQL, and incoming messages.
 */
export function observeLinkedInThread(callback: () => void) {
    let scheduled = false;
    const schedule = () => {
        if (scheduled) return;
        scheduled = true;
        setTimeout(() => {
            scheduled = false;
            callback();
        }, 150);
    };

    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });
    schedule();

    return () => observer.disconnect();
}

/**
 * Notify callback on SPA navigation. LinkedIn's webapp swaps routes without
 * a full reload, so popstate + pushState/replaceState patching catches
 * navigation into and out of the thread page.
 */
export function observeLinkedInRouteChanges(callback: () => void) {
    let lastPath = window.location.pathname;
    const check = () => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            callback();
        }
    };

    const origPush = history.pushState;
    const origReplace = history.replaceState;
    history.pushState = function (...args) {
        origPush.apply(this, args);
        setTimeout(check, 0);
    };
    history.replaceState = function (...args) {
        origReplace.apply(this, args);
        setTimeout(check, 0);
    };
    window.addEventListener("popstate", check);

    return () => {
        history.pushState = origPush;
        history.replaceState = origReplace;
        window.removeEventListener("popstate", check);
    };
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
 * Scans the currently-rendered message list and injects a save-button
 * mount point on every message that has a confirmed URN. Items without
 * text content get a button too — SaveModal renders an info state telling
 * the user only text messages are saveable.
 * Idempotent — re-running skips any message that already has a cb-save-root.
 */
export function injectAndReturnSaveButtonContainers(): SaveButtonContainer[] {
    const items = document.querySelectorAll<HTMLElement>(
        ".msg-s-event-listitem",
    );
    const containers: SaveButtonContainer[] = [];

    items.forEach((li) => {
        if (li.querySelector(".cb-save-root")) return;

        const parsed = parseMessage(li);
        if (!parsed) return;

        const message = parsed.saveable ? parsed.message : stubMessage(parsed.id);
        const unsaveableReason = parsed.saveable ? undefined : parsed.reason;

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
        });
    });

    return containers;
}
