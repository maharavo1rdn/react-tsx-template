import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import type { NavItem } from "../../types/index";

export const SidebarItem = ({ item, collapsed }: { item: NavItem; collapsed: boolean }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const hasChildren = !!item.children?.length;

    const isPathActive = (path?: string) => path ? location.pathname.startsWith(path) : false;
    const isParentActive = hasChildren && item.children?.some(c => isPathActive(c.path));
    const isActive = !hasChildren && isPathActive(item.path);

    const [open, setOpen] = useState(isParentActive);

    const handleClick = () => {
        if (hasChildren) {
            if (!collapsed) setOpen(!open);
        } else if (item.onClick) {
            item.onClick();
        } else if (item.path) {
            navigate(item.path);
        }
    };

    return (
        <div>
            <button
                onClick={handleClick}
                title={collapsed ? item.label : undefined}
                className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/30",
                    (isActive || isParentActive)
                        ? "bg-primary-light text-primary"
                        : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                )}
            >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && (
                    <>
                        <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>
                        {hasChildren && (
                            <ChevronRight size={16} className={cn("transition-transform duration-200", open && "rotate-90")} />
                        )}
                    </>
                )}
            </button>

            {hasChildren && !collapsed && (
                <div
                    className={cn(
                        "grid transition-all duration-200 ease-in-out",
                        open ? "grid-rows-[1fr] opacity-100 mt-1" : "grid-rows-[0fr] opacity-0"
                    )}
                >
                    <div className="overflow-hidden flex flex-col gap-1 pl-9 pr-1">
                        {item.children!.map((child) => {
                            const isChildActive = location.pathname === child.path;
                            return (
                                <button
                                    key={child.id}
                                    onClick={() => navigate(child.path)}
                                    className={cn(
                                        "relative w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                                        isChildActive
                                            ? "text-primary font-semibold bg-primary-light/50"
                                            : "text-slate-500 hover:text-primary hover:bg-slate-50"
                                    )}
                                >
                                    {isChildActive && (
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-md" />
                                    )}
                                    <div className={cn("w-1.5 h-1.5 rounded-full", isChildActive ? "bg-primary" : "bg-slate-300")} />
                                    <span className="whitespace-nowrap">{child.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};