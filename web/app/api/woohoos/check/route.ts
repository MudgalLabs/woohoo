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

    if (!platform || !peerId || !externalId) {
        return NextResponse.json({ error: "Missing required params" }, { status: 400 });
    }

    const platformKey = platform.toLowerCase() as keyof typeof Platform;
    if (!Platform[platformKey]) {
        return NextResponse.json({ saved: false });
    }

    const woohoo = await prisma.woohoo.findUnique({
        where: {
            userId_platform_peerId: {
                userId: session.user.id,
                platform: Platform[platformKey],
                peerId,
            },
        },
        select: { id: true },
    });

    if (!woohoo) {
        return NextResponse.json({ saved: false });
    }

    const item = await prisma.timelineItem.findUnique({
        where: {
            woohooId_externalId: {
                woohooId: woohoo.id,
                externalId,
            },
        },
        select: { id: true },
    });

    return NextResponse.json({
        saved: !!item,
        woohooId: item ? woohoo.id : undefined,
        timelineItemId: item?.id,
    });
}
