import { redirect } from "next/navigation";

import { getSession } from "@/lib/get-session";
import SignUpForm from "@/app/sign-up/SignUpForm";

export default async function Page() {
    const session = await getSession();

    if (session) {
        redirect("/dashboard");
    }

    return <SignUpForm />;
}
