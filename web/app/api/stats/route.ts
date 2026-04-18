import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";

export async function GET(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const now = new Date();
    const startOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
    );
    const endOfToday = new Date(
        startOfToday.getTime() + 24 * 60 * 60 * 1000 - 1,
    );

    const [totalWoohoos, followUpToday] = await Promise.all([
        prisma.woohoo.count({ where: { userId } }),
        prisma.woohoo.count({
            where: {
                userId,
                followUpAt: { gte: startOfToday, lte: endOfToday },
            },
        }),
    ]);

    return NextResponse.json({ totalWoohoos, followUpToday });
}
