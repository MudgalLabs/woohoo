import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";
import {
    assertCanActivateWoohoo,
    PlanLimitError,
    getUserPlan,
} from "@/lib/plans";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const woohoo = await prisma.woohoo.findFirst({
        where: { id, userId: session.user.id },
        include: {
            timeline: {
                orderBy: { interactionAt: "asc" },
            },
        },
    });

    if (!woohoo) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ woohoo });
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = (await request.json()) as {
        followUpAt?: string | null;
        archived?: boolean;
    };

    const woohoo = await prisma.woohoo.findFirst({
        where: { id, userId: session.user.id },
    });

    if (!woohoo) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Unarchiving counts as activating — gate on plan limit.
    const isUnarchiving = body.archived === false && woohoo.archivedAt !== null;
    if (isUnarchiving) {
        try {
            await assertCanActivateWoohoo(session.user.id);
        } catch (err) {
            if (err instanceof PlanLimitError) {
                const plan = await getUserPlan(session.user.id);
                return NextResponse.json(
                    {
                        error: err.message,
                        code: "plan_limit_reached",
                        limit: err.limit,
                        planName: plan.name,
                    },
                    { status: 403 },
                );
            }
            throw err;
        }
    }

    const updated = await prisma.woohoo.update({
        where: { id },
        data: {
            followUpAt:
                body.followUpAt === null
                    ? null
                    : body.followUpAt
                      ? new Date(body.followUpAt)
                      : undefined,
            archivedAt:
                body.archived === undefined
                    ? undefined
                    : body.archived
                      ? new Date()
                      : null,
        },
    });

    return NextResponse.json({ woohoo: updated });
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const result = await prisma.woohoo.deleteMany({
        where: { id, userId: session.user.id },
    });

    if (result.count === 0) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
}
