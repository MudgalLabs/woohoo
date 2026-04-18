import { SquareArrowOutUpRight } from "lucide-react";

import type { TimelineItem } from "@/app/generated/prisma/client";
import { DeleteTimelineItemButton } from "./DeleteTimelineItemButton";

interface ChatBubbleProps {
    item: TimelineItem;
    isFromPeer: boolean;
}

export function ChatBubble({ item, isFromPeer }: ChatBubbleProps) {
    const time = new Date(item.interactionAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <div
            className={`group flex flex-col ${
                isFromPeer ? "items-start" : "items-end"
            }`}
        >
            <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${
                    isFromPeer
                        ? "bg-muted text-foreground rounded-bl-sm"
                        : "bg-primary text-primary-foreground rounded-br-sm"
                }`}
            >
                <p className="text-sm whitespace-pre-wrap">{item.contentText}</p>
            </div>

            <div
                className={`mt-1 flex items-center gap-2 text-xs text-muted-foreground ${
                    isFromPeer ? "flex-row" : "flex-row-reverse"
                }`}
            >
                <span>{time}</span>
                {item.sourceUrl && (
                    <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:underline opacity-0 group-hover:opacity-100 transition"
                    >
                        View original
                        <SquareArrowOutUpRight size={11} strokeWidth={2.5} />
                    </a>
                )}
                <DeleteTimelineItemButton itemId={item.id} />
            </div>
        </div>
    );
}
