import { Layers } from "lucide-react";
import { appConfig } from "../../config/app";
import { cn } from "../../lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export const BrandMark = ({ compact = false, className }: BrandMarkProps) => {
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
            "flex shrink-0 items-center justify-center rounded-lg bg-sky-500 text-white shadow-sm",
            compact ? "h-10 w-10" : "h-12 w-12"
          )}
        >
          <Layers size={compact ? 20 : 24} />
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
