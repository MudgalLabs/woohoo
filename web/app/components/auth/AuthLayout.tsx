import { ReactNode } from "react";
import { Logo } from "@/app/components/brand/Logo";
import { APP_TITLE, APP_DESCRIPTION } from "@/lib/constants";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
}

export function AuthLayout({
    title,
    subtitle,
    children,
    footer,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: form */}
            <div className="flex flex-col px-6 py-8 sm:px-12">
                <Logo />

                <div className="flex flex-1 items-center justify-center py-12">
                    <Card className="w-full max-w-sm">
                        <CardHeader>
                            <CardTitle className="text-2xl">{title}</CardTitle>
                            <CardDescription>{subtitle}</CardDescription>
                        </CardHeader>
                        <CardContent>{children}</CardContent>
                        <CardFooter className="justify-center text-sm text-muted-foreground">
                            {footer}
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Right: branding */}
            <div className="relative hidden lg:flex flex-col justify-between border-l border-border bg-card px-12 py-12">
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 1px 1px, var(--ink) 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="relative">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                        <span className="h-px w-8 bg-border" />A quieter corner
                        of the internet
                    </span>
                </div>

                <div className="relative max-w-md">
                    <h2
                        className="text-4xl font-semibold tracking-tight text-foreground leading-tight"
                        style={{ fontFamily: "var(--font-serif)" }}
                    >
                        {APP_TITLE}
                    </h2>
                    <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                        {APP_DESCRIPTION}
                    </p>

                    <div className="mt-10 space-y-3">
                        <Feature text="One click to save from anywhere on Reddit" />
                        <Feature text="Organized, searchable, always yours" />
                        <Feature text="No noise. No feed. Just what you kept." />
                    </div>
                </div>

                <div className="relative flex items-center gap-2 text-xs text-muted-foreground">
                    <Logo variant="mark" size="sm" href={null} />
                    <span>© {new Date().getFullYear()} woohoo</span>
                </div>
            </div>
        </div>
    );
}

function Feature({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="text-sm text-foreground/80">{text}</span>
        </div>
    );
}
