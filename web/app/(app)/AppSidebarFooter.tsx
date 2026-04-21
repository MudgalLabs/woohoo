"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
    ChevronsUpDown,
    CreditCard,
    LogOut,
    Moon,
    Settings,
    Sun,
} from "lucide-react";
import { useTheme } from "next-themes";

import { authClient } from "@/lib/auth-client";
import {
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@woohoo/ui";
import Link from "next/link";

type AppSidebarFooterUser = {
    name: string;
    email: string;
    image?: string | null;
};

const subscribe = () => () => {};

function getInitials(name: string, email: string) {
    const source = name.trim() || email;
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
        return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
}

export function AppSidebarFooter({ user }: { user: AppSidebarFooterUser }) {
    const router = useRouter();
    const { isMobile } = useSidebar();
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );

    const isDark = mounted && resolvedTheme === "dark";
    const themeLabel = !mounted
        ? "Switch theme"
        : isDark
          ? "Switch to light mode"
          : "Switch to dark mode";

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/auth");
    };

    const initials = getInitials(user.name, user.email);

    return (
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                tooltip={user.email}
                                className="text-sidebar-foreground/70 hover:text-sidebar-foreground data-[state=open]:text-sidebar-foreground"
                            >
                                <Avatar className="h-8 w-8 rounded-lg">
                                    {user.image ? (
                                        <AvatarImage
                                            src={user.image}
                                            alt={user.name}
                                        />
                                    ) : null}
                                    <AvatarFallback className="rounded-lg">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        {user.name}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4 opacity-60" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-2 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        {user.image ? (
                                            <AvatarImage
                                                src={user.image}
                                                alt={user.name}
                                            />
                                        ) : null}
                                        <AvatarFallback className="rounded-lg">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {user.name}
                                        </span>
                                        <span className="truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <Link href="/settings">
                                <DropdownMenuItem>
                                    <Settings />
                                    Settings
                                </DropdownMenuItem>
                            </Link>

                            <Link href="/settings/plan">
                                <DropdownMenuItem>
                                    <CreditCard />
                                    Plan
                                </DropdownMenuItem>
                            </Link>

                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setTheme(isDark ? "light" : "dark");
                                }}
                            >
                                {isDark ? <Sun /> : <Moon />}
                                <span>{themeLabel}</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onSelect={handleSignOut}>
                                <LogOut />
                                <span>Sign out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    );
}
