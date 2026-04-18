import { prisma } from "@/lib/prisma";
import type { WoohooCounts } from "@/app/(app)/my-woohoos/WoohooCard";

export async function getTimelineCountsByWoohoo(
    userId: string,
): Promise<Map<string, WoohooCounts>> {
    const rows = await prisma.timelineItem.groupBy({
        by: ["woohooId", "type"],
        where: { woohoo: { userId } },
        _count: { _all: true },
    });

    const map = new Map<string, WoohooCounts>();
    for (const row of rows) {
        const existing = map.get(row.woohooId) ?? { dm: 0, comment: 0 };
        existing[row.type] = row._count._all;
        map.set(row.woohooId, existing);
    }
    return map;
}
