import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";
import type { NavItem } from "../types/index";

export const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    id: "customers",
    label: "Clients",
    icon: Users,
    children: [
      { id: "customer-list", label: "Liste des clients", path: "/customers" },
      { id: "customer-create", label: "Nouveau client", path: "/customers/create" },
    ],
  },
];

export const footerItems: NavItem[] = [
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    path: "/settings",
  },
  {
    id: "logout",
    label: "Déconnexion",
    icon: LogOut,
    onClick: () => console.log("Déconnexion..."),
  },
];