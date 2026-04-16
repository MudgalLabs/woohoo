import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";

export async function GET(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const woohoos = await prisma.woohoo.findMany({
        where: { userId: session.user.id },
        orderBy: { lastSavedAt: "desc" },
        include: {
            timeline: {
                orderBy: { interactionAt: "desc" },
                take: 1,
            },
        },
    });

    return NextResponse.json({ woohoos });
}
