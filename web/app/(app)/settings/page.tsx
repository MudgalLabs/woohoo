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
        <div className="p-6 w-full max-w-3xl space-y-8">
            <section>
                <h2 className="text-sm font-semibold mb-3">Profile</h2>
                <div className="rounded-lg border bg-card p-5">
                    <div className="mb-4">
                        <h3 className="text-sm font-medium">Timezone</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Used to decide what &ldquo;today&rdquo; and
                            &ldquo;overdue&rdquo; mean for your follow-ups.
                        </p>
                    </div>
                    <TimezoneForm currentTimezone={currentTimezone} />
                </div>
            </section>

            <section>
                <h2 className="text-sm font-semibold mb-3">Notifications</h2>
                <div className="rounded-lg border bg-card p-5">
                    <DigestNotificationsForm
                        initialInApp={me?.inAppDigestEnabled ?? true}
                        initialEmail={me?.emailDigestEnabled ?? true}
                        isPro={isPro}
                    />
                </div>
            </section>
        </div>
    );
}
