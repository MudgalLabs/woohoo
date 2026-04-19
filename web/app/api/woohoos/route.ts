import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";

export async function GET(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const archivedParam = searchParams.get("archived");
    const archivedFilter =
        archivedParam === "true"
            ? { not: null }
            : archivedParam === "all"
              ? undefined
              : null;

    const woohoos = await prisma.woohoo.findMany({
        where: { userId: session.user.id, archivedAt: archivedFilter },
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
