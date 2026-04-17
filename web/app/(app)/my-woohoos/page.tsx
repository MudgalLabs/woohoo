import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { WoohooCard } from "./WoohooCard";

export const metadata = { title: "My Woohoos" };

export default async function MyWoohoos() {
    const session = await getSession();

    const woohoos = await prisma.woohoo.findMany({
        where: { userId: session!.user.id },
        orderBy: { lastSavedAt: "desc" },
        include: {
            timeline: {
                orderBy: { interactionAt: "desc" },
                take: 1,
            },
        },
    });

    return (
        <div className="p-6 max-w-5xl w-full">
            {woohoos.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                    No Woohoos yet. Save a Reddit DM with the extension to get
                    started.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {woohoos.map((w) => (
                        <WoohooCard key={w.id} woohoo={w} />
                    ))}
                </div>
            )}
        </div>
    );
}
