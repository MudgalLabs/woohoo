export type Theme = "light" | "dark";

function readFromHtml(): Theme | null {
    const html = document.documentElement;
    if (!html) return null;

    if (html.classList.contains("theme-dark")) return "dark";
    if (html.classList.contains("theme-light")) return "light";

    const dataScheme =
        html.getAttribute("data-color-scheme") ||
        html.getAttribute("color-scheme");
    if (dataScheme === "dark") return "dark";
    if (dataScheme === "light") return "light";

    const inlineScheme = html.style.colorScheme;
    if (inlineScheme === "dark") return "dark";
    if (inlineScheme === "light") return "light";

    return null;
}

function readFromMatchMedia(): Theme {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function getRedditTheme(): Theme {
    return readFromHtml() ?? readFromMatchMedia();
}

export function subscribeToThemeChanges(
    cb: (theme: Theme) => void,
): () => void {
    let last: Theme = getRedditTheme();

    const notify = () => {
        const next = getRedditTheme();
        if (next !== last) {
            last = next;
            cb(next);
        }
    };

    const observer = new MutationObserver(notify);
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-color-scheme", "color-scheme", "style"],
    });

    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
    const mqlListener = () => notify();
    mql?.addEventListener?.("change", mqlListener);

    return () => {
        observer.disconnect();
        mql?.removeEventListener?.("change", mqlListener);
    };
}
