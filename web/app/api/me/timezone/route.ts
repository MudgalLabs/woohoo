import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";
import { isValidTimezone } from "@/lib/date-tz";

export async function PATCH(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const tz = (body as { timezone?: unknown })?.timezone;
    if (typeof tz !== "string" || !isValidTimezone(tz)) {
        return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
    }

    await prisma.user.update({
        where: { id: session.user.id },
        data: { timezone: tz },
    });

    return NextResponse.json({ timezone: tz });
}
