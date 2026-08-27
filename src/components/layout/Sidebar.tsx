import { useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  Inbox,
  Moon,
  PanelLeft,
  Search,
  Shield,
  Sun,
  X,
} from "lucide-react";
import { navigationSections } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { SidebarItem } from "./SidebarItem";
import type { UserRole } from "../../types/navigation";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
  AGENT_KYC: { label: "Agent KYC", badge: "KYC", color: "bg-blue-100 text-blue-800 border-blue-200" },
  RISK_ANALYST: { label: "Analyste Risque", badge: "RISK", color: "bg-amber-100 text-amber-800 border-amber-200" },
  CUSTOMER_SUPPORT: { label: "Support Client", badge: "SUPP", color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  SUPERVISOR: { label: "Superviseur / Admin", badge: "ADMIN", color: "bg-purple-100 text-purple-800 border-purple-200" },
};

export const Sidebar = ({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
  currentRole,
  onRoleChange,
}: SidebarProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const filteredSections = navigationSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) => !item.roles || item.roles.includes(currentRole)
      ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />

      {/* Main Sidebar Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh flex-col border-r border-slate-200/80 bg-[#f8fafc] dark:bg-slate-900 dark:border-slate-800 font-sans text-slate-800 dark:text-slate-100 transition-all duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16 lg:w-16" : "w-72 lg:w-72"
        )}
      >
        {/* Header / Brand */}
        <div
          className={cn(
            "flex h-14 items-center px-3.5 border-b border-slate-200/60 dark:border-slate-800",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {collapsed ? (
            <button
              onClick={onToggleCollapsed}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              aria-label="Déplier la sidebar"
            >
              <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                MK
              </div>
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-black text-white text-sm shadow-sm">
                  MK
                </div>
                <div>
                  <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white block leading-none">
                    Mkajy Hub
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                    Back-Office
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onCloseMobile}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 lg:hidden"
                  aria-label="Fermer la navigation"
                >
                  <X size={18} />
                </button>
                <button
                  onClick={onToggleCollapsed}
                  className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 lg:inline-flex"
                  aria-label="Replier la sidebar"
                >
                  <PanelLeft size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Role Switcher Widget */}
        <div className="px-3 pt-3">
          {collapsed ? (
            <button
              onClick={() => {
                const roles: UserRole[] = ["AGENT_KYC", "RISK_ANALYST", "CUSTOMER_SUPPORT", "SUPERVISOR"];
                const nextIndex = (roles.indexOf(currentRole) + 1) % roles.length;
                const nextRole = roles[nextIndex] ?? "SUPERVISOR";
                onRoleChange(nextRole);
              }}
              className="w-full flex justify-center py-2 rounded-lg bg-slate-200/60 dark:bg-slate-800 text-xs font-bold"
              title={`Rôle actuel: ${roleLabels[currentRole].label} (Cliquer pour changer)`}
            >
              <Shield size={16} className="text-indigo-600 dark:text-indigo-400" />
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-600"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Shield size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                      {roleLabels[currentRole].label}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Rôle actif</p>
                  </div>
                </div>
                <ChevronDown size={14} className="text-slate-400 shrink-0" />
              </button>

              {roleMenuOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-1 space-y-0.5">
                  {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onRoleChange(r);
                        setRoleMenuOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors",
                        r === currentRole
                          ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      )}
                    >
                      <span>{roleLabels[r].label}</span>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-mono font-bold", roleLabels[r].color)}>
                        {roleLabels[r].badge}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-5">
          {/* Quick search & System items */}
          <div className="flex flex-col gap-0.5">
            {collapsed ? (
              <>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  title="Recherche rapide"
                >
                  <Search size={19} />
                </button>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white relative"
                  title="Boîte de réception"
                >
                  <Inbox size={19} />
                </button>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white relative"
                  title="Alertes"
                >
                  <Bell size={19} />
                </button>
              </>
            ) : (
              <>
                <button className="flex h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <Search size={19} className="shrink-0 text-slate-500" />
                  <span className="text-[0.9375rem] font-medium text-slate-600 dark:text-slate-400">
                    Recherche globale
                  </span>
                </button>

                <button className="flex h-10 w-full items-center justify-between rounded-xl px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <div className="flex items-center gap-3">
                    <Inbox size={19} className="shrink-0 text-slate-500" />
                    <span className="text-[0.9375rem] font-medium">Dossiers récents</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    8
                  </span>
                </button>
              </>
            )}
          </div>

          <div className="h-px bg-slate-200/80 dark:bg-slate-800 -mx-3" />

          {/* Menu Sections */}
          <div className="flex flex-col gap-4">
            {filteredSections.map((section) => (
              <section key={section.id} className="min-w-0">
                {!collapsed && section.label && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {section.label}
                  </p>
                )}
                <div className="flex flex-col gap-1">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.id}
                      item={item}
                      collapsed={collapsed}
                      onNavigate={onCloseMobile}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-auto h-px bg-slate-200/80 dark:bg-slate-800 -mx-3" />

          {/* Bottom Preferences / Dark mode */}
          <div className="flex flex-col gap-0.5">
            {collapsed ? (
              <>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                  title={darkMode ? "Mode Clair" : "Mode Sombre"}
                >
                  {darkMode ? <Sun size={19} /> : <Moon size={19} />}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  {darkMode ? (
                    <Sun size={19} className="shrink-0 text-slate-500" />
                  ) : (
                    <Moon size={19} className="shrink-0 text-slate-500" />
                  )}
                  <span className="text-[0.9375rem] font-medium">
                    {darkMode ? "Mode Clair" : "Mode Sombre"}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 p-3">
          {collapsed ? (
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs">
                AG
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 font-bold text-xs text-slate-800 dark:text-slate-200">
                  AG
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                    Agent Opérationnel
                  </p>
                  <p className="truncate text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    agent.internal@mkajy.mg
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
