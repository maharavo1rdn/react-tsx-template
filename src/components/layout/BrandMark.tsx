import { Layers } from "lucide-react";
import { appConfig } from "../../config/app";
import { cn } from "../../lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export const BrandMark = ({ compact = false, className }: BrandMarkProps) => {
  const monogram = appConfig.name.slice(0, 2).toUpperCase();

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      {appConfig.logoSrc ? (
        <img
          src={appConfig.logoSrc}
          alt={`${appConfig.name} logo`}
          className={cn(
            "shrink-0 rounded-lg object-contain",
            compact ? "h-10 w-10" : "h-12 w-12"
          )}
        />
      ) : (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-lg bg-brand-ink font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_10px_24px_rgba(23,32,51,0.14)]",
            compact ? "h-10 w-10" : "h-12 w-12"
          )}
        >
          {monogram || <Layers size={compact ? 20 : 24} />}
        </div>
      )}
      <div className={cn("min-w-0", compact && "leading-tight")}>
        <p
          className={cn(
            "truncate font-bold text-slate-950",
            compact ? "text-base" : "text-xl"
          )}
        >
          {appConfig.name}
        </p>
        <p
          className={cn(
            "truncate text-slate-500",
            compact ? "text-sm" : "text-base"
          )}
        >
          {appConfig.tagline}
        </p>
      </div>
    </div>
  );
};
