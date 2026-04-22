import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

// Unsubscribe endpoint. POST only — GET-based unsubscribes get triggered by
// email scanners and link prefetchers. Browser flow:
//     user clicks email link → GET /unsubscribe?t=T → form POST → here
// Gmail/Yahoo one-click (RFC 8058):
//     provider POSTs here with body `List-Unsubscribe=One-Click`; body is
//     ignored. Any 2xx response is accepted.

async function handle(request: Request) {
    const url = new URL(request.url);
    const token = url.searchParams.get("t");
    if (!token) {
        return NextResponse.json(
            { error: "Missing token" },
            { status: 400 },
        );
    }

    const parsed = verifyUnsubscribeToken(token);
    if (!parsed) {
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 400 },
        );
    }

    if (parsed.kind === "digest") {
        // Non-existent userId (deleted account) resolves to an update() throw;
        // treat that as "already unsubscribed" — 200 either way.
        await prisma.user
            .update({
                where: { id: parsed.userId },
                data: { emailDigestEnabled: false },
            })
            .catch(() => null);
    }

    // Redirect form submits back to the confirmation page. Gmail's one-click
    // POST will see the 303 but doesn't follow it — it just needs 2xx.
    const doneUrl = new URL(
        `/unsubscribe?t=${encodeURIComponent(token)}&done=1`,
        request.url,
    );
    return NextResponse.redirect(doneUrl, { status: 303 });
}

export async function POST(request: Request) {
    return handle(request);
}
