import type { LucideIcon } from "lucide-react";

export type UserRole = "AGENT_KYC" | "RISK_ANALYST" | "CUSTOMER_SUPPORT" | "SUPERVISOR";

export interface NavigationItem {
  id: string;
  label: string;
  path?: string;
  icon?: LucideIcon;
  badge?: string;
  disabled?: boolean;
  roles?: UserRole[];
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  label?: string;
  roles?: UserRole[];
  items: NavigationItem[];
}
