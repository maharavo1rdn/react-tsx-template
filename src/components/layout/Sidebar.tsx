import { useState } from "react";
import { ChevronRight, ChevronLeft, Layers } from "lucide-react";
import { navItems, footerItems } from "../../config/navigation";
import { cn } from "../../lib/utils";
import { SidebarItem } from "./SidebarItem";

export const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 h-screen bg-surface border-r border-slate-200 shadow-[2px_0_8px_rgba(14,165,233,0.02)] flex flex-col transition-all duration-300 z-50",
                collapsed ? "w-20" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 min-h-[64px] border-b border-slate-100">
                <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "opacity-0 hidden")}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <Layers size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-900 whitespace-nowrap">AdminPro</span>
                </div>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:bg-primary-light hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 shrink-0 mx-auto"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            <nav className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden no-scrollbar">
                {!collapsed && <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Menu</p>}
                <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                        <SidebarItem key={item.id} item={item} collapsed={collapsed} />
                    ))}
                </div>
            </nav>

            <div className="p-3 border-t border-slate-100">
                <div className="flex flex-col gap-1">
                    {footerItems.map((item) => (
                        <SidebarItem key={item.id} item={item} collapsed={collapsed} />
                    ))}
                </div>
            </div>
        </aside>
    );
};