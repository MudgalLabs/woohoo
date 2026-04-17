import Link from "next/link";
import { Woohoo, TimelineItem } from "@/app/generated/prisma/client";

interface WoohooCardProps {
    woohoo: Woohoo & { timeline: TimelineItem[] };
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function timeAgo(date: Date | string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export function WoohooCard({ woohoo }: WoohooCardProps) {
    const latestItem = woohoo.timeline[0];
    const preview = latestItem?.contentText
        ? latestItem.contentText.length > 100
            ? latestItem.contentText.slice(0, 100) + "…"
            : latestItem.contentText
        : null;

    return (
        <Link
            href={`/my-woohoos/${woohoo.id}`}
            className="block rounded-lg border border-border bg-card p-4"
        >
            <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {woohoo.platform}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-sm font-medium text-foreground truncate">
                        u/{woohoo.peerId}
                    </span>
                </div>

                {woohoo.followUpAt && (
                    <span className="text-xs text-primary font-medium whitespace-nowrap shrink-0">
                        Follow up {formatDate(woohoo.followUpAt)}
                    </span>
                )}
            </div>

            <p className="text-sm text-muted-foreground italic mt-1 mb-2 line-clamp-2 min-h-[2.5rem]">
                {preview ? <>&ldquo;{preview}&rdquo;</> : null}
            </p>

            {woohoo.lastSavedAt && (
                <p className="text-xs text-muted-foreground">
                    Saved {timeAgo(woohoo.lastSavedAt)}
                </p>
            )}
        </Link>
    );
}
