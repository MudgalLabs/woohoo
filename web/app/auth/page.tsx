import { redirect } from "next/navigation";

import { getSession } from "@/lib/get-session";
import { emailPasswordAuthEnabled } from "@/lib/auth";
import { AuthCard } from "@/app/auth/AuthCard";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ from?: string; extId?: string }>;
}) {
    const { from, extId } = await searchParams;
    const session = await getSession();

    if (session) {
        if (from === "ext" && extId) {
            redirect(`/auth/ext-return?extId=${encodeURIComponent(extId)}`);
        }
        redirect("/dashboard");
    }

    return (
        <AuthCard
            from={from}
            extId={extId}
            enableEmailPassword={emailPasswordAuthEnabled}
        />
    );
}
