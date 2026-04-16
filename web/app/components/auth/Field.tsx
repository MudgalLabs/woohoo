import { InputHTMLAttributes, forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
