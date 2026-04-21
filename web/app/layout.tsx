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
import { APP_DESCRIPTION, APP_TITLE } from "@/lib/constants";
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
        default: APP_TITLE,
        template: "%s | Woohoo",
    },
    description: APP_DESCRIPTION,
    applicationName: "Woohoo",
    keywords: [
        "follow up reminders for DMs",
        "track conversations Reddit",
        "manage social media leads",
        "remember to reply messages",
        "DM follow up tool",
        "conversation tracker",
        "indie hacker leads",
        "reddit lead management",
    ],
    metadataBase: new URL("https://woohoo.to"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: APP_TITLE,
        description: APP_DESCRIPTION,
        url: "https://woohoo.to",
        siteName: "Woohoo",
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: APP_TITLE,
        description: APP_DESCRIPTION,
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
