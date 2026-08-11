import { ChevronDown } from "lucide-react";
import { forwardRef, type SelectHTMLAttributes, useId } from "react";
import { cn } from "../../lib/utils";
import type { FieldState, SelectOption } from "../../types";

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    FieldState {
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, helperText, error, options, placeholder, className, id, ...props },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;
    const descriptionId = `${selectId}-description`;
    const hasDescription = Boolean(error ?? helperText);

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-[0.95rem] font-semibold text-slate-700"
        >
          {label}
        </label>
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "h-11 w-full appearance-none rounded-lg border bg-white px-3 pr-9 text-base text-slate-900 outline-none transition-all",
              "focus:border-primary focus:ring-2 focus:ring-primary/15",
              "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
              error
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
                : "border-slate-200",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={hasDescription ? descriptionId : undefined}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
        </div>
        {hasDescription && (
          <span
            id={descriptionId}
            className={cn(
              "text-sm",
              error ? "text-rose-600" : "text-slate-500"
            )}
          >
            {error ?? helperText}
          </span>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
