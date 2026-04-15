import type { Metadata } from "next";

import "./globals.css";

import { IBM_Plex_Sans, JetBrains_Mono, Fredoka } from "next/font/google";
import { cn } from "@/lib/utils";

const sans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-sans" });

const logo = Fredoka({
    subsets: ["latin"],
    weight: ["600"],
    variable: "--font-logo",
});

const mono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Never miss a follow-up - woohoo",
    description:
        "Save comments, replies, and DMs worth following up on — without losing them to the scroll.",
    icons: {
        icon: "/logo.svg",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={cn(
                "h-full",
                "antialiased",
                mono.variable,
                logo.variable,
                "font-sans",
                sans.variable,
            )}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
