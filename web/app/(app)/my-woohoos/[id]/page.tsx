import { notFound } from "next/navigation";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { FollowUpEditor } from "./FollowUpEditor";
import { DeleteWoohooButton } from "./DeleteWoohooButton";
import { DeleteTimelineItemButton } from "./DeleteTimelineItemButton";
import { ChatBubble } from "./ChatBubble";

function dayLabel(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round(
        (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function sameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

export const metadata = { title: "Woohoo" };

export default async function WoohooDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getSession();

    const woohoo = await prisma.woohoo.findFirst({
        where: { id, userId: session!.user.id },
        include: {
            timeline: { orderBy: { interactionAt: "asc" } },
        },
    });

    if (!woohoo) notFound();

    return (
        <div className="w-full max-w-3xl mx-auto p-6 border-x border-sidebar-border/50 flex-1">
            <div className="rounded-lg border border-border bg-card p-5 mb-6">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {woohoo.platform}
                        </span>
                        <span className="text-muted-foreground">·</span>
                        <h1 className="text-xl font-semibold">
                            u/{woohoo.peerId}
                        </h1>
                    </div>
                    <DeleteWoohooButton woohooId={woohoo.id} />
                </div>

                <p className="text-xs text-muted-foreground mb-3">
                    Created{" "}
                    {new Date(woohoo.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Follow up:
                    </span>
                    <FollowUpEditor
                        woohooId={woohoo.id}
                        followUpAt={
                            woohoo.followUpAt
                                ? woohoo.followUpAt.toISOString()
                                : null
                        }
                    />
                </div>
            </div>

            <div>
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                    Timeline
                </h2>

                {woohoo.timeline.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        No items yet.
                    </p>
                ) : (
                    <div className="flex flex-col gap-3">
                        {woohoo.timeline.map((item, idx) => {
                            const prev = woohoo.timeline[idx - 1];
                            const showDayDivider =
                                !prev ||
                                !sameDay(
                                    new Date(prev.interactionAt),
                                    new Date(item.interactionAt),
                                );
                            const isFromPeer = item.authorId === woohoo.peerId;

                            return (
                                <div
                                    key={item.id}
                                    className="flex flex-col gap-3"
                                >
                                    {showDayDivider && (
                                        <div className="flex justify-center my-2">
                                            <span className="text-xs text-muted-foreground px-2">
                                                {dayLabel(
                                                    new Date(item.interactionAt),
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {item.type === "dm" ? (
                                        <ChatBubble
                                            item={item}
                                            isFromPeer={isFromPeer}
                                        />
                                    ) : (
                                        <div className="rounded-lg border border-border bg-card p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">
                                                    {item.authorName ??
                                                        item.authorId}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs text-muted-foreground">
                                                        {new Date(
                                                            item.interactionAt,
                                                        ).toLocaleString(
                                                            "en-US",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                                hour: "numeric",
                                                                minute: "2-digit",
                                                            },
                                                        )}
                                                    </span>
                                                    <DeleteTimelineItemButton
                                                        itemId={item.id}
                                                    />
                                                </div>
                                            </div>

                                            <p className="text-sm text-foreground whitespace-pre-wrap">
                                                {item.contentText}
                                            </p>

                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-muted-foreground capitalize">
                                                    via {woohoo.platform}{" "}
                                                    {item.type}
                                                </span>

                                                {item.sourceUrl && (
                                                    <a
                                                        href={item.sourceUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-primary hover:underline"
                                                    >
                                                        View original ↗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
