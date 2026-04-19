import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/get-session-from-request";
import { Platform, TimelineItemType } from "@/app/generated/prisma/client";
import {
    assertCanActivateWoohoo,
    PlanLimitError,
    getUserPlan,
} from "@/lib/plans";

interface SaveItemBody {
    platform: string;
    peerId: string;
    chatUrl?: string;
    followUpAt?: string;
    ancestorExternalIds?: string[];
    founderExternalId?: string;
    item: {
        type: string;
        externalId: string;
        contentText: string;
        contentHtml?: string;
        sourceUrl?: string;
        authorId: string;
        authorName?: string;
        interactionAt: string;
    };
}

export async function POST(request: Request) {
    const session = await getSessionFromRequest(request);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as SaveItemBody;
    const { platform, peerId, chatUrl, followUpAt, ancestorExternalIds, founderExternalId, item } = body;

    if (!platform || !peerId || !item?.externalId || !item?.contentText) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const platformValue = platform.toLowerCase() as keyof typeof Platform;
    if (!Platform[platformValue]) {
        return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const interactionAt = new Date(item.interactionAt);
    const now = new Date();

    // Routing rule for comments: only thread into an ancestor's Woohoo
    // when this comment is authored by the logged-in founder (i.e. "me
    // replying inside a lead's thread"). Everything else — peer-authored
    // comments, and founder comments with no saved peer ancestor — falls
    // through to the upsert-by-peerId branch below.
    let woohoo = null as Awaited<ReturnType<typeof prisma.woohoo.upsert>> | null;
    const isFounderAuthored =
        !!founderExternalId && item.authorId === founderExternalId;

    // Pre-resolve the target Woohoo before any writes so we can gate
    // plan-limit activations (new Woohoos + unarchive-via-save).
    let ancestorMatchId: string | null = null;
    let ancestorMatchArchived = false;
    if (
        item.type === "comment" &&
        isFounderAuthored &&
        ancestorExternalIds &&
        ancestorExternalIds.length > 0
    ) {
        for (const ancestorId of ancestorExternalIds) {
            const match = await prisma.timelineItem.findFirst({
                where: {
                    externalId: ancestorId,
                    woohoo: {
                        userId: session.user.id,
                        platform: Platform[platformValue],
                    },
                },
                include: { woohoo: true },
            });
            if (match) {
                ancestorMatchId = match.woohoo.id;
                ancestorMatchArchived = match.woohoo.archivedAt !== null;
                break;
            }
        }
    }

    const existingByPeer = ancestorMatchId
        ? null
        : await prisma.woohoo.findUnique({
              where: {
                  userId_platform_peerId: {
                      userId: session.user.id,
                      platform: Platform[platformValue],
                      peerId,
                  },
              },
          });

    const willActivate = ancestorMatchId
        ? ancestorMatchArchived
        : existingByPeer
          ? existingByPeer.archivedAt !== null
          : true;

    if (willActivate) {
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

    if (ancestorMatchId) {
        woohoo = await prisma.woohoo.update({
            where: { id: ancestorMatchId },
            data: {
                ...(chatUrl ? { chatUrl } : {}),
                ...(followUpAt !== undefined
                    ? { followUpAt: followUpAt ? new Date(followUpAt) : null }
                    : {}),
                lastSavedAt: now,
                archivedAt: null,
            },
        });
    }

    if (!woohoo) {
        woohoo = await prisma.woohoo.upsert({
            where: {
                userId_platform_peerId: {
                    userId: session.user.id,
                    platform: Platform[platformValue],
                    peerId,
                },
            },
            create: {
                userId: session.user.id,
                platform: Platform[platformValue],
                peerId,
                chatUrl: chatUrl ?? null,
                followUpAt: followUpAt ? new Date(followUpAt) : null,
                lastInteractionAt: interactionAt,
                lastSavedAt: now,
            },
            update: {
                ...(chatUrl ? { chatUrl } : {}),
                ...(followUpAt !== undefined ? { followUpAt: followUpAt ? new Date(followUpAt) : null } : {}),
                lastSavedAt: now,
                archivedAt: null,
            },
        });
    }

    const existing = item.externalId
        ? await prisma.timelineItem.findUnique({
              where: {
                  woohooId_externalId: {
                      woohooId: woohoo.id,
                      externalId: item.externalId,
                  },
              },
          })
        : null;

    if (existing) {
        return NextResponse.json({ woohoo, timelineItem: existing });
    }

    const itemType = item.type === "comment" ? TimelineItemType.comment : TimelineItemType.dm;

    const timelineItem = await prisma.timelineItem.create({
        data: {
            woohooId: woohoo.id,
            type: itemType,
            externalId: item.externalId,
            contentText: item.contentText,
            contentHtml: item.contentHtml ?? null,
            sourceUrl: item.sourceUrl ?? null,
            authorId: item.authorId,
            authorName: item.authorName ?? null,
            interactionAt,
        },
    });

    const { _max } = await prisma.timelineItem.aggregate({
        where: { woohooId: woohoo.id },
        _max: { interactionAt: true },
    });
    if (
        _max.interactionAt &&
        _max.interactionAt.getTime() !== woohoo.lastInteractionAt?.getTime()
    ) {
        woohoo = await prisma.woohoo.update({
            where: { id: woohoo.id },
            data: { lastInteractionAt: _max.interactionAt },
        });
    }

    return NextResponse.json({ woohoo, timelineItem });
}
