import { getSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { WoohooCard } from "./WoohooCard";
import { getTimelineCountsByWoohoo } from "@/lib/timeline-counts";
import { NoWoohoosYet } from "@/components/no-woohoos-yet";

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

    const countsMap = await getTimelineCountsByWoohoo(session!.user.id);

    if (woohoos.length === 0) {
        return <NoWoohoosYet />;
    }

    return (
        <div className="p-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
                {woohoos.map((w) => (
                    <WoohooCard
                        key={w.id}
                        woohoo={w}
                        counts={countsMap.get(w.id)}
                    />
                ))}
            </div>
        </div>
    );
}
