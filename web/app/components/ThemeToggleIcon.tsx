"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@woohoo/ui";

const subscribe = () => () => {};

export function ThemeToggleIcon() {
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
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={label}
            title={label}
        >
            {isDark ? <Sun /> : <Moon />}
        </Button>
    );
}
