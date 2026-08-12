import { Check } from "lucide-react";
import { forwardRef, type InputHTMLAttributes, useId } from "react";
import { cn } from "../../lib/utils";
import type { FieldState } from "../../types";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type">,
    FieldState {}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;
    const descriptionId = `${checkboxId}-description`;
    const hasDescription = Boolean(error ?? helperText);

    return (
      <div className="flex gap-3">
        <span className="relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
          <input
            id={checkboxId}
            ref={ref}
            type="checkbox"
            className={cn(
              "peer h-5 w-5 appearance-none rounded-md border border-slate-300 bg-white transition",
              "checked:border-primary checked:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60",
              error && "border-rose-400",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={hasDescription ? descriptionId : undefined}
            {...props}
          />
          <Check
            size={14}
            strokeWidth={3}
            className="pointer-events-none absolute text-white opacity-0 transition peer-checked:opacity-100"
            aria-hidden="true"
          />
        </span>
        <div className="min-w-0">
          <label
            htmlFor={checkboxId}
            className="text-[0.95rem] font-semibold text-slate-700"
          >
            {label}
          </label>
          {hasDescription && (
            <p
              id={descriptionId}
              className={cn(
                "mt-0.5 text-sm",
                error ? "text-rose-600" : "text-slate-500"
              )}
            >
              {error ?? helperText}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
