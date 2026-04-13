import { queryAllDeep } from "@/content/lib/dom";

export function observeActiveRedditDM(
    callback: (username: string | null) => void,
) {
    let lastUser: string | null = null;

    const getActiveUser = () => {
        const active = queryAllDeep("a.peer.container.selected")[0];

        if (!active) return null;

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
