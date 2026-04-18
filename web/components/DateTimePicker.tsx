"use client";

import { useEffect, useRef, useState } from "react";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import { Button, Popover, PopoverContent, PopoverTrigger } from "@woohoo/ui";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
    value: Date | null;
    onChange: (value: Date | null) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

type View = "day" | "month" | "year";

const MONTHS_LONG = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad2(n: number): string {
    return String(n).padStart(2, "0");
}

function formatTrigger(d: Date): string {
    const month = MONTHS_SHORT[d.getMonth()];
    const day = pad2(d.getDate());
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    const h12 = pad2(d.getHours() % 12 || 12);
    const m = pad2(d.getMinutes());
    return `${month} ${day}, ${h12}:${m} ${ampm}`;
}

function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function buildDayGrid(viewMonth: Date): Date[] {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
        days.push(new Date(year, month, 1 - firstWeekday + i));
    }
    return days;
}

export function DateTimePicker({
    value,
    onChange,
    placeholder = "Set follow-up",
    disabled,
    className,
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<View>("day");
    const [viewMonth, setViewMonth] = useState<Date>(() => value ?? new Date());

    const handleOpenChange = (next: boolean) => {
        if (next) {
            setView("day");
            setViewMonth(value ?? new Date());
        }
        setOpen(next);
    };

    const today = new Date();
    const h24 = value ? value.getHours() : 9;
    const minute = value ? value.getMinutes() : 0;
    const ampm: "AM" | "PM" = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 || 12;

    const applyDate = (y: number, mo: number, d: number) => {
        onChange(new Date(y, mo, d, h24, minute));
    };

    const applyTime = (nextH24: number, nextM: number) => {
        const base = value ?? today;
        onChange(
            new Date(
                base.getFullYear(),
                base.getMonth(),
                base.getDate(),
                nextH24,
                nextM,
            ),
        );
    };

    const handleToday = () => {
        applyDate(today.getFullYear(), today.getMonth(), today.getDate());
        setViewMonth(today);
        setView("day");
    };

    const setHour12 = (next12: number) => {
        const h = ampm === "PM"
            ? (next12 === 12 ? 12 : next12 + 12)
            : (next12 === 12 ? 0 : next12);
        applyTime(h, minute);
    };
    const setMinute = (next: number) => applyTime(h24, next);
    const toggleAmPm = () => applyTime((h24 + 12) % 24, minute);

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
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
                    <span className={cn(value && "font-mono text-[13px]")}>
                        {value ? formatTrigger(value) : placeholder}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[17rem] p-0" align="start">
                {view === "day" && (
                    <DayView
                        viewMonth={viewMonth}
                        selected={value}
                        today={today}
                        onPrev={() =>
                            setViewMonth(
                                new Date(
                                    viewMonth.getFullYear(),
                                    viewMonth.getMonth() - 1,
                                    1,
                                ),
                            )
                        }
                        onNext={() =>
                            setViewMonth(
                                new Date(
                                    viewMonth.getFullYear(),
                                    viewMonth.getMonth() + 1,
                                    1,
                                ),
                            )
                        }
                        onMonthClick={() => setView("month")}
                        onYearClick={() => setView("year")}
                        onDayClick={(d) =>
                            applyDate(d.getFullYear(), d.getMonth(), d.getDate())
                        }
                    />
                )}
                {view === "month" && (
                    <MonthView
                        year={viewMonth.getFullYear()}
                        selected={value}
                        onPrev={() =>
                            setViewMonth(
                                new Date(
                                    viewMonth.getFullYear() - 1,
                                    viewMonth.getMonth(),
                                    1,
                                ),
                            )
                        }
                        onNext={() =>
                            setViewMonth(
                                new Date(
                                    viewMonth.getFullYear() + 1,
                                    viewMonth.getMonth(),
                                    1,
                                ),
                            )
                        }
                        onYearClick={() => setView("year")}
                        onMonthClick={(m) => {
                            setViewMonth(
                                new Date(viewMonth.getFullYear(), m, 1),
                            );
                            setView("day");
                        }}
                    />
                )}
                {view === "year" && (
                    <YearView
                        selectedYear={
                            value?.getFullYear() ?? viewMonth.getFullYear()
                        }
                        onYearClick={(y) => {
                            setViewMonth(new Date(y, viewMonth.getMonth(), 1));
                            setView("month");
                        }}
                    />
                )}

                <div className="border-t border-border px-3 py-2 flex items-center gap-2">
                    <label className="text-sm text-muted-foreground">
                        Time
                    </label>
                    <div className="ml-auto flex items-center gap-1">
                        <TimeField
                            value={h12}
                            min={1}
                            max={12}
                            onChange={setHour12}
                        />
                        <span className="text-muted-foreground font-mono">:</span>
                        <TimeField
                            value={minute}
                            min={0}
                            max={59}
                            onChange={setMinute}
                        />
                        <button
                            type="button"
                            onClick={toggleAmPm}
                            className="ml-1 h-9 w-12 rounded-md border border-input bg-background text-sm font-medium hover:bg-accent"
                        >
                            {ampm}
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2">
                    <div className="flex items-center gap-1">
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
                        <Button variant="ghost" size="sm" onClick={handleToday}>
                            Today
                        </Button>
                    </div>
                    <Button size="sm" onClick={() => setOpen(false)}>
                        Done
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

function NavArrow({
    dir,
    onClick,
}: {
    dir: "prev" | "next";
    onClick: () => void;
}) {
    const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
    return (
        <button
            type="button"
            onClick={onClick}
            className="h-8 w-8 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground"
            aria-label={dir === "prev" ? "Previous" : "Next"}
        >
            <Icon className="h-4 w-4" />
        </button>
    );
}

function HeaderButton({
    onClick,
    children,
    mono,
}: {
    onClick: () => void;
    children: React.ReactNode;
    mono?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "px-2 py-1 rounded-md text-sm font-medium hover:bg-accent",
                mono && "font-mono",
            )}
        >
            {children}
        </button>
    );
}

