import { SquareArrowOutUpRight } from "lucide-react";

import type { TimelineItem } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";
import { timeAgo } from "../WoohooCard";
import { DeleteTimelineItemButton } from "./DeleteTimelineItemButton";

interface CommentCardProps {
    item: TimelineItem;
    isFromPeer: boolean;
}

function extractSubreddit(sourceUrl: string | null): string | null {
    if (!sourceUrl) return null;
    const match = sourceUrl.match(/\/r\/([^/]+)\//);
    return match?.[1] ?? null;
}

export function CommentCard({ item, isFromPeer }: CommentCardProps) {
    const subreddit = extractSubreddit(item.sourceUrl);
    const ago = timeAgo(item.interactionAt);

    return (
        <div
            className={cn(
                "group relative rounded-lg border border-border bg-card p-4",
                !isFromPeer && "border-l-2 border-l-primary/60",
            )}
        >
            <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                {isFromPeer ? (
                    <>
                        {subreddit && (
                            <>
                                <span className="font-medium text-foreground">
                                    r/{subreddit}
                                </span>
                                <span aria-hidden>·</span>
                            </>
                        )}
                        <span>{ago}</span>
                    </>
                ) : (
                    <>
                        <span className="font-medium text-primary">
                            You replied
                        </span>
                        {subreddit && (
                            <>
                                <span aria-hidden>·</span>
                                <span>r/{subreddit}</span>
                            </>
                        )}
                        <span aria-hidden>·</span>
                        <span>{ago}</span>
                    </>
                )}
            </div>

            <p className="whitespace-pre-wrap text-sm text-foreground">
                {item.contentText}
            </p>

            {item.sourceUrl && (
                <div className="mt-3 flex justify-end">
                    <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline"
                    >
                        View on Reddit
                        <SquareArrowOutUpRight size={11} strokeWidth={2.5} />
                    </a>
                </div>
            )}

            <div className="absolute right-2 top-2">
                <DeleteTimelineItemButton itemId={item.id} />
            </div>
        </div>
    );
}
