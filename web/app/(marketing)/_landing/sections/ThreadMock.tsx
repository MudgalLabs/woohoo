"use client";

import { ExternalLink, SquareArrowOutUpRight } from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@woohoo/ui";
import { PlatformIcon, peerHandle } from "@/components/PlatformIcon";
import { peerInitial, timeAgo } from "@/app/(app)/my-woohoos/WoohooCard";

import { DemoChatBubble } from "../demo/DemoChatBubble";
import { DemoCommentCard } from "../demo/DemoCommentCard";
import { DemoFollowUpChip } from "../demo/DemoFollowUpChip";
import { threadWoohoo, threadDms, threadComments } from "../demo/mocks";

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

export function ThreadMock() {
    const handle = peerHandle(threadWoohoo.platform, threadWoohoo.peerId);
    const initial = peerInitial(threadWoohoo.platform, threadWoohoo.peerId);
    const totalInteractions = threadDms.length + threadComments.length;

    return (
        <section
            className="section"
            id="product"
            style={{
                background: "var(--bg-2)",
                borderTop: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
            }}
        >
            <div className="wrap">
                <div className="section-head">
                    <div className="eyebrow">
                        <span className="dot">●</span> the Woohoo detail view
                    </div>
                    <div style={{ height: 14 }} />
                    <h2>
                        Every person,{" "}
                        <span className="italic-serif">one</span> place.
                    </h2>
                    <p>
                        Open a Woohoo and you see the whole relationship — DMs
                        on one tab, comments on another, follow-up front and
                        center.
                    </p>
                </div>

                <div className="thread-frame">
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
                                            platform={threadWoohoo.platform}
                                            size={16}
                                        />
                                        <span className="text-2xl font-semibold tracking-tight truncate">
                                            {handle}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                                    <span>
                                        {threadDms.length} DMs ·{" "}
                                        {threadComments.length} comments
                                    </span>
                                    <span aria-hidden>·</span>
                                    <span>
                                        Last interaction{" "}
                                        {timeAgo(threadWoohoo.lastInteractionAt)}
                                    </span>
                                    <span aria-hidden>·</span>
                                    <a
                                        href="#"
                                        className="flex items-center gap-1 text-primary hover:underline"
                                    >
                                        Open chat
                                        <ExternalLink size={11} />
                                    </a>
                                </div>

                                <div className="mt-3">
                                    <DemoFollowUpChip
                                        followUpAt={threadWoohoo.followUpAt}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="messages" className="w-full">
                        <TabsList>
                            <TabsTrigger value="messages">
                                Messages
                                {threadDms.length > 0 && (
                                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary/20 px-1.5 text-xs font-medium text-secondary-foreground">
                                        {threadDms.length}
                                    </span>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="comments">
                                Comments
                                {threadComments.length > 0 && (
                                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary/20 px-1.5 text-xs font-medium text-secondary-foreground">
                                        {threadComments.length}
                                    </span>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="messages" className="mt-4">
                            <div className="flex flex-col gap-3">
                                {threadDms.map((item, idx) => {
                                    const prev = threadDms[idx - 1];
                                    const showDayDivider =
                                        !prev ||
                                        !sameDay(
                                            new Date(prev.interactionAt),
                                            new Date(item.interactionAt),
                                        );
                                    const isFromPeer =
                                        item.authorId === threadWoohoo.peerId;
                                    return (
                                        <div key={item.id} className="contents">
                                            {showDayDivider && (
                                                <div className="flex justify-center my-2">
                                                    <span className="text-xs text-muted-foreground px-2">
                                                        {dayLabel(
                                                            new Date(
                                                                item.interactionAt,
                                                            ),
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <DemoChatBubble
                                                item={item}
                                                isFromPeer={isFromPeer}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </TabsContent>

                        <TabsContent value="comments" className="mt-4">
                            <div className="flex flex-col gap-3">
                                {threadComments.map((item) => (
                                    <DemoCommentCard
                                        key={item.id}
                                        item={item}
                                        isFromPeer={
                                            item.authorId ===
                                            threadWoohoo.peerId
                                        }
                                    />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <p className="thread-caption">
                        {totalInteractions} saved interactions with {handle}.
                        One click back to the original Reddit post or DM.
                        <span className="inline-flex items-center gap-1 ml-1">
                            <SquareArrowOutUpRight size={11} strokeWidth={2} />
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}
