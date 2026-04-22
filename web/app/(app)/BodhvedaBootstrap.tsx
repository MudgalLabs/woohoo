"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BodhvedaProvider } from "@bodhveda/react";

export function BodhvedaBootstrap({
    recipientID,
    apiKey,
    apiURL,
    children,
}: {
    recipientID: string;
    apiKey: string;
    apiURL?: string;
    children: React.ReactNode;
}) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 30_000,
                        refetchOnWindowFocus: false,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>
            <BodhvedaProvider
                apiKey={apiKey}
                recipientID={recipientID}
                options={apiURL ? { apiURL } : undefined}
            >
                {children}
            </BodhvedaProvider>
        </QueryClientProvider>
    );
}
