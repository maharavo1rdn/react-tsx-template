import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { navigationSections, supportNavigation } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { BrandMark } from "./BrandMark";
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
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-[2px] transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-72 flex-col bg-surface/95 shadow-[10px_0_35px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-300 lg:translate-x-0 lg:shadow-[1px_0_0_rgba(226,232,240,0.75)]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-20" : "lg:w-72"
        )}
      >
        <div className="flex min-h-18 items-center gap-3 px-4">
          <BrandMark
            compact
            className={cn(
              "flex-1 transition-opacity duration-200",
              collapsed && "lg:pointer-events-none lg:[&>div:last-child]:hidden"
            )}
          />
          <button
            onClick={onCloseMobile}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 lg:hidden"
            aria-label="Fermer la navigation"
          >
            <X size={18} />
          </button>
          <button
            onClick={onToggleCollapsed}
            className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-[#fffefd] hover:text-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 lg:inline-flex"
            aria-label={collapsed ? "Déplier la sidebar" : "Replier la sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          <div className="flex flex-col gap-5">
            {navigationSections.map((section) => (
              <section key={section.id} className="min-w-0">
                {section.label && (
                  <p
                    className={cn(
                      "mb-2 px-3 text-xs font-semibold uppercase text-slate-400 transition-opacity",
                      collapsed && "lg:opacity-0"
                    )}
                  >
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
        </nav>

        <div className="px-3 pb-4">
          {supportNavigation.items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              onNavigate={onCloseMobile}
            />
          ))}
        </div>
      </aside>
    </>
  );
};
