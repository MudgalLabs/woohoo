import Link from "next/link";
import { Woohoo, TimelineItem } from "@/app/generated/prisma/client";
import { PlatformIcon, peerHandle } from "@/components/PlatformIcon";
import { Avatar, AvatarFallback } from "@woohoo/ui";
import { cn } from "@/lib/utils";
import { dayDiffInTz } from "@/lib/date-tz";

export interface WoohooCounts {
    dm: number;
    comment: number;
}

interface WoohooCardProps {
    woohoo: Woohoo & { timeline: TimelineItem[] };
    counts?: WoohooCounts;
    variant?: "default" | "overdue";
    timezone: string;
}

export function followUpLabel(date: Date | string, tz: string): string {
    const target = typeof date === "string" ? new Date(date) : date;
    const diff = dayDiffInTz(target, new Date(), tz);
    if (diff === 0) return "Follow up today";
    if (diff === 1) return "Follow up tomorrow";
    if (diff === -1) return "Overdue yesterday";
    if (diff > 1) return `Follow up in ${diff}d`;
    return `Overdue by ${-diff}d`;
}

export function timeAgo(date: Date | string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export function peerInitial(platform: string, peerId: string): string {
    const handle = peerHandle(platform, peerId);
    const stripped = handle.replace(/^u\//, "").replace(/^@/, "");
    return (stripped[0] ?? "?").toUpperCase();
}

export function countsLabel(counts: WoohooCounts): string | null {
    const parts: string[] = [];
    if (counts.dm > 0) {
        parts.push(`${counts.dm} ${counts.dm === 1 ? "DM" : "DMs"}`);
    }
    if (counts.comment > 0) {
        parts.push(
            `${counts.comment} ${counts.comment === 1 ? "comment" : "comments"}`,
        );
    }
    return parts.length === 0 ? null : parts.join(" · ");
}

export function WoohooCard({
    woohoo,
    counts,
    variant = "default",
    timezone,
}: WoohooCardProps) {
    const latestItem = woohoo.timeline[0];
    const preview = latestItem?.contentText
        ? latestItem.contentText.length > 100
            ? latestItem.contentText.slice(0, 100) + "…"
            : latestItem.contentText
        : null;

    const handle = peerHandle(woohoo.platform, woohoo.peerId);
    const isOverdue = variant === "overdue";
    const label = counts ? countsLabel(counts) : null;

    return (
        <Link
            href={`/my-woohoos/${woohoo.id}`}
            className={cn(
                "group block rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80 hover:bg-accent/30",
                isOverdue && "border-l-4 border-l-destructive/80",
            )}
        >
            <div className="flex items-start gap-3">
                <Avatar className="h-9 w-9 mt-0.5">
                    <AvatarFallback className="text-xs font-medium text-muted-foreground">
                        {peerInitial(woohoo.platform, woohoo.peerId)}
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
                                {followUpLabel(woohoo.followUpAt, timezone)}
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
        </Link>
    );
}
