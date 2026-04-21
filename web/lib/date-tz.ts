const MS_PER_DAY = 86_400_000;

type Parts = { year: number; month: number; day: number; hour: number; minute: number; second: number };

function partsInTz(date: Date, tz: string): Parts {
    const dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });
    const map: Record<string, string> = {};
    for (const p of dtf.formatToParts(date)) {
        if (p.type !== "literal") map[p.type] = p.value;
    }
    const hour = Number(map.hour) === 24 ? 0 : Number(map.hour);
    return {
        year: Number(map.year),
        month: Number(map.month),
        day: Number(map.day),
        hour,
        minute: Number(map.minute),
        second: Number(map.second),
    };
}

function tzOffsetMs(date: Date, tz: string): number {
    const p = partsInTz(date, tz);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return asUtc - date.getTime();
}

function wallClockInTzToUtc(
    tz: string,
    year: number,
    month: number,
    day: number,
    hour = 0,
    minute = 0,
    second = 0,
): Date {
    const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const offset = tzOffsetMs(guess, tz);
    return new Date(guess.getTime() - offset);
}

export function startOfDayInTz(date: Date, tz: string): Date {
    const p = partsInTz(date, tz);
    return wallClockInTzToUtc(tz, p.year, p.month, p.day, 0, 0, 0);
}

export function endOfDayInTz(date: Date, tz: string): Date {
    return new Date(startOfDayInTz(date, tz).getTime() + MS_PER_DAY - 1);
}

export function dayDiffInTz(a: Date, b: Date, tz: string): number {
    const pa = partsInTz(a, tz);
    const pb = partsInTz(b, tz);
    const aUtc = Date.UTC(pa.year, pa.month - 1, pa.day);
    const bUtc = Date.UTC(pb.year, pb.month - 1, pb.day);
    return Math.round((aUtc - bUtc) / MS_PER_DAY);
}

export function isValidTimezone(tz: string): boolean {
    try {
        new Intl.DateTimeFormat("en-US", { timeZone: tz });
        return true;
    } catch {
        return false;
    }
}
