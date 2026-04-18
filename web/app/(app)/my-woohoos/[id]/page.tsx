import { notFound } from "next/navigation";
import { ExternalLink, SquareArrowOutUpRight } from "lucide-react";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import {
    Avatar,
    AvatarFallback,
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
import { ChatBubble } from "./ChatBubble";
import { CommentCard } from "./CommentCard";
import { DeleteWoohooButton } from "./DeleteWoohooButton";
import { FollowUpEditor } from "./FollowUpEditor";

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

    const dms = woohoo.timeline.filter((item) => item.type === "dm");
    const comments = woohoo.timeline.filter((item) => item.type === "comment");
    const counts: WoohooCounts = { dm: dms.length, comment: comments.length };
    const label = countsLabel(counts);
    const defaultTab = dms.length === 0 && comments.length > 0
        ? "comments"
        : "messages";

    const profileUrl = peerProfileUrl(woohoo.platform, woohoo.peerId);
    const handle = peerHandle(woohoo.platform, woohoo.peerId);
    const initial = peerInitial(
        woohoo.platform,
        woohoo.peerName ?? woohoo.peerId,
    );

    return (
        <div className="w-full max-w-3xl mx-auto p-6 border-x border-sidebar-border/50 flex-1">
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
                                        className="group/name flex items-center gap-1.5 min-w-0 text-xl font-semibold hover:underline"
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
                                    <h1 className="text-xl font-semibold truncate">
                                        {handle}
                                    </h1>
                                )}
                            </div>
                            <DeleteWoohooButton woohooId={woohoo.id} />
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                            {label && <span>{label}</span>}
                            {label && woohoo.lastInteractionAt && (
                                <span aria-hidden>·</span>
                            )}
                            {woohoo.lastInteractionAt && (
                                <span>
                                    Last interaction{" "}
                                    {timeAgo(woohoo.lastInteractionAt)}
                                </span>
                            )}
                            {woohoo.chatUrl && (
                                <>
                                    <span aria-hidden>·</span>
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
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="messages">
                        Messages
                        {dms.length > 0 && (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                                {dms.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="comments">
                        Comments
                        {comments.length > 0 && (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                                {comments.length}
                            </span>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="messages" className="mt-4">
                    <MessagesView items={dms} peerId={woohoo.peerId} />
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
}: {
    items: TimelineItem[];
    peerId: string;
}) {
    if (items.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-8 text-center">
                No messages yet. Save a Reddit DM from the extension to start
                the conversation.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {items.map((item, idx) => {
                const prev = items[idx - 1];
                const showDayDivider =
                    !prev ||
                    !sameDay(
                        new Date(prev.interactionAt),
                        new Date(item.interactionAt),
                    );
                const isFromPeer = item.authorId === peerId;

                return (
                    <div key={item.id} className="contents">
                        {showDayDivider && (
                            <div className="flex justify-center my-2">
                                <span className="text-xs text-muted-foreground px-2">
                                    {dayLabel(new Date(item.interactionAt))}
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
            <p className="text-sm text-muted-foreground py-8 text-center">
                No comments saved yet. Save a Reddit comment from this peer
                using the extension.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {items.map((item) => (
                <CommentCard
                    key={item.id}
                    item={item}
                    isFromPeer={item.authorId === peerId}
                />
            ))}
        </div>
    );
}
