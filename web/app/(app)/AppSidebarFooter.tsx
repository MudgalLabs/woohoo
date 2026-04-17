"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

export function AppSidebarFooter() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/sign-in");
    };

    return (
        <SidebarFooter>
            <SidebarMenu>
                <ThemeToggle />
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleSignOut} tooltip="Sign out">
                        <LogOut />
                        <span>Sign out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    );
}
