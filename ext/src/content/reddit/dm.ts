import {
    cleanHTML,
    closestDeep,
    isVisible,
    normalizeLinks,
    queryAllDeep,
    withLineBreaks,
} from "@/content/lib/dom";
import { getActive } from "@/content/store/activeSaveButton";

export function isChatPopupOpen(): boolean {
    const chatClient = queryAllDeep('[data-testid="reddit-chat-client"]')[0];
    return isVisible(chatClient);
}

function getPeerFromChatHeader(): string | null {
    const el = queryAllDeep(
        '[aria-label^="Current chat, Direct chat with "]',
    )[0];
    return el?.textContent?.trim() || null;
}

export function getActiveRedditChatRoomUrl(): string | null {
    // On the full chat page, the address bar is authoritative.
    if (window.location.pathname.startsWith("/chat/room/")) {
        const { origin, pathname } = window.location;
        return `${origin}${pathname.replace(/\/+$/, "")}`;
    }

    // On other Reddit pages the chat must be open for a room to be active.
    if (!isChatPopupOpen()) return null;

    const nav = queryAllDeep("rs-rooms-nav")[0];
    const roomId = nav?.getAttribute("activeroom");
    if (!roomId) return null;

    // activeroom is the decoded form (e.g. "!abc:reddit.com") — encode ':' etc.
    return `https://www.reddit.com/chat/room/${encodeURIComponent(roomId)}`;
}

export function observeActiveRedditDM(
    callback: (username: string | null) => void,
) {
    let lastUser: string | null = null;

    const getActiveUser = () => {
        // If we aren't on reddit.com/chat/.../... then we have to make sure
        // the chat popup is open before returning a username.
        if (
            !window.location.pathname.startsWith("/chat") &&
            !isChatPopupOpen()
        ) {
            return null;
        }

        const active = queryAllDeep("a.peer.container.selected")[0];
        const fromSidenav =
            active?.querySelector(".room-name")?.textContent?.trim() || null;
        if (fromSidenav) return fromSidenav;

        // Sidenav misses old chats whose row hasn't been rendered yet.
        // Fall back to the chat header, which is present on both the popup
        // and /chat/room/* surfaces via the <rs-room> shadow DOM.
        return getPeerFromChatHeader();
    };

    const run = () => {
        const username = getActiveUser();

        if (username !== lastUser) {
            lastUser = username;
            callback(username);
        }
    };

    const observer = new MutationObserver(run);

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
    });

    // ALSO run periodically as fallback (hybrid approach).
    const interval = setInterval(run, 500);

    // Initial run.
    run();

    return () => {
        observer.disconnect();
        clearInterval(interval);
    };
}

// Rescans while a DM chat is open so lazy-loaded history and newly-arriving
// messages still get save buttons. Mirrors observeRedditPostPage.
export function observeActiveRedditDMMessages(callback: () => void) {
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

interface SaveButtonContainer {
    element: HTMLDivElement;
    message: Message;
}

export function injectAndReturnSaveButtonContainers(): SaveButtonContainer[] {
    const messages = queryAllDeep(".room-message-body");
    const containers: SaveButtonContainer[] = [];

    let prevMessage: Message | null = null;

    messages.forEach((msg) => {
        // const parent = msg.closest('[class*="room-message"]') as HTMLElement;
        const parent = msg.closest(".room-message") as HTMLElement;
        if (!parent) return;

        if (parent.querySelector(".cb-save-root")) return;

        const message = parseMessage(parent, prevMessage?.username || "");
        if (!message) {
            console.error("Failed to parse message");
            return containers;
        }

        prevMessage = message;

        parent.style.position = "relative";
        parent.style.paddingBottom = "20px";

        const element = document.createElement("div");
        element.className = "cb-save-root";

        const inactiveOpacity = "0.3";

        element.style.position = "absolute";
        element.style.right = "0px";
        element.style.bottom = "0px";
        element.style.zIndex = "10";
        element.style.opacity = inactiveOpacity;
        element.style.transform = "translateY(4px) scale(0.96)";
        element.style.transition =
            "opacity 160ms ease, transform 160ms cubic-bezier(0.2, 0, 0, 1)";

        let timeout: any;

        parent.addEventListener("mouseenter", () => {
            clearTimeout(timeout);
            element.style.opacity = "1";
            element.style.transform = "translateY(0) scale(1)";
        });

        parent.addEventListener("mouseleave", () => {
            timeout = setTimeout(() => {
                if (getActive() === message.id) return;

                element.style.opacity = inactiveOpacity;
                element.style.transform = "translateY(4px) scale(0.96)";
            }, 80);
        });

        parent.appendChild(element);

        const item: SaveButtonContainer = {
            element,
            message,
        };

        containers.push(item);
    });

    return containers;
}

export type Message = {
    id: string;
    username: string;
    timestamp: string;
    contentText: string;
    contentHTML: string;
    // Only populated for comments; DMs leave this undefined.
    sourceUrl?: string;
    // Only populated for comments; nearest-first ancestor Reddit thingids.
    ancestorExternalIds?: string[];
};

export function parseMessage(
    parent: HTMLElement,
    lastUsername: string,
): Message | null {
    try {
        const event = closestDeep(parent, "rs-timeline-event");
        if (!event) return null;

        const id = event.getAttribute("data-id") || "";

        const contentEl = parent.querySelector(".room-message-text");
        const contentText = contentEl?.textContent?.trim() || "";
        const rawHTML = cleanHTML(contentEl?.innerHTML || "");
        const contentHTML = withLineBreaks(normalizeLinks(cleanHTML(rawHTML)));

        const usernameEl = queryAllDeep(".user-name", event).find(
            (el) => el.textContent?.trim().length > 0,
        );

        let username = usernameEl?.textContent?.trim() || "";

        if (!username) {
            username = lastUsername || "";
        }

        const timeEl = queryAllDeep("time", event)[0];
        const timestamp = timeEl?.getAttribute("datetime") || "";

        return {
            id,
            username,
            timestamp,
            contentText,
            contentHTML,
        };
    } catch (e) {
        console.error("Failed to parse message", e);
        return null;
    }
}
