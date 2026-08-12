import {
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  Settings,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import type { NavigationSection } from "../types";

export const navigationSections: NavigationSection[] = [
  {
    id: "main",
    label: "Pilotage",
    items: [
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
          {
            id: "customer-list",
            label: "Liste des clients",
            path: "/customers",
            icon: ListChecks,
          },
          {
            id: "customer-create",
            label: "Nouveau client",
            path: "/customers/create",
            icon: UserPlus,
          },
        ],
      },
    ],
  },
  {
    id: "system",
    label: "Administration",
    items: [
      {
        id: "security",
        label: "Sécurité",
        icon: ShieldCheck,
        path: "/security",
        disabled: true,
      },
      {
        id: "settings",
        label: "Paramètres",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];

export const supportNavigation: NavigationSection = {
  id: "support",
  items: [
    {
      id: "help",
      label: "Support",
      icon: LifeBuoy,
      path: "/support",
    },
  ],
};
