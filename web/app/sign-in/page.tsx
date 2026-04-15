import { redirect } from "next/navigation";

import SignInForm from "@/app/sign-in/SignInForm";
import { getSession } from "@/lib/get-session";

export default async function Page() {
    const session = await getSession();

    if (session) {
        redirect("/dashboard");
    }

    return <SignInForm />;
}
