import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-slate-200/70", className)} />
);

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <div className="ui-panel-muted flex flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-sky-700 shadow-[0_1px_2px_rgba(23,32,51,0.08)]">
      <Icon size={22} />
    </div>
    <h2 className="text-base font-semibold text-slate-950">{title}</h2>
    <p className="mt-1 max-w-md text-[0.95rem] text-slate-500">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);

interface ToastProps {
  tone?: "success" | "warning" | "error" | "info";
  title: string;
  description?: string;
}

export const Toast = ({ tone = "info", title, description }: ToastProps) => {
  const toneMap = {
    success: {
      icon: CheckCircle2,
      rail: "border-l-emerald-600",
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    warning: {
      icon: AlertCircle,
      rail: "border-l-amber-600",
      iconClassName: "bg-amber-100 text-amber-800",
    },
    error: {
      icon: XCircle,
      rail: "border-l-rose-600",
      iconClassName: "bg-rose-100 text-rose-700",
    },
    info: {
      icon: Info,
      rail: "border-l-sky-700",
      iconClassName: "bg-[#e7f1f6] text-sky-800",
    },
  };
  const { icon: Icon, rail, iconClassName } = toneMap[tone];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border-l-4 bg-[#fffefd] p-4 text-[0.95rem] text-slate-700 shadow-[0_1px_2px_rgba(23,32,51,0.05),0_10px_24px_rgba(23,32,51,0.06)]",
        rail
      )}
      role="status"
    >
      <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md", iconClassName)}>
        <Icon size={18} />
      </span>
      <div>
        {title && <p className="font-semibold text-slate-950">{title}</p>}
        {description && <p className="mt-1 text-slate-600">{description}</p>}
      </div>
    </div>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <p className="mt-2 text-[0.95rem] text-slate-500">{description}</p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
