import { useEffect, useState } from "react";

import {
    Theme,
    getRedditTheme,
    subscribeToThemeChanges,
} from "@/content/lib/theme";

export function useTheme(): Theme {
    const [theme, setTheme] = useState<Theme>(() => getRedditTheme());

    useEffect(() => subscribeToThemeChanges(setTheme), []);

    return theme;
}
