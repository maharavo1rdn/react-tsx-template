import type { LucideIcon } from "lucide-react";

export interface NavChild {
  id: string;
  label: string;
  path: string;
}

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  children?: NavChild[];
  onClick?: () => void;
}