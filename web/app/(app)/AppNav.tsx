"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookMarked, LayoutDashboard } from "lucide-react";

import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Woohoos", href: "/my-woohoos", icon: BookMarked },
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
                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
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
