import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoVariant = "full" | "mark";
type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
    variant?: LogoVariant;
    size?: LogoSize;
    href?: string | null;
    className?: string;
}

const sizeClass: Record<LogoSize, string> = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
};

const markSizeClass: Record<LogoSize, string> = {
    sm: "h-7 w-7 text-sm",
    md: "h-8 w-8 text-base",
    lg: "h-10 w-10 text-lg",
};

export function Logo({
    variant = "full",
    size = "md",
    href = "/",
    className,
}: LogoProps) {
    const content =
        variant === "full" ? (
            <span
                className={cn(
                    "font-medium text-primary font-logo",
                    sizeClass[size],
                    className,
                )}
            >
                woohoo
            </span>
        ) : (
            <span
                aria-label="woohoo"
                className={cn(
                    "inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold leading-none font-logo",
                    markSizeClass[size],
                    className,
                )}
            >
                W
            </span>
        );

    if (href === null) return content;

    return (
        <Link
            href={href}
            className="inline-flex items-center no-underline hover:opacity-90 transition-opacity"
        >
            {content}
        </Link>
    );
}
