import {
  ArrowLeftRight,
  FileCheck2,
  LayoutDashboard,
  LifeBuoy,
  ShieldAlert,
} from "lucide-react";
import type { NavigationSection } from "../types/navigation";

export const navigationSections: NavigationSection[] = [
  {
    id: "ops",
    label: "Opérations",
    items: [
      {
        id: "dashboard",
        label: "Tableau de bord & Audit",
        icon: LayoutDashboard,
        path: "/dashboard",
        roles: ["SUPERVISOR", "RISK_ANALYST"],
      },
      {
        id: "kyc-validation",
        label: "Validation KYC",
        icon: FileCheck2,
        path: "/customers",
        roles: ["AGENT_KYC", "SUPERVISOR"],
      },
      {
        id: "transactions",
        label: "Monitoring Transactions",
        icon: ArrowLeftRight,
        path: "/settings",
        roles: ["RISK_ANALYST", "SUPERVISOR"],
      },
      {
        id: "suspensions",
        label: "Suspensions & Recouvrement",
        icon: ShieldAlert,
        path: "/customers/create",
        roles: ["RISK_ANALYST", "SUPERVISOR"],
      },
      {
        id: "support-client",
        label: "Support Client",
        icon: LifeBuoy,
        path: "/support",
        roles: ["CUSTOMER_SUPPORT", "SUPERVISOR"],
      },
    ],
  },
];
