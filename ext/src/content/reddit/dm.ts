import {
    cleanHTML,
    closestDeep,
    isVisible,
    normalizeLinks,
    queryAllDeep,
    withLineBreaks,
} from "@/content/lib/dom";

export function isChatPopupOpen(): boolean {
    const chatClient = queryAllDeep('[data-testid="reddit-chat-client"]')[0];
    return isVisible(chatClient);
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
        if (!active) return null;

        // Active chat box's title is the Reddit user's username.
        return active.querySelector(".room-name")?.textContent?.trim() || null;
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

interface SaveButtonContainer {
    element: HTMLDivElement;
    message: Message;
}

export function injectAndReturnSaveButtonContainers(): SaveButtonContainer[] {
    const messages = queryAllDeep(".room-message-body");
    const containers: SaveButtonContainer[] = [];

    console.log("Num of messages found:", messages.length);

    let prevMessage: Message | null = null;

    messages.forEach((msg) => {
        const parent = msg.closest('[class*="room-message"]') as HTMLElement;
        if (!parent) return;

        if (parent.querySelector(".cb-save-root")) return;

        const message = parseMessage(parent, prevMessage?.username || "");
        if (!message) {
            console.error("Failed to parse message");
            return containers;
        }

        prevMessage = message;

        console.log({ message });

        parent.style.position = "relative";
        parent.style.paddingBottom = "20px";

        let timeout: any;

        parent.addEventListener("mouseenter", () => {
            clearTimeout(timeout);
            // container.style.opacity = "1";
            element.style.transform = "translateY(0) scale(1)";
        });

        parent.addEventListener("mouseleave", () => {
            timeout = setTimeout(() => {
                // container.style.opacity = "0";
                element.style.transform = "translateY(4px) scale(0.96)";
            }, 80);
        });

        const element = document.createElement("div");
        element.className = "cb-save-root";

        element.style.position = "absolute";
        element.style.right = "0px";
        element.style.bottom = "0px";
        element.style.zIndex = "10";
        // container.style.opacity = "0";
        element.style.transform = "translateY(4px) scale(0.96)";
        element.style.transition =
            "opacity 160ms ease, transform 160ms cubic-bezier(0.2, 0, 0, 1)";

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
