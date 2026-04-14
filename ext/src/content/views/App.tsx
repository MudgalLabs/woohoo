import { useEffect, useState } from "react";

import {
    injectAndReturnSaveButtonContainers,
    observeActiveRedditDM,
} from "@/content/reddit/dm";
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

    // Whenever the active chat's username changes, inject the <SaveButton />.
    useEffect(() => {
        setIsReady(false);

        if (!peer) return;

        const containers = injectAndReturnSaveButtonContainers();

        // TODO: id = message/comment ID.
        containers.forEach((container, i) => {
            // already mounted
            if (container.element.shadowRoot) return;

            mountWithShadow(container.element, SaveButton, {
                message: container.message,
                isSaved: i % 2, // FOR TESTING.
            });
        });

        setIsReady(true);
    }, [peer]);

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
