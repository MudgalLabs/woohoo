"use client";

import { useMemo } from "react";
import { Bell, CheckCheck } from "lucide-react";
import {
    useNotifications,
    useNotificationsUnreadCount,
    useUpdateNotificationsState,
} from "@bodhveda/react";
import type { Notification } from "bodhveda";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@woohoo/ui";
import { cn } from "@woohoo/ui/lib/utils";

function relativeTime(iso: string): string {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const secs = Math.max(0, Math.floor((now - then) / 1000));
    if (secs < 60) return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
}

function NotificationItem({ n }: { n: Notification }) {
    const p = (n.payload ?? {}) as { title?: string; body?: string };
    return (
        <li
            className={cn(
                "border-b px-3 py-3 last:border-b-0",
                !n.state.read && "bg-muted/40",
            )}
        >
            <div className="flex items-start gap-2">
                {!n.state.read && (
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                )}
                <div className="min-w-0 flex-1">
                    {p.title && (
                        <p className="text-sm font-medium leading-snug">
                            {p.title}
                        </p>
                    )}
                    {p.body && (
                        <p className="mt-0.5 text-xs text-muted-foreground leading-snug">
                            {p.body}
                        </p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground">
                        {relativeTime(n.created_at)}
                    </p>
                </div>
            </div>
        </li>
    );
}

export function NotificationBell() {
    const { data: unread } = useNotificationsUnreadCount();
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useNotifications();
    const { mutate: updateState, isPending: marking } =
        useUpdateNotificationsState();

    const unreadCount = unread?.unread_count ?? 0;
    const badgeText = useMemo(
        () =>
            unreadCount === 0
                ? ""
                : unreadCount > 99
                  ? "99+"
                  : String(unreadCount),
        [unreadCount],
    );

    const markAllRead = () => {
        if (unreadCount === 0) return;
        updateState({ ids: [], state: { read: true } });
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Notifications"
                    className="relative h-8 w-8"
                >
                    <Bell className="h-4 w-4" />
                    {badgeText && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                            {badgeText}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-80 p-0"
                sideOffset={8}
            >
                <div className="flex items-center justify-between border-b px-3 py-2">
                    <p className="text-sm font-semibold">Notifications</p>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 gap-1 px-2 text-xs"
                        onClick={markAllRead}
                        disabled={unreadCount === 0 || marking}
                    >
                        <CheckCheck className="h-3 w-3" />
                        Mark all read
                    </Button>
                </div>

                <div className="max-h-96 overflow-y-auto">
                    {isLoading && (
                        <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                            Loading…
                        </p>
                    )}
                    {!isLoading &&
                        (!data || data.notifications.length === 0) && (
                            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
                                No notifications yet.
                            </p>
                        )}
                    {data && data.notifications.length > 0 && (
                        <ul>
                            {data.notifications.map((n) => (
                                <NotificationItem key={n.id} n={n} />
                            ))}
                        </ul>
                    )}
                    {hasNextPage && (
                        <div className="flex justify-center py-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage ? "Loading…" : "Load more"}
                            </Button>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
