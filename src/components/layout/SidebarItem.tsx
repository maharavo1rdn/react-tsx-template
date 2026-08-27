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
  const [expanded, setExpanded] = useState(active);
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

      setExpanded((current) => !current);
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
          "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/20",
          collapsed ? "h-11 justify-center px-0" : "h-10 justify-start",
          active
            ? "bg-white text-slate-900 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-slate-950/5 font-semibold"
            : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900",
          item.disabled &&
            "cursor-not-allowed opacity-40 hover:bg-transparent hover:text-slate-600"
        )}
      >
        <Icon
          size={19}
          className={cn(
            "shrink-0 transition-colors",
            active ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
          )}
        />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1 truncate text-left text-[0.9375rem] font-medium text-slate-700 group-hover:text-slate-950">
              {item.label}
            </span>
            {item.badge && (
              <span className="text-xs font-semibold text-slate-500">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <ChevronRight
                size={16}
                className={cn(
                  "text-slate-400 transition-transform duration-200",
                  expanded && "rotate-90 text-slate-600"
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
          <div className="overflow-hidden pl-4">
            <div className="flex flex-col gap-1 border-l border-slate-200/60 pl-2">
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
