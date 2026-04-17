"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const subscribe = () => () => {};

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );

    const isDark = mounted && resolvedTheme === "dark";
    const label = !mounted
        ? "Switch theme"
        : isDark
          ? "Switch to light mode"
          : "Switch to dark mode";

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                onClick={() => setTheme(isDark ? "light" : "dark")}
                tooltip={label}
            >
                {isDark ? <Sun /> : <Moon />}
                <span>{label}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
