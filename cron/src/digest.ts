import { Resend } from "resend";
import { render } from "@react-email/render";

import { prisma } from "./prisma";
import { FollowUpDigest } from "./emails/FollowUpDigest";
import { signUnsubscribeToken } from "../../web/lib/unsubscribe";
import { startOfDayInTz, wallClockInTzToUtc } from "../../web/lib/date-tz";
import { sendDigestNotification } from "../../web/lib/bodhveda";

// Lazy so env vars don't need to be resolved at module load — lets us import
// digest.ts from scripts that haven't called dotenv.config yet.
let _resend: Resend | null = null;
function getResend(): Resend {
    if (!_resend) {
        const key = process.env.RESEND_API_KEY;
        if (!key) throw new Error("RESEND_API_KEY is not set");
        _resend = new Resend(key);
    }
    return _resend;
}
const FROM_EMAIL = () =>
    process.env.RESEND_FROM_EMAIL || "Woohoo <hey@woohoo.to>";
const BASE_URL = () => process.env.BETTER_AUTH_URL || "https://woohoo.to";

function localDateString(date: Date, tz: string): string {
    // en-CA formats as YYYY-MM-DD which matches DigestLog.localDate
    const fmt = new Intl.DateTimeFormat("en-CA", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return fmt.format(date);
}

function userLocal8amAsUtc(now: Date, tz: string): Date {
    const [yStr, mStr, dStr] = localDateString(now, tz).split("-");
    return wallClockInTzToUtc(
        tz,
        Number(yStr),
        Number(mStr),
        Number(dStr),
        8,
        0,
        0,
    );
}

type EligibleUser = {
    id: string;
    name: string;
    email: string;
    timezone: string | null;
    emailDigestEnabled: boolean;
    inAppDigestEnabled: boolean;
    isPro: boolean;
};

// Users with at least one deliverable digest medium today, whose local 8am
// has already passed (within the last 12 hours — caps catch-up if cron has
// been down for longer), and who don't already have a DigestLog row for
// today in their timezone.
//
// Delivery rules:
//   - in-app: gated by `inAppDigestEnabled` (free + pro)
//   - email: gated by `emailDigestEnabled && isPro` (double-gate: user
//     preference AND plan tier — so a Pro-downgrade-to-free stops email
//     even if the preference flag wasn't flipped)
export async function findEligibleUsers(now: Date): Promise<EligibleUser[]> {
    const candidates = await prisma.user.findMany({
        where: {
            email: { not: "" },
            OR: [
                { emailDigestEnabled: true },
                { inAppDigestEnabled: true },
            ],
        },
        select: {
            id: true,
            name: true,
            email: true,
            timezone: true,
            emailDigestEnabled: true,
            inAppDigestEnabled: true,
            subscription: {
                select: {
                    status: true,
                    plan: { select: { tier: true } },
                },
            },
        },
    });

    const eligible: EligibleUser[] = [];
    const MAX_LATE_MS = 12 * 60 * 60 * 1000;

    for (const c of candidates) {
        const isPro =
            c.subscription?.plan.tier === "pro" &&
            c.subscription?.status !== "canceled";

        // Skip users with nothing deliverable today (e.g. free user with
        // only emailDigestEnabled). Avoids claiming a DigestLog row for a
        // no-op.
        const canSendEmail = c.emailDigestEnabled && isPro;
        const canSendInApp = c.inAppDigestEnabled;
        if (!canSendEmail && !canSendInApp) continue;

        const tz = c.timezone ?? "UTC";
        const local8am = userLocal8amAsUtc(now, tz);
        if (local8am > now) continue; // 8am hasn't hit yet
        if (now.getTime() - local8am.getTime() > MAX_LATE_MS) continue;

        const today = localDateString(now, tz);
        const already = await prisma.digestLog.findUnique({
            where: {
                userId_localDate: { userId: c.id, localDate: today },
            },
            select: { id: true },
        });
        if (already) continue;

        eligible.push({
            id: c.id,
            name: c.name,
            email: c.email,
            timezone: c.timezone,
            emailDigestEnabled: c.emailDigestEnabled,
            inAppDigestEnabled: c.inAppDigestEnabled,
            isPro,
        });
    }

    return eligible;
}

export async function buildDigestData(
    userId: string,
    tz: string,
    now: Date,
): Promise<{ today: DigestRow[]; overdue: DigestRow[] }> {
    const startOfToday = startOfDayInTz(now, tz);
    const startOfTomorrow = new Date(startOfToday.getTime() + 86_400_000);

    const [today, overdue] = await Promise.all([
        prisma.woohoo.findMany({
            where: {
                userId,
                archivedAt: null,
                followUpAt: { gte: startOfToday, lt: startOfTomorrow },
            },
            orderBy: { followUpAt: "asc" },
            take: 10,
            select: digestRowSelect,
        }),
        prisma.woohoo.findMany({
            where: {
                userId,
                archivedAt: null,
                followUpAt: { lt: startOfToday },
            },
            orderBy: { followUpAt: "asc" },
            take: 10,
            select: digestRowSelect,
        }),
    ]);

    return { today, overdue };
}

const digestRowSelect = {
    id: true,
    peerName: true,
    peerId: true,
    platform: true,
    followUpAt: true,
    lastInteractionAt: true,
} as const;

type DigestRow = {
    id: string;
    peerName: string | null;
    peerId: string;
    platform: string;
    followUpAt: Date | null;
    lastInteractionAt: Date | null;
};

type SendResult = "sent" | "failed" | "skipped_empty" | "skipped_duplicate";

export async function sendDigestToUser(
    user: EligibleUser,
    now: Date,
): Promise<SendResult> {
    const tz = user.timezone ?? "UTC";
    const today = localDateString(now, tz);
    const data = await buildDigestData(user.id, tz, now);
    const itemCount = data.today.length + data.overdue.length;

    if (itemCount === 0) {
        // No email to send. Record the decision so the next tick skips this
        // user. create() throws on duplicate — that's fine, someone else
        // already decided today.
        await prisma.digestLog
            .create({
                data: {
                    userId: user.id,
                    localDate: today,
                    status: "skipped_empty",
                    itemCount: 0,
                },
            })
            .catch(() => undefined);
        return "skipped_empty";
    }

    // Claim the (userId, localDate) slot BEFORE sending. If another worker
    // already claimed it, return skipped_duplicate without sending. If send
    // crashes after claim, the row stays at "sending" and the next tick
    // skips — we'd rather miss a day than double-send.
    try {
        await prisma.digestLog.create({
            data: {
                userId: user.id,
                localDate: today,
                status: "sending",
                itemCount,
            },
        });
    } catch {
        return "skipped_duplicate";
    }

    const token = signUnsubscribeToken(user.id, "digest");
    const baseUrl = BASE_URL();
    const unsubscribeLink = `${baseUrl}/unsubscribe?t=${encodeURIComponent(token)}`;

    const props = {
        name: user.name,
        baseUrl,
        unsubscribeUrl: unsubscribeLink,
        today: data.today,
        overdue: data.overdue,
    };

    const html = await render(FollowUpDigest(props));
    const text = await render(FollowUpDigest(props), { plainText: true });

    const subject =
        data.overdue.length > 0
            ? `${data.overdue.length} overdue, ${data.today.length} today — your Woohoo digest`
            : `${data.today.length} follow-up${
                  data.today.length === 1 ? "" : "s"
              } for today`;

    let status: "sent" | "failed" = "sent";
    // Email is double-gated: user preference AND Pro plan. findEligibleUsers
    // already filters on this; the check here is a defense-in-depth so a
    // bug in eligibility can't leak a Pro-only email to a free user.
    if (user.emailDigestEnabled && user.isPro) {
        try {
            await getResend().emails.send({
                from: FROM_EMAIL(),
                to: user.email,
                subject,
                html,
                text,
                headers: {
                    "List-Unsubscribe": `<${unsubscribeLink}>`,
                    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
                },
            });
        } catch (err) {
            console.error(`[digest] resend failed for ${user.email}`, err);
            status = "failed";
        }
    } else {
        console.log(
            `[digest] ${user.email}: email skipped (pref=${user.emailDigestEnabled}, pro=${user.isPro})`,
        );
    }

    await prisma.digestLog.update({
        where: { userId_localDate: { userId: user.id, localDate: today } },
        data: { status },
    });

    // Mirror the digest into the in-app bell when the user has it enabled.
    // Non-blocking — a Bodhveda outage shouldn't mark the email as failed.
    if (user.inAppDigestEnabled) {
        await sendDigestNotification(user.id, {
            overdue: data.overdue.length,
            today: data.today.length,
        }).catch((err: unknown) => {
            console.warn(
                `[digest] bodhveda notification failed for ${user.email}`,
                err,
            );
        });
    }

    return status;
}

export async function runTick(now: Date = new Date()): Promise<void> {
    if (process.env.CRON_ENABLED === "false") {
        console.log("[digest] CRON_ENABLED=false — skipping tick");
        return;
    }

    const users = await findEligibleUsers(now);
    if (users.length === 0) {
        console.log("[digest] tick: 0 eligible users");
        return;
    }
    console.log(`[digest] tick: ${users.length} eligible user(s)`);

    for (const user of users) {
        try {
            const result = await sendDigestToUser(user, now);
            console.log(`[digest] ${user.email} → ${result}`);
        } catch (err) {
            console.error(`[digest] ${user.email} → unhandled error`, err);
        }
    }
}
