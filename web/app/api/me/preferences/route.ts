import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";

export async function PATCH(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
        emailDigestEnabled?: unknown;
    };

    const data: { emailDigestEnabled?: boolean } = {};
    if (typeof body.emailDigestEnabled === "boolean") {
        data.emailDigestEnabled = body.emailDigestEnabled;
    }

    if (Object.keys(data).length === 0) {
        return NextResponse.json(
            { error: "No valid fields to update" },
            { status: 400 },
        );
    }

    const updated = await prisma.user.update({
        where: { id: session.user.id },
        data,
        select: { emailDigestEnabled: true },
    });

    return NextResponse.json({
        emailDigestEnabled: updated.emailDigestEnabled,
    });
}
