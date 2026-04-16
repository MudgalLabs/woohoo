import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";
import { Platform, TimelineItemType } from "@/app/generated/prisma/client";

interface SaveItemBody {
    platform: string;
    peerId: string;
    chatUrl?: string;
    followUpAt?: string;
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
    const { platform, peerId, chatUrl, followUpAt, item } = body;

    if (!platform || !peerId || !item?.externalId || !item?.contentText) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const platformValue = platform.toLowerCase() as keyof typeof Platform;
    if (!Platform[platformValue]) {
        return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const interactionAt = new Date(item.interactionAt);
    const now = new Date();

    const woohoo = await prisma.woohoo.upsert({
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
            lastInteractionAt: interactionAt,
            lastSavedAt: now,
        },
    });

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

    return NextResponse.json({ woohoo, timelineItem });
}
