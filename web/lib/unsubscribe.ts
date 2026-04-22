import crypto from "node:crypto";

// Signed unsubscribe tokens. HMAC-SHA256 over `unsubscribe:{userId}:{kind}`
// using BETTER_AUTH_SECRET as the key. Namespaced by the `unsubscribe:` prefix
// so the key space doesn't collide with any other use of BETTER_AUTH_SECRET.
// One token per (user, kind) — stable across emails, revocable by rotating
// BETTER_AUTH_SECRET if we ever need to invalidate all outstanding links.

export type UnsubscribeKind = "digest";

function getSecret(): string {
    const secret = process.env.BETTER_AUTH_SECRET;
    if (!secret) throw new Error("BETTER_AUTH_SECRET is not set");
    return secret;
}

function sign(payload: string): string {
    return crypto
        .createHmac("sha256", getSecret())
        .update(payload)
        .digest("base64url");
}

export function signUnsubscribeToken(
    userId: string,
    kind: UnsubscribeKind,
): string {
    const payload = `unsubscribe:${userId}:${kind}`;
    const sig = sign(payload);
    const encoded = Buffer.from(payload).toString("base64url");
    return `${encoded}.${sig}`;
}

export function verifyUnsubscribeToken(
    token: string,
): { userId: string; kind: UnsubscribeKind } | null {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    if (!encoded || !sig) return null;

    let payload: string;
    try {
        payload = Buffer.from(encoded, "base64url").toString("utf8");
    } catch {
        return null;
    }

    const expected = sign(payload);
    const sigBuf = Buffer.from(sig);
    const expectedBuf = Buffer.from(expected);
    if (sigBuf.length !== expectedBuf.length) return null;
    if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

    const [prefix, userId, kind] = payload.split(":");
    if (prefix !== "unsubscribe" || !userId || !kind) return null;
    if (kind !== "digest") return null;
    return { userId, kind };
}

export function unsubscribeUrl(
    baseUrl: string,
    userId: string,
    kind: UnsubscribeKind,
): string {
    const token = signUnsubscribeToken(userId, kind);
    return `${baseUrl}/unsubscribe?t=${encodeURIComponent(token)}`;
}
