import { SquareArrowOutUpRight } from "lucide-react";

import type { TimelineItem } from "@/app/generated/prisma/client";
import { DeleteTimelineItemButton } from "./DeleteTimelineItemButton";

interface CommentCardProps {
    item: TimelineItem;
}

function extractSubreddit(sourceUrl: string | null): string | null {
    if (!sourceUrl) return null;
    const match = sourceUrl.match(/\/r\/([^/]+)\//);
    return match?.[1] ?? null;
}

export function CommentCard({ item }: CommentCardProps) {
    const time = new Date(item.interactionAt).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
    });
    const author = item.authorName ?? item.authorId;
    const initial = author.charAt(0).toUpperCase();
    const subreddit = extractSubreddit(item.sourceUrl);

    return (
        <div className="group flex gap-3">
            <div className="flex shrink-0 flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                    {initial}
                </div>
                <div className="mt-1 w-px flex-1 bg-border" />
            </div>

            <div className="min-w-0 flex-1 pb-2">
                <div className="mb-1 flex items-center gap-1.5 text-xs">
                    <span className="font-semibold text-foreground">
                        u/{author}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground">{time}</span>
                    <div className="ml-auto opacity-0 transition group-hover:opacity-100">
                        <DeleteTimelineItemButton itemId={item.id} />
                    </div>
                </div>

                <p className="whitespace-pre-wrap text-sm text-foreground">
                    {item.contentText}
                </p>

                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    {subreddit && <span>r/{subreddit}</span>}
                    {item.sourceUrl && (
                        <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-primary hover:underline"
                        >
                            View comment
                            <SquareArrowOutUpRight
                                size={11}
                                strokeWidth={2.5}
                            />
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
