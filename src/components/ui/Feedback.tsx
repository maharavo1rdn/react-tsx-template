import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-lg bg-slate-100", className)} />
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
  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-white text-slate-400 shadow-sm">
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
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    warning: {
      icon: AlertCircle,
      className: "border-amber-200 bg-amber-50 text-amber-700",
    },
    error: {
      icon: XCircle,
      className: "border-rose-200 bg-rose-50 text-rose-700",
    },
    info: { icon: Info, className: "border-sky-200 bg-sky-50 text-sky-700" },
  };
  const { icon: Icon, className } = toneMap[tone];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4 text-[0.95rem]",
        className
      )}
      role="status"
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        {description && <p className="mt-1 opacity-80">{description}</p>}
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
