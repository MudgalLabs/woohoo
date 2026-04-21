import { notFound } from "next/navigation";
import {
    ExternalLink,
    MessageSquare,
    MessageSquareText,
    SquareArrowOutUpRight,
} from "lucide-react";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import {
    Avatar,
    AvatarFallback,
    CountBadge,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@woohoo/ui";
import {
    PlatformIcon,
    peerHandle,
    peerProfileUrl,
} from "@/components/PlatformIcon";
import {
    countsLabel,
    peerInitial,
    timeAgo,
    type WoohooCounts,
} from "../WoohooCard";
import type { TimelineItem } from "@/app/generated/prisma/client";
import { ArchiveWoohooButton } from "./ArchiveWoohooButton";
import { ChatBubble } from "./ChatBubble";
import { CommentCard } from "./CommentCard";
import { DeleteWoohooButton } from "./DeleteWoohooButton";
import { FollowUpEditor } from "./FollowUpEditor";
import { EmptyState } from "@/components/empty-state";
import { dayDiffInTz } from "@/lib/date-tz";

function dayLabel(date: Date, tz: string): string {
    const diffDays = dayDiffInTz(new Date(), date, tz);
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: tz,
    });
}

function sameDayInTz(a: Date, b: Date, tz: string): boolean {
    return dayDiffInTz(a, b, tz) === 0;
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

    const timezone = session!.user.timezone ?? "UTC";
    const dms = woohoo.timeline.filter((item) => item.type === "dm");
    const comments = woohoo.timeline.filter((item) => item.type === "comment");
    const counts: WoohooCounts = { dm: dms.length, comment: comments.length };
    const label = countsLabel(counts);
    const defaultTab =
        dms.length === 0 && comments.length > 0 ? "comments" : "messages";

    const profileUrl = peerProfileUrl(woohoo.platform, woohoo.peerId);
    const handle = peerHandle(woohoo.platform, woohoo.peerId);
    const initial = peerInitial(
        woohoo.platform,
        woohoo.peerName ?? woohoo.peerId,
    );

    return (
        <div className="w-full max-w-3xl mx-auto p-6 flex-1">
            <div className="rounded-lg border border-border bg-card p-5 mb-6">
                <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12 shrink-0">
                        <AvatarFallback className="text-base font-medium text-muted-foreground">
                            {initial}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <PlatformIcon
                                    platform={woohoo.platform}
                                    size={16}
                                />
                                {profileUrl ? (
                                    <a
                                        href={profileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group/name flex items-center gap-1.5 min-w-0 text-2xl font-semibold tracking-tight hover:underline"
                                    >
                                        <span className="truncate">
                                            {handle}
                                        </span>
                                        <SquareArrowOutUpRight
                                            size={13}
                                            strokeWidth={2.5}
                                            className="shrink-0 text-muted-foreground opacity-0 transition group-hover/name:opacity-100"
                                        />
                                    </a>
                                ) : (
                                    <h1 className="text-2xl font-semibold tracking-tight truncate">
                                        {handle}
                                    </h1>
                                )}
                            </div>
                            <div className="flex items-center gap-0.5 shrink-0">
                                <ArchiveWoohooButton
                                    woohooId={woohoo.id}
                                    archived={woohoo.archivedAt !== null}
                                />
                                <DeleteWoohooButton woohooId={woohoo.id} />
                            </div>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                            {woohoo.lastInteractionAt && (
                                <span>
                                    Last interaction{" "}
                                    {timeAgo(woohoo.lastInteractionAt)}
                                </span>
                            )}
                            {woohoo.chatUrl && (
                                <>
                                    {(label || woohoo.lastInteractionAt) && (
                                        <span aria-hidden>·</span>
                                    )}
                                    <a
                                        href={woohoo.chatUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-primary hover:underline"
                                    >
                                        Open chat
                                        <ExternalLink size={11} />
                                    </a>
                                </>
                            )}
                        </div>

                        <div className="mt-3">
                            <FollowUpEditor
                                woohooId={woohoo.id}
                                followUpAt={
                                    woohoo.followUpAt
                                        ? woohoo.followUpAt.toISOString()
                                        : null
                                }
                                timezone={timezone}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="messages">
                        DMs
                        {dms.length > 0 && (
                            <CountBadge className="ml-2" count={dms.length} />
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="comments">
                        Comments
                        {comments.length > 0 && (
                            <CountBadge
                                className="ml-2"
                                count={comments.length}
                            />
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="messages" className="mt-4">
                    <MessagesView
                        items={dms}
                        peerId={woohoo.peerId}
                        timezone={timezone}
                    />
                </TabsContent>

                <TabsContent value="comments" className="mt-4">
                    <CommentsView items={comments} peerId={woohoo.peerId} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function MessagesView({
    items,
    peerId,
    timezone,
}: {
    items: TimelineItem[];
    peerId: string;
    timezone: string;
}) {
    if (items.length === 0) {
        return (
            <EmptyState icon={MessageSquare}>
                No DMs yet. Save a DM using the extension to start the
                conversation.
            </EmptyState>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {items.map((item, idx) => {
                const prev = items[idx - 1];
                const showDayDivider =
                    !prev ||
                    !sameDayInTz(
                        new Date(prev.interactionAt),
                        new Date(item.interactionAt),
                        timezone,
                    );
                const isFromPeer = item.authorId === peerId;

                return (
                    <div key={item.id} className="contents">
                        {showDayDivider && (
                            <div className="flex justify-center my-2">
                                <span className="text-xs text-muted-foreground px-2">
                                    {dayLabel(
                                        new Date(item.interactionAt),
                                        timezone,
                                    )}
                                </span>
                            </div>
                        )}
                        <ChatBubble item={item} isFromPeer={isFromPeer} />
                    </div>
                );
            })}
        </div>
    );
}

function CommentsView({
    items,
    peerId,
}: {
    items: TimelineItem[];
    peerId: string;
}) {
    if (items.length === 0) {
        return (
            <EmptyState icon={MessageSquareText}>
                No comments saved yet. Save a comment using the extension to
                start the conversation.
            </EmptyState>
        );
    }

    const repliesByParent = new Map<string, TimelineItem[]>();
    for (const item of items) {
        if (item.parentId) {
            const arr = repliesByParent.get(item.parentId) ?? [];
            arr.push(item);
            repliesByParent.set(item.parentId, arr);
        }
    }
    const roots = items.filter((item) => !item.parentId);

    return (
        <div className="flex flex-col gap-3">
            {roots.map((root) => {
                const replies = (repliesByParent.get(root.id) ?? []).sort(
                    (a, b) =>
                        new Date(a.interactionAt).getTime() -
                        new Date(b.interactionAt).getTime(),
                );
                return (
                    <div key={root.id} className="flex flex-col gap-3">
                        <CommentCard
                            item={root}
                            isFromPeer={root.authorId === peerId}
                        />
                        {replies.map((reply) => (
                            <CommentCard
                                key={reply.id}
                                item={reply}
                                isFromPeer={reply.authorId === peerId}
                                isNested
                            />
                        ))}
                    </div>
                );
            })}
        </div>
    );
}
