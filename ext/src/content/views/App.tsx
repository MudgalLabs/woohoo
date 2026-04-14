import { useEffect, useState } from "react";

import {
    injectAndReturnSaveButtonContainers,
    observeActiveRedditDM,
} from "@/content/reddit/dm";
import { SaveButton } from "@/components/SaveButton";
import { mountWithShadow } from "../lib/react";

function App() {
    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    const [active, setActive] = useState<null | string>(null);
    const [isReady, setIsReady] = useState(false);

    // Keep track of the active chat's username.
    // This will track for both, the pop up and reddit.com/chat/room/...
    useEffect(() => {
        const cleanup = observeActiveRedditDM((username) => {
            setActive(username);
        });

        return cleanup;
    }, []);

    // Whenever the active chat's username changes, inject the <SaveButton />.
    useEffect(() => {
        setIsReady(false);

        if (!active) return;

        const containers = injectAndReturnSaveButtonContainers();

        // TODO: id = message/comment ID.
        containers.forEach((container) => {
            // already mounted
            if (container.element.shadowRoot) return;

            mountWithShadow(container.element, SaveButton, {
                message: container.message,
            });
        });

        setIsReady(true);
    }, [active]);

    return (
        <div className="popup-container">
            {show && (
                <div
                    className={`popup-content ${show ? "opacity-100" : "opacity-0"}`}
                >
                    {!active ? "Open any chat" : `Current chat: ${active}`}
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
