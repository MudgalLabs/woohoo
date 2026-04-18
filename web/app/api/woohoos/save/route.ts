import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";
import { Platform, TimelineItemType } from "@/app/generated/prisma/client";

interface SaveItemBody {
    platform: string;
    peerId: string;
    chatUrl?: string;
    followUpAt?: string;
    ancestorExternalIds?: string[];
    forceNewWoohoo?: boolean;
    item: {
        type: string;
        externalId: string;
        contentText: string;
        contentHtml?: string;
        sourceUrl?: string;
        authorId: string;
        authorName?: string;
        interactionAt: string;
    };
}

export async function POST(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as SaveItemBody;
    const { platform, peerId, chatUrl, followUpAt, ancestorExternalIds, forceNewWoohoo, item } = body;

    if (!platform || !peerId || !item?.externalId || !item?.contentText) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const platformValue = platform.toLowerCase() as keyof typeof Platform;
    if (!Platform[platformValue]) {
        return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const interactionAt = new Date(item.interactionAt);
    const now = new Date();

    // If this comment is a reply to an already-saved ancestor, thread it
    // into that ancestor's Woohoo instead of creating one for the reply's
    // author. Iterates nearest-first so the closest saved ancestor wins.
    let woohoo = null as Awaited<ReturnType<typeof prisma.woohoo.upsert>> | null;
    if (
        item.type === "comment" &&
        !forceNewWoohoo &&
        ancestorExternalIds &&
        ancestorExternalIds.length > 0
    ) {
        for (const ancestorId of ancestorExternalIds) {
            const match = await prisma.timelineItem.findFirst({
                where: {
                    externalId: ancestorId,
                    woohoo: {
                        userId: session.user.id,
                        platform: Platform[platformValue],
                    },
                },
                include: { woohoo: true },
            });
            if (match) {
                woohoo = await prisma.woohoo.update({
                    where: { id: match.woohoo.id },
                    data: {
                        ...(chatUrl ? { chatUrl } : {}),
                        ...(followUpAt !== undefined
                            ? { followUpAt: followUpAt ? new Date(followUpAt) : null }
                            : {}),
                        lastSavedAt: now,
                    },
                });
                break;
            }
        }
    }

    if (!woohoo) {
        woohoo = await prisma.woohoo.upsert({
            where: {
                userId_platform_peerId: {
                    userId: session.user.id,
                    platform: Platform[platformValue],
                    peerId,
                },
            },
            create: {
                userId: session.user.id,
                platform: Platform[platformValue],
                peerId,
                chatUrl: chatUrl ?? null,
                followUpAt: followUpAt ? new Date(followUpAt) : null,
                lastInteractionAt: interactionAt,
                lastSavedAt: now,
            },
            update: {
                ...(chatUrl ? { chatUrl } : {}),
                ...(followUpAt !== undefined ? { followUpAt: followUpAt ? new Date(followUpAt) : null } : {}),
                lastSavedAt: now,
            },
        });
    }

    const existing = item.externalId
        ? await prisma.timelineItem.findUnique({
              where: {
                  woohooId_externalId: {
                      woohooId: woohoo.id,
                      externalId: item.externalId,
                  },
              },
          })
        : null;

    if (existing) {
        return NextResponse.json({ woohoo, timelineItem: existing });
    }

    const itemType = item.type === "comment" ? TimelineItemType.comment : TimelineItemType.dm;

    const timelineItem = await prisma.timelineItem.create({
        data: {
            woohooId: woohoo.id,
            type: itemType,
            externalId: item.externalId,
            contentText: item.contentText,
            contentHtml: item.contentHtml ?? null,
            sourceUrl: item.sourceUrl ?? null,
            authorId: item.authorId,
            authorName: item.authorName ?? null,
            interactionAt,
        },
    });

    const { _max } = await prisma.timelineItem.aggregate({
        where: { woohooId: woohoo.id },
        _max: { interactionAt: true },
    });
    if (
        _max.interactionAt &&
        _max.interactionAt.getTime() !== woohoo.lastInteractionAt?.getTime()
    ) {
        woohoo = await prisma.woohoo.update({
            where: { id: woohoo.id },
            data: { lastInteractionAt: _max.interactionAt },
        });
    }

    return NextResponse.json({ woohoo, timelineItem });
}
