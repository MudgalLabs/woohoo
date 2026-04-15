import SignOutButton from "@/app/dashboard/SignOutButton";
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/sign-in");
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <SignOutButton />
        </div>
    );
}
