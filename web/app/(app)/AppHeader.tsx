"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

const PAGE_TITLES: { prefix: string; label: string }[] = [
    { prefix: "/dashboard", label: "Dashboard" },
    { prefix: "/my-woohoos", label: "My Woohoos" },
];

export function AppHeader() {
    const pathname = usePathname();
    const title =
        PAGE_TITLES.find(
            ({ prefix }) =>
                pathname === prefix || pathname.startsWith(prefix + "/"),
        )?.label ?? "";

    return (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            {title && <span className="text-sm font-semibold">{title}</span>}
        </header>
    );
}
