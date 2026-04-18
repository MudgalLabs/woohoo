import type { Metadata } from "next";

import "./globals.css";

import {
    IBM_Plex_Sans,
    JetBrains_Mono,
    Fredoka,
    Instrument_Serif,
    Caveat,
} from "next/font/google";
import { cn } from "@/lib/utils";
import { APP_DESCRIPTION } from "@/lib/constants";
import { ThemeProvider } from "@/components/theme-provider";

const sans = IBM_Plex_Sans({ subsets: ["latin"], variable: "--font-sans" });

const logo = Fredoka({
    subsets: ["latin"],
    weight: ["500", "600"],
    variable: "--font-logo",
});

const mono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
});

const display = Instrument_Serif({
    subsets: ["latin"],
    weight: ["400"],
    style: ["normal", "italic"],
    variable: "--font-display",
});

const hand = Caveat({
    subsets: ["latin"],
    weight: ["500", "600"],
    variable: "--font-hand",
});

export const metadata: Metadata = {
    title: {
        default: "Woohoo — You saw it. It's gone.",
        template: "%s | Woohoo",
    },
    description: APP_DESCRIPTION,
    keywords: [
        "social CRM",
        "follow-up tool",
        "lead tracking",
        "DM tracker",
        "social media leads",
        "Reddit leads",
        "LinkedIn leads",
        "inbox organizer",
        "follow up reminder",
    ],
    metadataBase: new URL("https://woohoo.to"),
    openGraph: {
        title: "Woohoo — Follow up before the moment goes cold",
        description: APP_DESCRIPTION,
        url: "https://woohoo.to",
        siteName: "Woohoo",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Woohoo — Follow up before the moment goes cold",
        description: APP_DESCRIPTION,
    },
    robots: {
        index: true,
        follow: true,
    },
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
            suppressHydrationWarning
            className={cn(
                "h-full",
                "antialiased",
                mono.variable,
                logo.variable,
                display.variable,
                hand.variable,
                "font-sans",
                sans.variable,
            )}
        >
            <body className="min-h-full flex flex-col">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
