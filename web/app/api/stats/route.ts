import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";
import { endOfDayInTz, startOfDayInTz } from "@/lib/date-tz";

export async function GET(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const timezone =
        (session.user as { timezone?: string | null }).timezone ?? "UTC";

    const now = new Date();
    const startOfToday = startOfDayInTz(now, timezone);
    const endOfToday = endOfDayInTz(now, timezone);

    const [totalWoohoos, followUpToday] = await Promise.all([
        prisma.woohoo.count({ where: { userId, archivedAt: null } }),
        prisma.woohoo.count({
            where: {
                userId,
                archivedAt: null,
                followUpAt: { gte: startOfToday, lte: endOfToday },
            },
        }),
    ]);

    return NextResponse.json({ totalWoohoos, followUpToday });
}
