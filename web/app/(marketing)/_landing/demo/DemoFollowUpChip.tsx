import { cn } from "@/lib/utils";
import { followUpLabel } from "@/app/(app)/my-woohoos/WoohooCard";

/*
 * Visual mirror of the readonly state of FollowUpEditor
 * (web/app/(app)/my-woohoos/[id]/FollowUpEditor.tsx). Static, non-interactive.
 */
interface DemoFollowUpChipProps {
    followUpAt: Date;
}

function startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
}

export function DemoFollowUpChip({ followUpAt }: DemoFollowUpChipProps) {
    const isOverdue =
        startOfDay(followUpAt).getTime() < startOfDay(new Date()).getTime();

    return (
        <span
            className={cn(
                "inline-flex items-center text-sm font-medium rounded-md px-2 py-1 -mx-2",
                isOverdue ? "text-destructive" : "text-primary",
            )}
        >
            {followUpLabel(followUpAt)}
        </span>
    );
}
