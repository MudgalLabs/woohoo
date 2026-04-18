// Detects the logged-in Reddit username (the "founder" identity) by
// watching for Reddit's user drawer profile link. The drawer is only in
// the DOM when the user opens it, so we install a MutationObserver that
// self-disconnects the first time it sees the link. Result is cached in
// chrome.storage.local so we only need to catch the drawer once.

const STORAGE_KEY = "founder_reddit_username";

export function parseRedditUserHref(href: string): string | null {
    const match = /^\/user\/([^/]+)\/?$/.exec(href);
    return match ? match[1] : null;
}

// Accepts "u/heyshikhar", "/u/heyshikhar", "heyshikhar/", or a full profile
// URL and returns the bare handle ("heyshikhar") that matches Reddit's
// shreddit-comment `author` attribute. Empty string if nothing usable.
export function normalizeRedditUsername(input: string): string {
    let s = input.trim();
    if (!s) return "";
    try {
        const url = new URL(s);
        s = url.pathname;
    } catch {
        // not a URL; treat as a handle path fragment
    }
    s = s.replace(/^\/+|\/+$/g, "");
    s = s.replace(/^(?:u|user)\//i, "");
    return s.trim();
}

function scrapeOnce(): string | null {
    const link = document.querySelector<HTMLAnchorElement>(
        '#user-drawer-content a[href^="/user/"]',
    );
    if (!link) return null;
    const href = link.getAttribute("href");
    if (!href) return null;
    const name = parseRedditUserHref(href);
    return name ? normalizeRedditUsername(name) : null;
}

let observer: MutationObserver | null = null;

export function startFounderScraper(): () => void {
    if (observer) return () => {};

    const tryCapture = () => {
        const name = scrapeOnce();
        if (!name) return false;
        chrome.storage.local.set({ [STORAGE_KEY]: name });
        observer?.disconnect();
        observer = null;
        return true;
    };

    // In case the drawer is already open when we mount.
    if (tryCapture()) {
        return () => {};
    }

    observer = new MutationObserver(() => {
        tryCapture();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
        observer?.disconnect();
        observer = null;
    };
}

export function getFounderUsername(): Promise<string | null> {
    return new Promise((resolve) => {
        chrome.storage.local.get(STORAGE_KEY, (result) => {
            const value = result[STORAGE_KEY];
            if (typeof value !== "string" || !value) {
                resolve(null);
                return;
            }
            const normalized = normalizeRedditUsername(value);
            resolve(normalized || null);
        });
    });
}
