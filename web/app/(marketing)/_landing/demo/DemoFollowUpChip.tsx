import { cn } from "@/lib/utils";
import { followUpLabel } from "@/app/(app)/my-woohoos/WoohooCard";
import { dayDiffInTz } from "@/lib/date-tz";

/*
 * Visual mirror of the readonly state of FollowUpEditor
 * (web/app/(app)/my-woohoos/[id]/FollowUpEditor.tsx). Static, non-interactive.
 */
interface DemoFollowUpChipProps {
    followUpAt: Date;
}

const DEMO_TZ = "UTC";

export function DemoFollowUpChip({ followUpAt }: DemoFollowUpChipProps) {
    const isOverdue = dayDiffInTz(followUpAt, new Date(), DEMO_TZ) < 0;

    return (
        <span
            className={cn(
                "inline-flex items-center text-sm font-medium rounded-md px-2 py-1 -mx-2",
                isOverdue ? "text-destructive" : "text-primary",
            )}
        >
            {followUpLabel(followUpAt, DEMO_TZ)}
        </span>
    );
}
