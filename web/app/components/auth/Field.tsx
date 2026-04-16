import { InputHTMLAttributes, forwardRef } from "react";
import { Label, Input } from "@woohoo/ui";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Field = forwardRef<HTMLInputElement, FieldProps>(
    ({ label, id, ...props }, ref) => {
        const inputId = id ?? props.name ?? label.toLowerCase();
        return (
            <div className="space-y-2">
                <Label htmlFor={inputId}>{label}</Label>
                <Input id={inputId} ref={ref} {...props} />
            </div>
        );
    },
);
Field.displayName = "Field";
