import type { Metadata } from "next";

import "./globals.css";

import { IBM_Plex_Sans } from "next/font/google";

const plex = IBM_Plex_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
    title: "Never miss a follow-up | CircleBack.to",
    description:
        "Capture conversations, track context, and never let them go cold.",
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
        <html lang="en" className={`${plex.className} h-full antialiased`}>
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
