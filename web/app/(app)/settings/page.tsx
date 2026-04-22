import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/get-session";
import { getUserPlan } from "@/lib/plans";
import { TimezoneForm } from "./TimezoneForm";
import { DigestNotificationsForm } from "./DigestNotificationsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
    const session = await getSession();
    const userId = session!.user.id;
    const currentTimezone = session!.user.timezone ?? null;

    const [me, plan] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                emailDigestEnabled: true,
                inAppDigestEnabled: true,
            },
        }),
        getUserPlan(userId),
    ]);

    const isPro = plan.tier === "pro";

    return (
        <div className="p-6 w-full max-w-2xl space-y-5">
            <div>
                <h1 className="text-xl font-semibold">Settings</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Your account preferences.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-5">
                <div className="mb-4">
                    <h2 className="text-sm font-medium">Timezone</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Used to decide what &ldquo;today&rdquo; and
                        &ldquo;overdue&rdquo; mean for your follow-ups.
                    </p>
                </div>
                <TimezoneForm currentTimezone={currentTimezone} />
            </div>

            <div className="rounded-lg border bg-card p-5">
                <div className="mb-4">
                    <h2 className="text-sm font-medium">Notifications</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        How we nudge you on follow-ups that need attention.
                    </p>
                </div>
                <div className="space-y-5">
                    <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
                            Follow-up digest
                        </p>
                        <DigestNotificationsForm
                            initialInApp={me?.inAppDigestEnabled ?? true}
                            initialEmail={me?.emailDigestEnabled ?? true}
                            isPro={isPro}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
