import { getSession } from "@/lib/get-session";
import { TimezoneForm } from "./TimezoneForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
    const session = await getSession();
    const currentTimezone = session!.user.timezone ?? null;

    return (
        <div className="p-6 w-full max-w-2xl">
            <div className="mb-6">
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
        </div>
    );
}
