import {
    cleanHTML,
    normalizeLinks,
    queryAllDeep,
    withLineBreaks,
} from "@/content/lib/dom";
import { getActive } from "@/content/store/activeSaveButton";

export type Comment = {
    id: string;
    username: string;
    timestamp: string;
    contentText: string;
    contentHTML: string;
    sourceUrl: string;
    // Reddit comment IDs (thingid, e.g. t1_xxx) of ancestor comments,
    // nearest-first. Used by the save path to thread replies into an
    // already-saved ancestor's Woohoo.
    ancestorExternalIds: string[];
};

export function isOnRedditPostPage(): boolean {
    return /^\/r\/[^/]+\/comments\//.test(window.location.pathname);
}

// Fires the callback whenever the DOM changes on a Reddit post page so the
// caller can rescan for newly-rendered shreddit-comment elements. Reddit
// lazy-loads replies and pages in more comments on scroll, so one-shot
// injection isn't enough.
export function observeRedditPostPage(callback: () => void) {
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

interface CommentSaveButtonContainer {
    element: HTMLDivElement;
    comment: Comment;
}

const INJECTED_MARK = "data-cb-comment-injected";

export function injectAndReturnCommentSaveButtonContainers(): CommentSaveButtonContainer[] {
    if (!isOnRedditPostPage()) return [];

    const comments = queryAllDeep("shreddit-comment");
    const containers: CommentSaveButtonContainer[] = [];

    comments.forEach((commentEl) => {
        if (commentEl.hasAttribute(INJECTED_MARK)) return;

        const comment = parseComment(commentEl);
        if (!comment) return;

        const contentEl = commentEl.querySelector<HTMLElement>(
            '[slot="comment"]',
        );
        if (!contentEl) return;

        // Make the content body our positioning parent and override Reddit's
        // overflow-hidden so the hover button isn't clipped.
        contentEl.style.position = "relative";
        contentEl.style.overflow = "visible";
        contentEl.style.paddingBottom = "20px";

        const element = document.createElement("div");
        element.className = "cb-save-root";

        const inactiveOpacity = "0.3";

        element.style.position = "absolute";
        element.style.right = "0px";
        element.style.bottom = "0px";
        // Stay above comment text but below Reddit overlays (chat popup, etc).
        element.style.zIndex = "1";
        element.style.opacity = inactiveOpacity;
        element.style.transform = "translateY(4px) scale(0.96)";
        element.style.transition =
            "opacity 160ms ease, transform 160ms cubic-bezier(0.2, 0, 0, 1)";

        let timeout: any;

        (commentEl as HTMLElement).addEventListener("mouseenter", () => {
            clearTimeout(timeout);
            element.style.opacity = "1";
            element.style.transform = "translateY(0) scale(1)";
        });

        (commentEl as HTMLElement).addEventListener("mouseleave", () => {
            timeout = setTimeout(() => {
                if (getActive() === comment.id) return;

                element.style.opacity = inactiveOpacity;
                element.style.transform = "translateY(4px) scale(0.96)";
            }, 80);
        });

        contentEl.appendChild(element);
        commentEl.setAttribute(INJECTED_MARK, "");

        containers.push({ element, comment });
    });

    return containers;
}

function collectAncestorCommentIds(el: Element): string[] {
    const ids: string[] = [];
    let cursor: Element | null | undefined = el.parentElement?.closest(
        "shreddit-comment",
    );
    // Cap iterations as a guard; real threads rarely exceed 5–10 deep.
    for (let i = 0; i < 10 && cursor; i++) {
        const thingId = cursor.getAttribute("thingid");
        if (thingId) ids.push(thingId);
        cursor = cursor.parentElement?.closest("shreddit-comment");
    }
    return ids;
}

export function parseComment(el: Element): Comment | null {
    try {
        const id = el.getAttribute("thingid");
        const author = el.getAttribute("author");
        const created = el.getAttribute("created");
        const permalink = el.getAttribute("permalink");

        if (!id || !author || !created || !permalink) return null;

        const contentEl = el.querySelector<HTMLElement>('[slot="comment"]');
        if (!contentEl) return null;

        const contentText = contentEl.textContent?.trim() || "";
        const contentHTML = withLineBreaks(
            normalizeLinks(cleanHTML(contentEl.innerHTML || "")),
        );

        const sourceUrl = permalink.startsWith("http")
            ? permalink
            : `https://www.reddit.com${permalink}`;

        return {
            id,
            username: author,
            timestamp: created,
            contentText,
            contentHTML,
            sourceUrl,
            ancestorExternalIds: collectAncestorCommentIds(el),
        };
    } catch (e) {
        console.error("Failed to parse comment", e);
        return null;
    }
}
