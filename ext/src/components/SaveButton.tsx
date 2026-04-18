import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import { SaveModal } from "@/components/SaveModal";
import {
    getActive,
    setActive,
    subscribe,
} from "@/content/store/activeSaveButton";
import { Message } from "@/content/reddit/dm";
import { useTheme } from "@/content/lib/useTheme";

interface SaveButtonProps {
    message: Message;
    isSaved: boolean;
    peer: string;
    kind: "dm" | "comment";
}

export function SaveButton(props: SaveButtonProps) {
    const { message, peer, kind } = props;
    const { id } = message;
    const [isActive, setIsActive] = useState(getActive() === id);
    const [isSaved, setIsSaved] = useState(props.isSaved);
    const theme = useTheme();

    useEffect(() => {
        return subscribe((activeId) => {
            setIsActive(activeId === id);
        });
    }, [id]);

    const toggle = () => {
        if (isActive) {
            setActive(null);
        } else {
            setActive(id);
        }
    };

    const close = () => {
        if (getActive() === id) setActive(null);
    };

    return (
        <div
            className={theme}
            style={{
                position: "relative",
                display: "inline-block",
            }}
        >
            <div className={`cb-popover ${isActive ? "open" : ""}`}>
                {isActive && (
                    <SaveModal
                        message={message}
                        isSaved={isSaved}
                        peer={peer}
                        kind={kind}
                        onSaved={() => setIsSaved(true)}
                        onUnsaved={() => setIsSaved(false)}
                        onClose={close}
                    />
                )}
            </div>

            <button
                className={`cb-icon-btn ${isActive ? "open" : ""}`}
                onClick={toggle}
            >
                <Bookmark
                    size={16}
                    strokeWidth={2.5}
                    fill={isSaved ? "var(--red)" : "transparent"}
                />
            </button>
        </div>
    );
}
