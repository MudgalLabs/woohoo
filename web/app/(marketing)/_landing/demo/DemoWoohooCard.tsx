import type { Woohoo, TimelineItem } from "@/app/generated/prisma/client";
import { PlatformIcon, peerHandle } from "@/components/PlatformIcon";
import { Avatar, AvatarFallback } from "@woohoo/ui";
import { cn } from "@/lib/utils";
import {
    followUpLabel,
    timeAgo,
    peerInitial,
    countsLabel,
    type WoohooCounts,
} from "@/app/(app)/my-woohoos/WoohooCard";

/*
 * Visual mirror of web/app/(app)/my-woohoos/WoohooCard.tsx, minus the <Link>
 * wrapper so it's safe to render on a public landing page. Classes and
 * children must stay in sync with the real component on future UI changes.
 */
interface DemoWoohooCardProps {
    woohoo: Woohoo & { timeline: TimelineItem[] };
    counts?: WoohooCounts;
    variant?: "default" | "overdue";
}

export function DemoWoohooCard({
    woohoo,
    counts,
    variant = "default",
}: DemoWoohooCardProps) {
    const latestItem = woohoo.timeline[0];
    const preview = latestItem?.contentText
        ? latestItem.contentText.length > 100
            ? latestItem.contentText.slice(0, 100) + "…"
            : latestItem.contentText
        : null;

    const handle = peerHandle(woohoo.platform, woohoo.peerId, woohoo.peerName);
    const isOverdue = variant === "overdue";
    const label = counts ? countsLabel(counts) : null;

    return (
        <div
            className={cn(
                "block rounded-lg border border-border bg-card p-4 hover:bg-secondary-foreground",
                isOverdue && "border-l-4 border-l-destructive/80",
            )}
        >
            <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 mt-0.5">
                    <AvatarFallback className="text-xs font-medium text-muted-foreground">
                        {peerInitial(
                            woohoo.platform,
                            woohoo.peerId,
                            woohoo.peerName,
                        )}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                            <PlatformIcon
                                platform={woohoo.platform}
                                size={14}
                            />
                            <span className="text-sm font-semibold text-foreground truncate">
                                {handle}
                            </span>
                        </div>

                        {woohoo.followUpAt && (
                            <span
                                className={cn(
                                    "text-xs font-medium whitespace-nowrap shrink-0",
                                    isOverdue
                                        ? "text-destructive"
                                        : "text-primary",
                                )}
                            >
                                {followUpLabel(woohoo.followUpAt, "UTC")}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-muted-foreground italic mt-1 mb-2 line-clamp-2 min-h-10">
                        {preview ? <>&ldquo;{preview}&rdquo;</> : null}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {label && <span>{label}</span>}
                        {label && woohoo.lastSavedAt && (
                            <span aria-hidden>·</span>
                        )}
                        {woohoo.lastSavedAt && (
                            <span>Saved {timeAgo(woohoo.lastSavedAt)}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
