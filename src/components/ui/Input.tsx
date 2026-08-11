import { type InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "../../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, ...props }, ref) => {
        const id = useId();
        return (
            <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor={id} className="text-sm font-medium text-slate-700">
                    {label}
                </label>
                <input
                    id={id}
                    ref={ref}
                    className={cn(
                        "px-3 py-2 bg-surface border rounded-md text-sm transition-all outline-none",
                        "placeholder:text-slate-400",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-slate-200",
                        className
                    )}
                    aria-invalid={!!error}
                    {...props}
                />
                {error && <span className="text-xs text-red-500">{error}</span>}
            </div>
        );
    }
);
Input.displayName = "Input";