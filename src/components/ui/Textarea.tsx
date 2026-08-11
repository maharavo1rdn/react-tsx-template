import { forwardRef, type TextareaHTMLAttributes, useId } from "react";
import { cn } from "../../lib/utils";
import type { FieldState } from "../../types";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    FieldState {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, className, id, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;
    const descriptionId = `${textareaId}-description`;
    const hasDescription = Boolean(error ?? helperText);

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          htmlFor={textareaId}
          className="text-[0.95rem] font-semibold text-slate-700"
        >
          {label}
        </label>
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            "min-h-32 resize-y rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition-all",
            "placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15",
            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15"
              : "border-slate-200",
            className
          )}
          aria-invalid={!!error}
          aria-describedby={hasDescription ? descriptionId : undefined}
          {...props}
        />
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
Textarea.displayName = "Textarea";
