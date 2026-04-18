"use client";

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import {
    Button,
    Calendar,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@woohoo/ui";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
    value: Date | null;
    onChange: (value: Date | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

function formatDisplay(date: Date): string {
    return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

function toTimeString(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function DateTimePicker({
    value,
    onChange,
    placeholder = "Set follow-up",
    disabled,
    className,
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const stableToday = useState<Date>(() => new Date())[0];

    const timeValue = useMemo(
        () => (value ? toTimeString(value) : "09:00"),
        [value],
    );

    const handleDateSelect = (picked: Date | undefined) => {
        if (!picked) return;
        const [h, m] = timeValue.split(":").map(Number);
        // Reconstruct in the user's local timezone; caller serializes via toISOString().
        onChange(new Date(picked.getFullYear(), picked.getMonth(), picked.getDate(), h, m));
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (!raw) return;
        const [h, m] = raw.split(":").map(Number);
        const base = value ?? stableToday;
        onChange(new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                        "justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className,
                    )}
                >
                    <CalendarIcon className="h-4 w-4" />
                    {value ? formatDisplay(value) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value ?? undefined}
                    onSelect={handleDateSelect}
                    defaultMonth={value ?? stableToday}
                />
                <div className="border-t border-border px-3 py-2 flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">Time</label>
                    <input
                        type="time"
                        value={timeValue}
                        onChange={handleTimeChange}
                        className="flex-1 h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            onChange(null);
                            setOpen(false);
                        }}
                    >
                        Clear
                    </Button>
                    <Button size="sm" onClick={() => setOpen(false)}>
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
