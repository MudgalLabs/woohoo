"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { AuthLayout } from "@/app/components/auth/AuthLayout";
import { Button } from "@woohoo/ui";

type Status = "sending" | "done" | "error";

declare global {
    interface Window {
        chrome?: {
            runtime?: {
                sendMessage?: (
                    extensionId: string,
                    message: unknown,
                    callback?: (response: unknown) => void,
                ) => void;
            };
        };
    }
}

export default function Page() {
    const [status, setStatus] = useState<Status>("sending");

    useEffect(() => {
        const extId = new URLSearchParams(window.location.search).get("extId");

        Promise.resolve()
            .then(async () => {
                if (!extId) throw new Error("no extId");

                const r = await fetch("/api/auth/get-session", {
                    credentials: "include",
                });
                const body = r.ok ? await r.json() : null;
                const token = body?.token ?? body?.session?.token;
                const user = body?.user;
                if (!token || !user) throw new Error("no session");

                const send = window.chrome?.runtime?.sendMessage;
                if (!send) throw new Error("extension unreachable");

                send(extId, { type: "AUTH_SUCCESS", token, user }, () => {
                    setStatus("done");
                    setTimeout(() => window.close(), 400);
                });
            })
            .catch(() => setStatus("error"));
    }, []);

    const { title, subtitle, body } = (() => {
        if (status === "sending") {
            return {
                title: "Signing you in…",
                subtitle: "Connecting your account to the Woohoo extension.",
                body: null,
            };
        }
        if (status === "done") {
            return {
                title: "You're signed in",
                subtitle: "You can close this tab.",
                body: null,
            };
        }
        return {
            title: "Something went wrong",
            subtitle:
                "We couldn't send your session to the extension. Make sure the Woohoo extension is installed and try again.",
            body: (
                <Link href="/auth">
                    <Button variant="outline" className="w-full" size="lg">
                        Back to sign in
                    </Button>
                </Link>
            ),
        };
    })();

    return (
        <AuthLayout title={title} subtitle={subtitle} footer={<span />}>
            {body}
        </AuthLayout>
    );
}
