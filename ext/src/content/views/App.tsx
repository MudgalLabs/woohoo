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
import { SaveButton } from "@/components/SaveButton";
import { mountWithShadow } from "@/content/lib/react";
import { setActive } from "@/content/store/activeSaveButton";

function App() {
    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    const [peer, setPeer] = useState<null | string>(null);
    const [isReady, setIsReady] = useState(false);

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

    return (
        <div className="popup-container">
            {show && (
                <div
                    className={`popup-content ${show ? "opacity-100" : "opacity-0"}`}
                >
                    {!peer ? "Open any chat" : `Current chat: ${peer}`}
                </div>
            )}

            <button
                className={`toggle-button ${isReady ? "btn-primary" : ""}`}
                onClick={toggle}
            ></button>
        </div>
    );
}

export default App;
