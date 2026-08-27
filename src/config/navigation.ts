import {
  LayoutDashboard,
  FileCheck2,
  Receipt,
  UserX2,
  History,
  Users,
  HelpCircle,
} from "lucide-react";
import type { UserRole } from "../types/rbac";

export interface NavItemConfig {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: string | number;
  roles?: UserRole[];
}

export interface NavSectionConfig {
  id: string;
  label?: string;
  items: NavItemConfig[];
}

export const navigationSections: NavSectionConfig[] = [
  {
    id: "main",
    label: "Menu",
    items: [
      {
        id: "dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        id: "kyc",
        label: "Validation KYC",
        icon: FileCheck2,
        path: "/kyc",
        badge: "8 en attente",
        roles: ["AGENT_KYC", "SUPERVISOR"],
      },
      {
        id: "transactions",
        label: "Transactions",
        icon: Receipt,
        path: "/transactions",
        roles: ["RISK_ANALYST", "SUPERVISOR"],
      },
      {
        id: "suspensions",
        label: "Suspensions & Recouvrement",
        icon: UserX2,
        path: "/suspensions",
        badge: "3",
        roles: ["RISK_ANALYST", "SUPERVISOR"],
      },
      {
        id: "support",
        label: "Support Client",
        icon: Users,
        path: "/support",
        roles: ["CUSTOMER_SUPPORT", "SUPERVISOR"],
      },
      {
        id: "audit-logs",
        label: "Journal d'Audit",
        icon: History,
        path: "/audit-logs",
        roles: ["SUPERVISOR"],
      },
    ],
  },
];

export const bottomNavigationItems: NavItemConfig[] = [
  {
    id: "help",
    label: "Aide & Support",
    icon: HelpCircle,
    path: "/support",
  },
];
