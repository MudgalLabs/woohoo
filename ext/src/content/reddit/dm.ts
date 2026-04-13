import { isVisible, queryAllDeep } from "@/content/lib/dom";

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
    const interval = setInterval(run, 1000);

    // Initial run.
    run();

    return () => {
        observer.disconnect();
        clearInterval(interval);
    };
}

export function injectAndReturnSaveButtonContainers(): HTMLDivElement[] {
    const messages = queryAllDeep(".room-message-body");
    const containers: HTMLDivElement[] = [];

    console.log("Num of messages found:", messages.length);

    messages.forEach((msg) => {
        const parent = msg.closest('[class*="room-message"]') as HTMLElement;
        if (!parent) return;

        if (parent.querySelector(".cb-save-root")) return;

        parent.style.position = "relative";
        parent.style.paddingBottom = "20px";

        let timeout: any;

        parent.addEventListener("mouseenter", () => {
            clearTimeout(timeout);
            container.style.opacity = "1";
            container.style.transform = "translateY(0) scale(1)";
        });

        parent.addEventListener("mouseleave", () => {
            timeout = setTimeout(() => {
                container.style.opacity = "0";
                container.style.transform = "translateY(4px) scale(0.96)";
            }, 80);
        });

        const container = document.createElement("div");
        container.className = "cb-save-root";

        container.style.position = "absolute";
        container.style.right = "0px";
        container.style.bottom = "0px";
        container.style.zIndex = "10";
        container.style.opacity = "0";
        container.style.transform = "translateY(4px) scale(0.96)";
        container.style.transition =
            "opacity 160ms ease, transform 160ms cubic-bezier(0.2, 0, 0, 1)";

        parent.appendChild(container);
        containers.push(container);
    });

    return containers;
}
