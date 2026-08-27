import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import type { NavItemConfig } from "../../config/navigation";

interface SidebarItemProps {
  item: NavItemConfig;
  collapsed: boolean;
  onNavigate?: () => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  item,
  collapsed,
  onNavigate,
}) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          "group relative flex h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors duration-150",
          isActive
            ? "bg-white text-blue-600 shadow-xs border border-slate-200/80 font-semibold dark:bg-slate-800 dark:border-slate-700 dark:text-blue-400"
            : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200",
          collapsed && "justify-center px-0"
        )
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon
        size={19}
        className={cn(
          "shrink-0 text-slate-500 transition-colors group-hover:text-slate-800 dark:text-slate-400 dark:group-hover:text-slate-200",
          collapsed ? "" : "mr-3"
        )}
      />

      {!collapsed && (
        <span className="truncate flex-1 text-slate-700 dark:text-slate-200 group-hover:text-slate-900">
          {item.label}
        </span>
      )}

      {!collapsed && item.badge && (
        <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
          {item.badge}
        </span>
      )}

      {collapsed && item.badge && (
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600" />
      )}
    </NavLink>
  );
};
