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
}

export function SaveButton(props: SaveButtonProps) {
    const { message, isSaved } = props;
    const { id } = message;
    const [isActive, setIsActive] = useState(getActive() === id);

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
                <SaveModal message={message} isSaved={isSaved} />
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
