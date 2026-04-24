import { useEffect, useState } from "react";

import {
    getActiveLinkedInChatUrl,
    getActivePeer,
    injectAndReturnSaveButtonContainers,
    isOnLinkedInThreadPage,
    observeLinkedInRouteChanges,
    observeLinkedInThread,
} from "@/content/linkedin/dm";
import { SaveButton } from "@/components/SaveButton";
import { mountWithShadow } from "@/content/lib/react";

function App() {
    const [onThread, setOnThread] = useState<boolean>(() =>
        isOnLinkedInThreadPage(),
    );

    // SPA nav — flip the gate whenever the pathname changes.
    useEffect(() => {
        return observeLinkedInRouteChanges(() => {
            setOnThread(isOnLinkedInThreadPage());
        });
    }, []);

    useEffect(() => {
        if (!onThread) return;

        const cleanup = observeLinkedInThread(() => {
            const peer = getActivePeer();
            if (!peer) return;
            const chatUrl = getActiveLinkedInChatUrl() ?? undefined;

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
                        peer: peer.peerId,
                        peerName: peer.peerName ?? undefined,
                        kind: "dm",
                        platform: "linkedin",
                        chatUrl,
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
                        peer: peer.peerId,
                        peerName: peer.peerName ?? undefined,
                        kind: "dm",
                        platform: "linkedin",
                        chatUrl,
                        founderExternalId: null,
                        align: "left",
                        theme: "light",
                    });
                });
            });
        });

        return cleanup;
    }, [onThread]);

    return null;
}

export default App;
