import { useEffect, useState } from "react";

import {
    injectAndReturnSaveButtonContainers,
    observeActiveRedditDM,
    observeActiveRedditDMMessages,
} from "@/content/reddit/dm";
import {
    injectAndReturnCommentSaveButtonContainers,
    observeRedditPostPage,
} from "@/content/reddit/comment";
import { startFounderScraper } from "@/content/reddit/founder";
import { SaveButton } from "@/components/SaveButton";
import { mountWithShadow } from "@/content/lib/react";
import { setActive } from "@/content/store/activeSaveButton";
import { getRedditTheme, subscribeToThemeChanges } from "@/content/lib/theme";
import { persistTheme } from "@/lib/theme";
import { DebugButton } from "./DebugButton";

function App() {
    const [peer, setPeer] = useState<null | string>(null);
    const [isReady, setIsReady] = useState(false);

    // Capture the logged-in Reddit username the first time the user drawer
    // renders. Used server-side to route comment saves deterministically.
    useEffect(() => startFounderScraper(), []);

    // Mirror Reddit's theme into chrome.storage so the popup (which can't see
    // the Reddit DOM) can render in the same theme as the save modal.
    useEffect(() => {
        persistTheme(getRedditTheme());
        return subscribeToThemeChanges(persistTheme);
    }, []);

    // Keep track of the active chat's username.
    // This will track for both, the pop up and reddit.com/chat/room/...
    useEffect(() => {
        const cleanup = observeActiveRedditDM((username) => {
            setPeer(username);
            setActive(username);
        });

        return cleanup;
    }, []);

    // While a DM chat is open, keep rescanning on DOM mutations so
    // lazy-loaded history and incoming messages also receive save buttons.
    useEffect(() => {
        setIsReady(false);

        if (!peer) return;

        const cleanup = observeActiveRedditDMMessages(() => {
            const containers = injectAndReturnSaveButtonContainers();

            containers.forEach((container) => {
                if (container.element.shadowRoot) return;

                const messageId = container.message.id;
                chrome.storage.local.get(`saved_${messageId}`, (result) => {
                    const isSaved = !!result[`saved_${messageId}`];
                    mountWithShadow(container.element, SaveButton, {
                        message: container.message,
                        isSaved,
                        peer: peer ?? "",
                        kind: "dm",
                    });
                });
            });

            setIsReady(true);
        });

        return cleanup;
    }, [peer]);

    // Inject a save button on every Reddit post comment. Unlike DMs, comments
    // don't share a single "active peer" — each comment's author is its own
    // peer. Observer rescans on DOM mutations to catch lazy-loaded replies.
    useEffect(() => {
        const cleanup = observeRedditPostPage(() => {
            const containers = injectAndReturnCommentSaveButtonContainers();

            containers.forEach((container) => {
                if (container.element.shadowRoot) return;

                const commentId = container.comment.id;
                chrome.storage.local.get(`saved_${commentId}`, (result) => {
                    const isSaved = !!result[`saved_${commentId}`];
                    mountWithShadow(container.element, SaveButton, {
                        message: container.comment,
                        isSaved,
                        peer: container.comment.username,
                        kind: "comment",
                    });
                });
            });
        });

        return cleanup;
    }, []);

    // Keep DebugButton + isReady referenced so flipping the debug return on
    // below remains a one-line change.
    void DebugButton;
    void isReady;

    return null;

    // return <DebugButton peer={peer ?? ""} isReady={isReady} />;
}

export default App;
