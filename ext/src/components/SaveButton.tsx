import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

import { SaveModal } from "@/components/SaveModal";
import {
    getActive,
    setActive,
    subscribe,
} from "@/content/store/activeSaveButton";
import { Message } from "@/content/reddit/dm";

interface SaveButtonProps {
    message: Message;
    isSaved: boolean;
    peer: string;
}

export function SaveButton(props: SaveButtonProps) {
    const { message, peer } = props;
    const { id } = message;
    const [isActive, setIsActive] = useState(getActive() === id);
    const [isSaved, setIsSaved] = useState(props.isSaved);

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

    return (
        <div
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
                        onSaved={() => setIsSaved(true)}
                        onUnsaved={() => setIsSaved(false)}
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
