"use client";

import { usePathname } from "next/navigation";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/constants";
import { NotificationBell } from "./NotificationBell";

export function AppHeader() {
    const pathname = usePathname();
    const title =
        ROUTES.find(
            ({ url }) => pathname === url || pathname.startsWith(url + "/"),
        )?.title ?? "";

    return (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            {title && <span className="text-sm font-semibold">{title}</span>}
            <div className="ml-auto">
                <NotificationBell />
            </div>
        </header>
    );
}
