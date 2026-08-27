import { useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Menu, Search, ShieldCheck } from "lucide-react";
import { navigationSections } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { Sidebar } from "./Sidebar";
import type { UserRole } from "../../types/navigation";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem("mkajy-user-role");
    return (saved as UserRole) || "SUPERVISOR";
  });

  const location = useLocation();

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    localStorage.setItem("mkajy-user-role", role);
  };

  const currentPage = useMemo(() => {
    const items = navigationSections.flatMap((section) => section.items);
    const nestedItems = items.flatMap((item) => [item, ...(item.children ?? [])]);
    return nestedItems.find((item) => item.path === location.pathname)?.label ?? "Espace de travail";
  }, [location.pathname]);

  const roleBadges: Record<UserRole, string> = {
    AGENT_KYC: "Agent KYC",
    RISK_ANALYST: "Analyste Risque",
    CUSTOMER_SUPPORT: "Support Client",
    SUPERVISOR: "Superviseur / Admin",
  };

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
      />

      <div
        className={cn(
          "min-h-dvh transition-[padding] duration-300 lg:pl-72",
          sidebarCollapsed && "lg:pl-16"
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 backdrop-blur sm:px-6 lg:px-8">
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Ouvrir la navigation"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1 flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Mkajy Hub
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  <ShieldCheck size={11} className="text-indigo-600 dark:text-indigo-400" />
                  {roleBadges[currentRole]}
                </span>
              </div>
              <h1 className="truncate text-base font-bold text-slate-900 dark:text-white leading-tight">
                {currentPage}
              </h1>
            </div>
          </div>

          <div className="hidden h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-400 shadow-sm md:flex">
            <Search size={15} />
            <span>Rechercher dossier, CIN, ALIAS...</span>
          </div>

          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none relative"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
          </button>
        </header>

        <main className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl py-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
