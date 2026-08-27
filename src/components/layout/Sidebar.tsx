import { useState } from "react";
import {
  Bell,
  ChevronsUpDown,
  HelpCircle,
  Inbox,
  Moon,
  PanelLeft,
  Palette,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { navigationSections } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapsed: () => void;
}

export const Sidebar = ({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapsed,
}: SidebarProps) => {
  const [darkMode, setDarkMode] = useState(false);

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
          "fixed inset-y-0 left-0 z-50 flex h-dvh flex-col border-r border-slate-200/80 bg-[#f3f4f6] font-sans text-slate-800 transition-all duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16 lg:w-16" : "w-72 lg:w-72"
        )}
      >
        {/* Header / Brand */}
        <div
          className={cn(
            "flex h-14 items-center px-3.5 border-b border-slate-200/60",
            collapsed ? "justify-center" : "justify-between"
          )}
        >
          {collapsed ? (
            <button
              onClick={onToggleCollapsed}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-indigo-600 hover:bg-slate-200/60 transition-colors"
              aria-label="Déplier la sidebar"
            >
              {/* Sun/Point Logo icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-indigo-600"
              >
                <path
                  d="M12 3V6M12 18V21M3 12H6M18 12H21M5.636 5.636L7.757 7.757M16.243 16.243L18.364 18.364M5.636 18.364L7.757 16.243M16.243 7.757L18.364 5.636"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-600">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-indigo-600"
                  >
                    <path
                      d="M12 3V6M12 18V21M3 12H6M18 12H21M5.636 5.636L7.757 7.757M16.243 16.243L18.364 18.364M5.636 18.364L7.757 16.243M16.243 7.757L18.364 5.636"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">
                  Mkajy Hub
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={onCloseMobile}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 lg:hidden"
                  aria-label="Fermer la navigation"
                >
                  <X size={18} />
                </button>
                <button
                  onClick={onToggleCollapsed}
                  className="hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 hover:text-slate-800 lg:inline-flex"
                  aria-label="Replier la sidebar"
                >
                  <PanelLeft size={18} />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Navigation Content */}
        <div className="no-scrollbar flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-5">
          {/* Quick search & System items (Inbox, Notifications) */}
          <div className="flex flex-col gap-0.5">
            {collapsed ? (
              <>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                  title="Quick search"
                >
                  <Search size={19} />
                </button>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 relative"
                  title="Inbox"
                >
                  <Inbox size={19} />
                </button>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 relative"
                  title="Notifications"
                >
                  <Bell size={19} />
                </button>
              </>
            ) : (
              <>
                <button className="flex h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                  <Search size={19} className="shrink-0 text-slate-500" />
                  <span className="text-[0.9375rem] font-medium text-slate-600">
                    Quick search
                  </span>
                </button>

                <button className="flex h-10 w-full items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <Inbox size={19} className="shrink-0 text-slate-500" />
                    <span className="text-[0.9375rem] font-medium">Inbox</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">12</span>
                </button>

                <button className="flex h-10 w-full items-center justify-between rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell size={19} className="shrink-0 text-slate-500" />
                    <span className="text-[0.9375rem] font-medium">Notifications</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">15+</span>
                </button>
              </>
            )}
          </div>

          <div className="h-px bg-slate-200/80 -mx-3" />

          {/* Menu Sections */}
          <div className="flex flex-col gap-4">
            {navigationSections.map((section) => (
              <section key={section.id} className="min-w-0">
                {!collapsed && section.label && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
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

          <div className="mt-auto h-px bg-slate-200/80 -mx-3" />

          {/* Bottom Preferences / Dark mode / Themes / Help */}
          <div className="flex flex-col gap-0.5">
            {collapsed ? (
              <>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                  title="Preferences"
                >
                  <Settings size={19} />
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                  title="Dark mode"
                >
                  <Moon size={19} />
                </button>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                  title="Themes"
                >
                  <Palette size={19} />
                </button>
                <button
                  className="flex h-10 w-full items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200/50 hover:text-slate-900"
                  title="Help"
                >
                  <HelpCircle size={19} />
                </button>
              </>
            ) : (
              <>
                <button className="flex h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                  <Settings size={19} className="shrink-0 text-slate-500" />
                  <span className="text-[0.9375rem] font-medium">Preferences</span>
                </button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors"
                >
                  <Moon size={19} className="shrink-0 text-slate-500" />
                  <span className="text-[0.9375rem] font-medium">Dark mode</span>
                </button>
                <button className="flex h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                  <Palette size={19} className="shrink-0 text-slate-500" />
                  <span className="text-[0.9375rem] font-medium">Themes</span>
                </button>
                <button className="flex h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 transition-colors">
                  <HelpCircle size={19} className="shrink-0 text-slate-500" />
                  <span className="text-[0.9375rem] font-medium">Help</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Profile Footer */}
        <div className="border-t border-slate-200/80 p-3">
          {collapsed ? (
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                <User size={18} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl p-1 hover:bg-slate-200/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <User size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    Brooklyn
                  </p>
                </div>
              </div>
              <ChevronsUpDown size={16} className="text-slate-400 shrink-0 mr-1" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
