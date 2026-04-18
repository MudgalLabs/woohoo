import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const target = await prisma.timelineItem.findFirst({
        where: { id, woohoo: { userId: session.user.id } },
        select: { id: true, woohooId: true },
    });

    if (!target) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.timelineItem.delete({ where: { id: target.id } });

    const { _max } = await prisma.timelineItem.aggregate({
        where: { woohooId: target.woohooId },
        _max: { interactionAt: true },
    });
    await prisma.woohoo.update({
        where: { id: target.woohooId },
        data: { lastInteractionAt: _max.interactionAt ?? null },
    });

    return NextResponse.json({ ok: true });
}
