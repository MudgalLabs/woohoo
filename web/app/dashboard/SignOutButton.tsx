"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignOutButton() {
    const router = useRouter();

    const handleOnClick = () => {
        authClient.signOut();
        router.push("/sign-in");
    };

    return <Button onClick={handleOnClick}>Sign Out</Button>;
}
