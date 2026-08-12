import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading,
      disabled,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        "border-transparent bg-primary text-white shadow-sm hover:bg-primary-hover",
      secondary:
        "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
      outline: "border-slate-200 bg-transparent text-slate-700 hover:bg-white",
      ghost:
        "border-transparent bg-transparent text-slate-600 hover:bg-white hover:text-slate-950",
      danger:
        "border-transparent bg-rose-600 text-white shadow-sm hover:bg-rose-700",
    };
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-[0.95rem]",
      lg: "h-11 px-5 text-base",
      icon: "h-9 w-9 px-0",
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:pointer-events-none disabled:opacity-55",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
