import { useEffect } from "react";

import {
    injectAndReturnSaveButtonContainers,
    observeLinkedInMessages,
} from "@/content/linkedin/dm";
import { SaveButton } from "@/components/SaveButton";
import { mountWithShadow } from "@/content/lib/react";

function App() {
    // The observer watches document.body for changes and debounces at 150ms.
    // We don't gate on URL anymore — LinkedIn's messaging overlay (the
    // bottom-right popup list + per-chat bubbles) appears on every page, so
    // we inject save buttons wherever a conversation wrapper is visible.
    useEffect(() => {
        const cleanup = observeLinkedInMessages(() => {
            const containers = injectAndReturnSaveButtonContainers();
            containers.forEach((container) => {
                if (container.element.shadowRoot) return;

                const messageId = container.message.id;
                // Unsaveable items skip the storage cache lookup — they
                // can't be saved, so isSaved is always false.
                if (!container.saveable) {
                    mountWithShadow(container.element, SaveButton, {
                        message: container.message,
                        isSaved: false,
                        peer: container.peerId,
                        peerName: container.peerName ?? undefined,
                        kind: "dm",
                        platform: "linkedin",
                        chatUrl: container.chatUrl,
                        founderExternalId: null,
                        align: "left",
                        theme: "light",
                        saveable: false,
                        unsaveableReason: container.unsaveableReason,
                    });
                    return;
                }

                chrome.storage.local.get(`saved_${messageId}`, (result) => {
                    const isSaved = !!result[`saved_${messageId}`];
                    mountWithShadow(container.element, SaveButton, {
                        message: container.message,
                        isSaved,
                        peer: container.peerId,
                        peerName: container.peerName ?? undefined,
                        kind: "dm",
                        platform: "linkedin",
                        chatUrl: container.chatUrl,
                        founderExternalId: null,
                        align: "left",
                        theme: "light",
                    });
                });
            });
        });

        return cleanup;
    }, []);

    return null;
}

export default App;
