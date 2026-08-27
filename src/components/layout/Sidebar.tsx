import React, { useState } from "react";
import {
  X,
  PanelLeftClose,
  PanelLeft,
  Sun,
  Moon,
  ChevronsUpDown,
  Search,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { navigationSections } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { SidebarItem } from "./SidebarItem";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types/rbac";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

const roleLabels: Record<UserRole, { label: string; bg: string }> = {
  AGENT_KYC: { label: "Agent KYC", bg: "bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  RISK_ANALYST: { label: "Analyste Risque", bg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400" },
  CUSTOMER_SUPPORT: { label: "Support Client", bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" },
  SUPERVISOR: { label: "Superviseur", bg: "bg-blue-500/10 text-blue-700 dark:text-blue-400" },
};

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}) => {
  const { user, setRole, theme, toggleTheme } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  // Filter items based on active role
  const filteredSections = navigationSections.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) => !item.roles || item.roles.includes(user.role)
    ),
  }));

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />

      {/* Main Sidebar Panel matching layout c255eb6357234d439703a30daa991108.jpg */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh flex-col bg-[#f8fafc] border-r border-slate-200/90 dark:bg-slate-900 dark:border-slate-800 transition-all duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-18 lg:w-18" : "w-72 lg:w-72"
        )}
      >
        {/* Top Header Logo & Collapse Toggle */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm font-bold text-lg">
              <Zap size={20} className="fill-white" />
            </div>
            {!collapsed && (
              <span className="truncate text-base font-bold text-slate-900 dark:text-white tracking-tight">
                FinAdmin<span className="text-blue-600 font-semibold">.bo</span>
              </span>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={onToggleCollapsed}
            className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 lg:inline-flex"
            aria-label={collapsed ? "Déplier le menu" : "Replier le menu"}
          >
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>

          <button
            onClick={onCloseMobile}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Content */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Quick Search trigger in sidebar (matching design c255eb6357234d439703a30daa991108.jpg) */}
          {!collapsed ? (
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Recherche rapide..."
                className="w-full rounded-lg bg-slate-200/50 dark:bg-slate-800 py-1.5 pl-9 pr-3 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ) : (
            <button className="flex h-9 w-full items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800" title="Recherche">
              <Search size={18} />
            </button>
          )}

          {/* Core Navigation Items */}
          {filteredSections.map((section) => (
            <div key={section.id} className="space-y-1">
              {!collapsed && section.label && (
                <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {section.label}
                </p>
              )}
              {section.items.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  collapsed={collapsed}
                  onNavigate={onCloseMobile}
                />
              ))}
            </div>
          ))}

          {/* Status banner in expanded mode matching "Current plan: Pro trial" box in c255eb6357234d439703a30daa991108.jpg */}
          {!collapsed && (
            <div className="mt-4 rounded-xl bg-blue-50 p-3 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40">
              <div className="flex items-center gap-2 text-xs font-medium text-blue-900 dark:text-blue-200">
                <CheckCircle2 size={15} className="text-blue-600 dark:text-blue-400" />
                <span>Session Sécurisée</span>
              </div>
              <p className="mt-1 text-[11px] text-blue-700 dark:text-blue-300">
                SLA en direct : <span className="font-semibold text-emerald-600 dark:text-emerald-400">99.98% Opérationnel</span>
              </p>
            </div>
          )}
        </nav>

        {/* Bottom Menu items (Theme Toggle & Role Switcher) */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 p-3 space-y-1">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className={cn(
              "flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800/60 transition-colors",
              collapsed && "justify-center px-0"
            )}
            title="Changer de thème"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            {!collapsed && (
              <span className="ml-3 text-slate-700 dark:text-slate-300">
                Mode {theme === "light" ? "Sombre" : "Clair"}
              </span>
            )}
          </button>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen((prev) => !prev)}
              className={cn(
                "flex w-full items-center rounded-xl p-2 transition hover:bg-slate-200/50 dark:hover:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800",
                collapsed ? "justify-center" : "justify-between"
              )}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover shrink-0 border border-slate-300 dark:border-slate-700"
                />
                {!collapsed && (
                  <div className="flex flex-col items-start text-left overflow-hidden">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-medium px-1.5 py-0.2 rounded mt-0.5",
                        roleLabels[user.role].bg
                      )}
                    >
                      {roleLabels[user.role].label}
                    </span>
                  </div>
                )}
              </div>
              {!collapsed && <ChevronsUpDown size={15} className="text-slate-400 shrink-0" />}
            </button>

            {/* Role selection dropdown */}
            {roleMenuOpen && (
              <div
                className={cn(
                  "absolute bottom-full mb-2 z-50 w-56 rounded-xl bg-white dark:bg-slate-800 p-2 shadow-xl border border-slate-200 dark:border-slate-700",
                  collapsed ? "left-12" : "left-0"
                )}
              >
                <p className="px-2 py-1 text-[11px] font-bold uppercase text-slate-400">
                  Changer de rôle (RBAC)
                </p>
                {(["AGENT_KYC", "RISK_ANALYST", "CUSTOMER_SUPPORT", "SUPERVISOR"] as UserRole[]).map(
                  (r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-left transition hover:bg-slate-100 dark:hover:bg-slate-700/60",
                        user.role === r && "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-semibold"
                      )}
                    >
                      <span>{roleLabels[r].label}</span>
                      {user.role === r && <CheckCircle2 size={14} className="text-blue-600" />}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