function DayView({
    viewMonth,
    selected,
    today,
    onPrev,
    onNext,
    onMonthClick,
    onYearClick,
    onDayClick,
}: {
    viewMonth: Date;
    selected: Date | null;
    today: Date;
    onPrev: () => void;
    onNext: () => void;
    onMonthClick: () => void;
    onYearClick: () => void;
    onDayClick: (d: Date) => void;
}) {
    const days = buildDayGrid(viewMonth);
    return (
        <div className="p-3">
            <div className="flex items-center justify-between mb-2">
                <NavArrow dir="prev" onClick={onPrev} />
                <div className="flex items-center gap-1">
                    <HeaderButton onClick={onMonthClick}>
                        {MONTHS_LONG[viewMonth.getMonth()]}
                    </HeaderButton>
                    <HeaderButton onClick={onYearClick} mono>
                        {viewMonth.getFullYear()}
                    </HeaderButton>
                </div>
                <NavArrow dir="next" onClick={onNext} />
            </div>
            <div className="grid grid-cols-7">
                {WEEKDAYS.map((w) => (
                    <div
                        key={w}
                        className="text-xs text-muted-foreground text-center py-1"
                    >
                        {w}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7">
                {days.map((day) => {
                    const outside = day.getMonth() !== viewMonth.getMonth();
                    const isSel = selected ? isSameDay(day, selected) : false;
                    const isTd = isSameDay(day, today);
                    return (
                        <button
                            type="button"
                            key={day.toISOString()}
                            onClick={() => onDayClick(day)}
                            className={cn(
                                "aspect-square rounded-md text-sm font-mono flex items-center justify-center hover:bg-accent",
                                outside && "text-muted-foreground/50",
                                isTd &&
                                    !isSel &&
                                    "bg-accent text-accent-foreground",
                                isSel &&
                                    "bg-primary text-primary-foreground hover:bg-primary",
                            )}
                        >
                            {day.getDate()}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function MonthView({
    year,
    selected,
    onPrev,
    onNext,
    onYearClick,
    onMonthClick,
}: {
    year: number;
    selected: Date | null;
    onPrev: () => void;
    onNext: () => void;
    onYearClick: () => void;
    onMonthClick: (m: number) => void;
}) {
    return (
        <div className="p-3">
            <div className="flex items-center justify-between mb-2">
                <NavArrow dir="prev" onClick={onPrev} />
                <HeaderButton onClick={onYearClick} mono>
                    {year}
                </HeaderButton>
                <NavArrow dir="next" onClick={onNext} />
            </div>
            <div className="grid grid-cols-3 gap-2">
                {MONTHS_SHORT.map((m, i) => {
                    const isSel =
                        selected?.getFullYear() === year &&
                        selected?.getMonth() === i;
                    return (
                        <button
                            type="button"
                            key={m}
                            onClick={() => onMonthClick(i)}
                            className={cn(
                                "h-12 rounded-md text-sm font-medium hover:bg-accent flex items-center justify-center",
                                isSel &&
                                    "bg-primary text-primary-foreground hover:bg-primary",
                            )}
                        >
                            {m}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function YearView({
    selectedYear,
    onYearClick,
}: {
    selectedYear: number;
    onYearClick: (y: number) => void;
}) {
    const currentYear = new Date().getFullYear();
    const start = currentYear - 60;
    const end = currentYear + 20;
    const years: number[] = [];
    for (let y = start; y <= end; y++) years.push(y);

    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = containerRef.current?.querySelector(
            "[data-selected='true']",
        ) as HTMLElement | null;
        el?.scrollIntoView({ block: "center" });
    }, []);

    return (
        <div className="p-3">
            <div className="flex items-center justify-center mb-2 h-8">
                <span className="text-sm font-medium text-muted-foreground">
                    Select year
                </span>
            </div>
            <div
                ref={containerRef}
                className="h-[200px] overflow-y-auto"
            >
                <div className="grid grid-cols-3 gap-2 pr-1">
                    {years.map((y) => {
                        const isSel = y === selectedYear;
                        return (
                            <button
                                type="button"
                                key={y}
                                data-selected={isSel || undefined}
                                onClick={() => onYearClick(y)}
                                className={cn(
                                    "h-10 rounded-md text-sm font-mono hover:bg-accent flex items-center justify-center",
                                    isSel &&
                                        "bg-primary text-primary-foreground hover:bg-primary",
                                )}
                            >
                                {y}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function TimeField({
    value,
    min,
    max,
    onChange,
}: {
    value: number;
    min: number;
    max: number;
    onChange: (n: number) => void;
}) {
    const [buffer, setBuffer] = useState<string | null>(null);
    const display = buffer ?? pad2(value);

    const commit = () => {
        if (buffer === null) return;
        const n = parseInt(buffer, 10);
        if (!Number.isNaN(n) && n >= min && n <= max && n !== value) {
            onChange(n);
        }
        setBuffer(null);
    };

    return (
        <input
            type="text"
            inputMode="numeric"
            value={display}
            onFocus={(e) => {
                setBuffer(pad2(value));
                e.currentTarget.select();
            }}
            onBlur={commit}
            onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 2);
                setBuffer(raw);
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    onChange(value >= max ? min : value + 1);
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    onChange(value <= min ? max : value - 1);
                }
            }}
            className="h-9 w-10 rounded-md border border-input bg-background text-center text-sm font-mono tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
    );
}
