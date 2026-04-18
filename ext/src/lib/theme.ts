import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "reddit_theme";

function systemTheme(): Theme {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function persistTheme(theme: Theme) {
    chrome.storage.local.set({ [STORAGE_KEY]: theme });
}

export function useStoredTheme(): Theme {
    const [theme, setTheme] = useState<Theme>(() => systemTheme());

    useEffect(() => {
        chrome.storage.local.get(STORAGE_KEY, (result) => {
            const stored = result[STORAGE_KEY];
            if (stored === "dark" || stored === "light") setTheme(stored);
        });

        const onChange = (changes: {
            [key: string]: chrome.storage.StorageChange;
        }) => {
            if (!(STORAGE_KEY in changes)) return;
            const next = changes[STORAGE_KEY]?.newValue;
            if (next === "dark" || next === "light") setTheme(next);
        };
        chrome.storage.onChanged.addListener(onChange);

        const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
        const onSystem = () => {
            chrome.storage.local.get(STORAGE_KEY, (result) => {
                if (!result[STORAGE_KEY]) setTheme(systemTheme());
            });
        };
        mql?.addEventListener?.("change", onSystem);

        return () => {
            chrome.storage.onChanged.removeListener(onChange);
            mql?.removeEventListener?.("change", onSystem);
        };
    }, []);

    return theme;
}
