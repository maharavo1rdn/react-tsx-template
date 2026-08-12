import { forwardRef, type InputHTMLAttributes, useId } from "react";
import { cn } from "../../lib/utils";
import type { FieldState } from "../../types";

interface SwitchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type">,
    FieldState {}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, helperText, error, className, id, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id ?? generatedId;
    const descriptionId = `${switchId}-description`;
    const hasDescription = Boolean(error ?? helperText);

    return (
      <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="min-w-0">
          <label
            htmlFor={switchId}
            className="text-[0.95rem] font-semibold text-slate-800"
          >
            {label}
          </label>
          {hasDescription && (
            <p
              id={descriptionId}
              className={cn(
                "mt-1 text-sm",
                error ? "text-rose-600" : "text-slate-500"
              )}
            >
              {error ?? helperText}
            </p>
          )}
        </div>
        <input
          id={switchId}
          ref={ref}
          type="checkbox"
          role="switch"
          className={cn(
            "h-6 w-11 shrink-0 appearance-none rounded-full bg-slate-200 transition",
            "before:block before:h-5 before:w-5 before:translate-x-0.5 before:translate-y-0.5 before:rounded-full before:bg-white before:shadow-sm before:transition",
            "checked:bg-primary checked:before:translate-x-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={hasDescription ? descriptionId : undefined}
          {...props}
        />
      </div>
    );
  }
);
Switch.displayName = "Switch";
