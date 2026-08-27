import { useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Bell, Menu, Search } from "lucide-react";
import { navigationSections } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { Sidebar } from "./Sidebar";

export const AppLayout = ({ children }: { children: ReactNode }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const location = useLocation();

    const currentPage = useMemo(() => {
        const items = navigationSections.flatMap((section) => section.items);
        const nestedItems = items.flatMap((item) => [item, ...(item.children ?? [])]);
        return nestedItems.find((item) => item.path === location.pathname)?.label ?? "Espace de travail";
    }, [location.pathname]);

    return (
        <div className="min-h-dvh bg-background text-slate-700">
            <Sidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                onCloseMobile={() => setMobileSidebarOpen(false)}
                onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
            />

            <div
                className={cn(
                    "min-h-dvh transition-[padding] duration-300 lg:pl-72",
                    sidebarCollapsed && "lg:pl-16"
                )}
            >
                <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background/90 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 lg:hidden"
                        onClick={() => setMobileSidebarOpen(true)}
                        aria-label="Ouvrir la navigation"
                    >
                        <Menu size={18} />
                    </button>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-500">Mkajy Hub</p>
                        <h1 className="truncate text-lg font-semibold text-slate-950 sm:text-xl">{currentPage}</h1>
                    </div>
                    <div className="hidden h-9 w-full max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-400 shadow-sm md:flex">
                        <Search size={16} />
                        <span>Quick search</span>
                    </div>
                    <button
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
                        aria-label="Notifications"
                    >
                        <Bell size={17} />
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
