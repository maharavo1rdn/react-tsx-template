import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Circle } from "lucide-react";
import { cn } from "../../lib/utils";
import type { NavigationItem } from "../../types";

interface SidebarItemProps {
  item: NavigationItem;
  collapsed: boolean;
  onNavigate?: (() => void) | undefined;
  depth?: number | undefined;
}

const findFirstPath = (item: NavigationItem): string | undefined => {
  if (item.path) return item.path;
  return item.children?.map(findFirstPath).find(Boolean);
};

const isItemActive = (item: NavigationItem, pathname: string): boolean => {
  if (item.path && pathname === item.path) {
    return true;
  }

  return item.children?.some((child) => isItemActive(child, pathname)) ?? false;
};

export const SidebarItem = ({
  item,
  collapsed,
  onNavigate,
  depth = 0,
}: SidebarItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasChildren = !!item.children?.length;
  const active = isItemActive(item, location.pathname);
  const [manualOpen, setManualOpen] = useState(false);
  const expanded = active || manualOpen;
  const Icon = item.icon ?? Circle;

  const handleClick = () => {
    if (item.disabled) return;

    if (hasChildren) {
      if (collapsed) {
        const firstChildPath = findFirstPath(item);
        if (firstChildPath) {
          navigate(firstChildPath);
          onNavigate?.();
        }
        return;
      }

      setManualOpen((current) => !current);
    } else if (item.path) {
      navigate(item.path);
      onNavigate?.();
    }
  };

  return (
    <div className="min-w-0">
      <button
        onClick={handleClick}
        title={collapsed ? item.label : undefined}
        aria-current={!hasChildren && active ? "page" : undefined}
        aria-expanded={hasChildren && !collapsed ? expanded : undefined}
        disabled={item.disabled}
        className={cn(
          "group relative flex h-11 w-full items-center gap-3 rounded-lg px-3 text-base font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
          depth > 0 && "h-10 text-[0.95rem]",
          active && depth === 0
            ? "bg-[#fffdf8] text-brand-ink shadow-[inset_3px_0_0_#0284c7,inset_0_0_0_1px_rgba(223,216,201,0.9),0_1px_2px_rgba(23,32,51,0.05)]"
            : active
              ? "bg-transparent text-brand-ink shadow-[inset_2px_0_0_#0284c7]"
              : "text-slate-600 hover:bg-[#fffdf8] hover:text-brand-ink hover:shadow-[inset_0_0_0_1px_rgba(223,216,201,0.75)]",
          item.disabled &&
            "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-slate-600 hover:shadow-none"
        )}
      >
        <Icon
          size={depth > 0 ? 16 : 19}
          className={cn(
            "shrink-0 transition-colors",
            active ? "text-sky-700" : "text-slate-400",
            active && depth > 0 && "text-slate-600"
          )}
        />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-left">
              {item.label}
            </span>
            {item.badge && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[0.7rem] font-semibold text-slate-500">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronRight
                size={16}
                className={cn(
                  "text-slate-400 transition-transform duration-200",
                  expanded && "rotate-90 text-sky-600"
                )}
              />
            )}
          </>
        )}
      </button>

      {hasChildren && !collapsed && (
        <div
          className={cn(
            "grid transition-all duration-200 ease-in-out",
            expanded
              ? "mt-1 grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="overflow-hidden pl-5">
            <div className="flex flex-col gap-1 border-l border-slate-100 pl-3">
              {item.children?.map((child) => (
                <SidebarItem
                  key={child.id}
                  item={child}
                  collapsed={collapsed}
                  onNavigate={onNavigate}
                  depth={depth + 1}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
