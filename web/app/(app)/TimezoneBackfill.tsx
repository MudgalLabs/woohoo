"use client";

import { useEffect } from "react";

interface TimezoneBackfillProps {
    currentTimezone: string | null;
}

export function TimezoneBackfill({ currentTimezone }: TimezoneBackfillProps) {
    useEffect(() => {
        if (currentTimezone) return;
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!detected) return;
        fetch("/api/me/timezone", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ timezone: detected }),
        }).catch(() => {});
    }, [currentTimezone]);

    return null;
}
