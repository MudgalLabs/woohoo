import type { TimelineItem } from "@/app/generated/prisma/client";

/*
 * Visual mirror of web/app/(app)/my-woohoos/[id]/ChatBubble.tsx, minus
 * <DeleteTimelineItemButton>. Keep in sync with the real component.
 */
interface DemoChatBubbleProps {
    item: TimelineItem;
    isFromPeer: boolean;
}

export function DemoChatBubble({ item, isFromPeer }: DemoChatBubbleProps) {
    const time = new Date(item.interactionAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <div
            className={`flex flex-col ${
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
                <p className="text-sm whitespace-pre-wrap">
                    {item.contentText}
                </p>
            </div>

            <div
                className={`mt-1 flex items-center gap-2 text-xs text-muted-foreground ${
                    isFromPeer ? "flex-row" : "flex-row-reverse"
                }`}
            >
                <span>{time}</span>
            </div>
        </div>
    );
}
