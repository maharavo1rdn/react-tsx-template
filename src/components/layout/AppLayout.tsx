import React, { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Menu, Command } from "lucide-react";
import { navigationSections } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const currentPage = useMemo(() => {
    const items = navigationSections.flatMap((section) => section.items);
    return items.find((item) => item.path === location.pathname)?.label ?? "Espace Agents";
  }, [location.pathname]);

  return (
    <div className="min-h-dvh bg-[#f4f5f9] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div
        className={cn(
          "min-h-dvh transition-[padding] duration-300",
          sidebarCollapsed ? "lg:pl-18" : "lg:pl-72"
        )}
      >
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 lg:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Ouvrir la navigation"
            >
              <Menu size={18} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl tracking-tight">
                  {currentPage}
                </h1>
                <span className="hidden sm:inline-block rounded-md bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-800/50">
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Keyboard shortcut badge */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Command size={13} />
              <span>Raccourcis: <kbd className="font-mono bg-white dark:bg-slate-700 px-1 rounded border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300">Alt+A</kbd> Valider / <kbd className="font-mono bg-white dark:bg-slate-700 px-1 rounded border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300">Alt+R</kbd> Rejeter</span>
            </div>

            {/* Notifications button */}
            <button
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              aria-label="Alertes systeme"
              title="3 alertes de risques"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* User Profile avatar quick view */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <span className="hidden md:inline-block text-xs font-semibold text-slate-800 dark:text-slate-200">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="px-4 pb-12 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
