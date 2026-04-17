import { notFound } from "next/navigation";

import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { FollowUpEditor } from "./FollowUpEditor";

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
        <div className="p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {woohoo.platform}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <h1 className="text-xl font-semibold">u/{woohoo.peerId}</h1>
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
                    <span className="text-sm text-muted-foreground">Follow up:</span>
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

            <div className="border-t border-border pt-6">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                    Timeline
                </h2>

                {woohoo.timeline.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No items yet.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {woohoo.timeline.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-lg border border-border bg-card p-4"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">
                                        {item.authorName ?? item.authorId}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(
                                            item.interactionAt,
                                        ).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>

                                <p className="text-sm text-foreground whitespace-pre-wrap">
                                    {item.contentText}
                                </p>

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-muted-foreground capitalize">
                                        via {woohoo.platform} {item.type}
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
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
