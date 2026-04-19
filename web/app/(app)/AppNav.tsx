"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, CreditCard, LayoutDashboard } from "lucide-react";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Woohoos", href: "/my-woohoos", icon: BookMarked },
    { label: "Plan", href: "/settings/plan", icon: CreditCard },
];

export function AppNav() {
    const pathname = usePathname();

    return (
        <SidebarMenu>
            {navItems.map((item) => {
                const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                return (
                    <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.label}
                            className="h-9 gap-3 px-3 font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground data-[active=true]:font-semibold [&>svg]:size-4"
                        >
                            <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
            })}
        </SidebarMenu>
    );
}
