import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";
import { Platform } from "@/app/generated/prisma/client";

export async function GET(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform");
    const peerId = searchParams.get("peerId");
    const externalId = searchParams.get("externalId");
    const ancestorExternalIds = searchParams.getAll("ancestorExternalIds");

    if (!platform || !peerId || !externalId) {
        return NextResponse.json({ error: "Missing required params" }, { status: 400 });
    }

    const platformKey = platform.toLowerCase() as keyof typeof Platform;
    if (!Platform[platformKey]) {
        return NextResponse.json({ saved: false });
    }

    // Look up by (userId, platform, externalId) — not peerId — because a
    // comment may have been threaded into a saved ancestor's Woohoo whose
    // peerId differs from the reply's own author.
    const item = await prisma.timelineItem.findFirst({
        where: {
            externalId,
            woohoo: {
                userId: session.user.id,
                platform: Platform[platformKey],
            },
        },
        select: { id: true, woohooId: true },
    });

    if (item) {
        return NextResponse.json({
            saved: true,
            woohooId: item.woohooId,
            timelineItemId: item.id,
        });
    }

    // Not saved — see if an ancestor is, so the UI can offer the override.
    for (const ancestorId of ancestorExternalIds) {
        const ancestorItem = await prisma.timelineItem.findFirst({
            where: {
                externalId: ancestorId,
                woohoo: {
                    userId: session.user.id,
                    platform: Platform[platformKey],
                },
            },
            select: {
                woohoo: {
                    select: { id: true, peerId: true, peerName: true },
                },
            },
        });
        if (ancestorItem) {
            return NextResponse.json({
                saved: false,
                ancestorMatch: {
                    woohooId: ancestorItem.woohoo.id,
                    peerId: ancestorItem.woohoo.peerId,
                    peerName: ancestorItem.woohoo.peerName,
                },
            });
        }
    }

    return NextResponse.json({ saved: false });
}
