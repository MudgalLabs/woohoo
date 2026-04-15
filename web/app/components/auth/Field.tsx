import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
    ({ label, id, className, ...props }, ref) => {
        const inputId = id ?? props.name ?? label.toLowerCase();
        return (
            <div className="space-y-1.5">
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground"
                >
                    {label}
                </label>
                <input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
                        "placeholder:text-muted-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "transition-colors",
                        className,
                    )}
                    {...props}
                />
            </div>
        );
    },
);
Field.displayName = "Field";
