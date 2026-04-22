import Link from "next/link";
import { Button } from "@woohoo/ui";

import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

export const metadata = { title: "Unsubscribe" };

export default async function UnsubscribePage({
    searchParams,
}: {
    searchParams: Promise<{ t?: string; done?: string }>;
}) {
    const params = await searchParams;
    const token = params.t;
    const parsed = token ? verifyUnsubscribeToken(token) : null;

    const isDone = params.done === "1";

    if (!token || !parsed) {
        return (
            <main className="mx-auto max-w-md px-4 py-24 text-center">
                <h1 className="text-2xl font-semibold">Link expired or invalid</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    This unsubscribe link is no longer valid. You can manage
                    email preferences from your account settings.
                </p>
                <Link
                    href="/settings"
                    className="mt-6 inline-block text-sm underline"
                >
                    Go to settings
                </Link>
            </main>
        );
    }

    if (isDone) {
        // Show the user's email so they know which account was affected.
        const user = await prisma.user.findUnique({
            where: { id: parsed.userId },
            select: { email: true },
        });
        return (
            <main className="mx-auto max-w-md px-4 py-24 text-center">
                <h1 className="text-2xl font-semibold">You're unsubscribed</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                    {user?.email ? (
                        <>
                            <span className="font-medium">{user.email}</span>{" "}
                            will no longer receive the daily follow-up digest.
                        </>
                    ) : (
                        <>You will no longer receive the daily follow-up digest.</>
                    )}
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                    Changed your mind? Re-enable it in your settings.
                </p>
                <Link
                    href="/settings"
                    className="mt-6 inline-block text-sm underline"
                >
                    Go to settings
                </Link>
            </main>
        );
    }

    // Confirm step — rendering a form that POSTs prevents email scanners /
    // link prefetchers from accidentally unsubscribing.
    return (
        <main className="mx-auto max-w-md px-4 py-24 text-center">
            <h1 className="text-2xl font-semibold">
                Unsubscribe from follow-up digest?
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
                You'll stop getting the daily email reminding you of Woohoos
                that need a follow-up. Everything else stays the same, and you
                can re-enable it anytime in settings.
            </p>
            <form
                action={`/api/unsubscribe?t=${encodeURIComponent(token)}`}
                method="post"
                className="mt-6 flex flex-col items-center gap-3"
            >
                <Button type="submit" variant="destructive">
                    Unsubscribe
                </Button>
                <Link
                    href="/"
                    className="text-xs text-muted-foreground underline"
                >
                    Cancel
                </Link>
            </form>
        </main>
    );
}
