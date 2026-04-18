import { useEffect, useRef, useState } from "react";
import { SquareArrowOutUpRight } from "lucide-react";

import { ToastPayload, onToast } from "@/content/lib/toast";
import { useTheme } from "@/content/lib/useTheme";

const VISIBLE_MS = 2000;
const FADE_MS = 180;

interface VisibleToast extends ToastPayload {
    key: number;
}

export function Toast() {
    const [current, setCurrent] = useState<VisibleToast | null>(null);
    const [shown, setShown] = useState(false);
    const theme = useTheme();

    const visibleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return onToast((payload) => {
            if (visibleTimer.current) clearTimeout(visibleTimer.current);
            if (clearTimer.current) clearTimeout(clearTimer.current);

            setCurrent({ ...payload, key: Date.now() });
            setShown(true);

            visibleTimer.current = setTimeout(() => {
                setShown(false);
                clearTimer.current = setTimeout(() => {
                    setCurrent(null);
                }, FADE_MS);
            }, VISIBLE_MS);
        });
    }, []);

    if (!current) return null;

    return (
        <div className={theme}>
            <div className={`cb-toast ${shown ? "open" : ""}`}>
                <span className="cb-toast-msg">{current.message}</span>
                {current.href && (
                    <a
                        href={current.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cb-toast-link"
                    >
                        Open
                        <SquareArrowOutUpRight size={11} strokeWidth={2.5} />
                    </a>
                )}
            </div>
        </div>
    );
}
