import { prisma } from "@/lib/prisma";

export async function getSessionFromRequest(request: Request) {
    const authHeader = request.headers.get("authorization");

    if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        const session = await prisma.session.findUnique({
            where: { token },
            include: { user: true },
        });
        if (session && session.expiresAt > new Date()) return session;
        return null;
    }

    // Fallback: cookie-based auth (for web-app-initiated requests).
    const { auth } = await import("@/lib/auth");
    return auth.api.getSession({ headers: request.headers });
}
