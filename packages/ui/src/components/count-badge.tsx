import * as React from "react"

import { cn } from "../lib/utils"

interface CountBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    count: number
    active?: boolean
}

const CountBadge = React.forwardRef<HTMLSpanElement, CountBadgeProps>(
    ({ count, active, className, ...props }, ref) => (
        <span
            ref={ref}
            className={cn(
                "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary/20 px-1.5 text-xs font-medium",
                active === undefined
                    ? "text-muted-foreground group-data-[state=active]/tabs-trigger:text-foreground"
                    : active
                      ? "text-foreground"
                      : "text-muted-foreground",
                className,
            )}
            {...props}
        >
            {count}
        </span>
    ),
)
CountBadge.displayName = "CountBadge"

export { CountBadge }
