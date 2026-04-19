import type { Woohoo, TimelineItem } from "@/app/generated/prisma/client";

/*
 * Mock data for the landing page. Types mirror the Prisma models exactly so
 * demo components accept them with no type gymnastics.
 */

type MockWoohoo = Woohoo & { timeline: TimelineItem[] };

function daysFromNow(n: number): Date {
    const d = new Date();
    d.setHours(9, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return d;
}

function hoursAgo(n: number): Date {
    return new Date(Date.now() - n * 60 * 60 * 1000);
}

function daysAgo(n: number): Date {
    return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

let idCounter = 0;
function mockId(prefix: string): string {
    idCounter += 1;
    return `${prefix}_${idCounter}`;
}

export function mockTimelineItem(
    overrides: Partial<TimelineItem> = {},
): TimelineItem {
    const now = new Date();
    return {
        id: mockId("tl"),
        woohooId: "woohoo_demo",
        type: "dm",
        externalId: null,
        contentText: "",
        contentHtml: null,
        sourceUrl: null,
        authorId: "indie_marketer",
        authorName: null,
        interactionAt: now,
        savedAt: now,
        ...overrides,
    };
}

export function mockWoohoo(overrides: Partial<MockWoohoo> = {}): MockWoohoo {
    const now = new Date();
    const base: MockWoohoo = {
        id: mockId("woohoo"),
        userId: "demo_user",
        platform: "reddit",
        peerId: "indie_marketer",
        peerName: null,
        chatUrl: null,
        followUpAt: null,
        lastInteractionAt: hoursAgo(2),
        lastSavedAt: hoursAgo(2),
        archivedAt: null,
        createdAt: now,
        updatedAt: now,
        timeline: [],
    };
    return { ...base, ...overrides };
}

/* ============== Hero post-save card ============== */

export const getHeroWoohoo = (): MockWoohoo =>
    mockWoohoo({
        peerId: "indie_marketer",
        followUpAt: daysFromNow(3),
        lastSavedAt: new Date(),
        lastInteractionAt: hoursAgo(2),
        timeline: [
            mockTimelineItem({
                contentText:
                    "Hey — saw your comment in r/SaaS. I'll try Woohoo this weekend and send feedback, my team's drowning in Reddit leads rn. Also — do you support LinkedIn?",
                interactionAt: hoursAgo(2),
            }),
        ],
    });

/* ============== How It Works — step 2 mini-thread ============== */

export const stepTwoMessages: Array<{
    item: TimelineItem;
    isFromPeer: boolean;
}> = [
    {
        item: mockTimelineItem({
            contentText: "does it do X?",
            interactionAt: hoursAgo(5),
        }),
        isFromPeer: true,
    },
    {
        item: mockTimelineItem({
            contentText: "yes — shipping this weekend",
            interactionAt: hoursAgo(4),
            authorId: "you",
        }),
        isFromPeer: false,
    },
];

/* ============== How It Works — step 3 follow-up chip ============== */

export const stepThreeFollowUp = daysFromNow(0);

/* ============== ThreadMock — interactive tabs demo ============== */

export const threadWoohoo = {
    id: "demo_thread",
    platform: "reddit" as const,
    peerId: "indie_marketer",
    peerName: null,
    chatUrl: "https://www.reddit.com/message/messages/demo",
    followUpAt: daysFromNow(3),
    lastInteractionAt: hoursAgo(13),
    lastSavedAt: hoursAgo(1),
};

export const threadDms: TimelineItem[] = [
    mockTimelineItem({
        contentText:
            "hey — yeah please ping me. I'll try Woohoo this weekend btw, my team is drowning in Reddit leads rn",
        interactionAt: hoursAgo(50),
    }),
    mockTimelineItem({
        contentText:
            "amazing. here's a link w/ a longer free trial for you → woohoo.to/friend",
        interactionAt: hoursAgo(49),
        authorId: "you",
    }),
    mockTimelineItem({
        contentText: "🙏 will report back Sun",
        interactionAt: hoursAgo(49),
    }),
];

export const threadComments: TimelineItem[] = [
    mockTimelineItem({
        type: "comment",
        contentText:
            "this is exactly the thing I've been looking for, does it handle LinkedIn?",
        sourceUrl:
            "https://reddit.com/r/SaaS/comments/demo/how_do_you_track_dms",
        interactionAt: daysAgo(5),
    }),
    mockTimelineItem({
        type: "comment",
        contentText:
            "not yet — Reddit-only for now, LinkedIn's on the roadmap. want me to ping you when it ships?",
        sourceUrl:
            "https://reddit.com/r/SaaS/comments/demo/how_do_you_track_dms",
        interactionAt: daysAgo(5),
        authorId: "you",
    }),
];

/* ============== Landing dashboard — three piles ============== */

export const dashboardToday: MockWoohoo[] = [
    mockWoohoo({
        peerId: "indie_marketer",
        followUpAt: daysFromNow(0),
        lastSavedAt: hoursAgo(20),
        lastInteractionAt: hoursAgo(20),
        timeline: [
            mockTimelineItem({
                contentText:
                    "Hey — saw your comment in r/SaaS. I'll try Woohoo this weekend and send feedback, my team's drowning in Reddit leads rn. Also — do you support LinkedIn?",
                interactionAt: hoursAgo(20),
            }),
        ],
    }),
    mockWoohoo({
        peerId: "product_nerd",
        followUpAt: daysFromNow(0),
        lastSavedAt: hoursAgo(30),
        lastInteractionAt: hoursAgo(30),
        timeline: [
            mockTimelineItem({
                contentText:
                    "what's the pricing for teams? we'd be 4 seats to start.",
                interactionAt: hoursAgo(30),
            }),
        ],
    }),
    mockWoohoo({
        peerId: "ship_it_pls",
        followUpAt: daysFromNow(0),
        lastSavedAt: hoursAgo(48),
        lastInteractionAt: hoursAgo(48),
        timeline: [
            mockTimelineItem({
                contentText:
                    "when does the LinkedIn integration ship? asking bc that's my main channel.",
                interactionAt: hoursAgo(48),
            }),
        ],
    }),
];

export const dashboardOverdue: MockWoohoo[] = [
    mockWoohoo({
        peerId: "redditlurker42",
        followUpAt: daysAgo(4),
        lastSavedAt: daysAgo(6),
        lastInteractionAt: daysAgo(6),
        timeline: [
            mockTimelineItem({
                contentText: "I'll try it Sunday and let you know",
                interactionAt: daysAgo(6),
            }),
        ],
    }),
    mockWoohoo({
        peerId: "marketer_mike",
        followUpAt: daysAgo(2),
        lastSavedAt: daysAgo(4),
        lastInteractionAt: daysAgo(4),
        timeline: [
            mockTimelineItem({
                contentText:
                    "interested in a cross-promo swap — we have ~2k weekly active users.",
                interactionAt: daysAgo(4),
            }),
        ],
    }),
    mockWoohoo({
        peerId: "nothankyou",
        followUpAt: daysAgo(1),
        lastSavedAt: daysAgo(3),
        lastInteractionAt: daysAgo(3),
        timeline: [
            mockTimelineItem({
                contentText:
                    "feature req: can we tag people with custom labels? e.g. 'beta-user', 'press'.",
                interactionAt: daysAgo(3),
            }),
        ],
    }),
];

export const dashboardCold: MockWoohoo[] = [
    mockWoohoo({
        peerId: "jane_builds",
        followUpAt: null,
        lastSavedAt: daysAgo(10),
        lastInteractionAt: daysAgo(10),
        timeline: [
            mockTimelineItem({
                contentText: "cool product. will check it out later this week.",
                interactionAt: daysAgo(10),
            }),
        ],
    }),
    mockWoohoo({
        peerId: "devdan",
        followUpAt: null,
        lastSavedAt: daysAgo(14),
        lastInteractionAt: daysAgo(14),
        timeline: [
            mockTimelineItem({
                contentText:
                    "we're evaluating a few tools. I'll DM if we need more info.",
                interactionAt: daysAgo(14),
            }),
        ],
    }),
    mockWoohoo({
        peerId: "fromscratch",
        followUpAt: null,
        lastSavedAt: daysAgo(19),
        lastInteractionAt: daysAgo(19),
        timeline: [
            mockTimelineItem({
                contentText:
                    "your extension looks great — does it support self-host?",
                interactionAt: daysAgo(19),
            }),
        ],
    }),
];

export const dashboardCounts = {
    todayCount: dashboardToday.length,
    overdueCount: dashboardOverdue.length,
    coldCount: dashboardCold.length,
};
