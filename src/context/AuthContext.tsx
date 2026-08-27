import React, { createContext, useContext, useState, useEffect } from "react";
import type { UserRole, UserProfile, PermissionCheck, AuditLogItem } from "../types/rbac";

interface AuthContextType {
  user: UserProfile;
  setRole: (role: UserRole) => void;
  permissions: PermissionCheck;
  theme: "light" | "dark";
  toggleTheme: () => void;
  auditLogs: AuditLogItem[];
  logAction: (action: string, details: string) => void;
}

const defaultUser: UserProfile = {
  id: "AGT-9042",
  name: "Brooklyn Vance",
  email: "b.vance@bank-admin.io",
  role: "SUPERVISOR",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialAuditLogs: AuditLogItem[] = [
  {
    id: "LOG-1001",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    agentId: "AGT-9042",
    agentName: "Brooklyn Vance",
    agentRole: "SUPERVISOR",
    action: "CONNEXION_SESSION",
    details: "Connexion réussie au Back-Office d'Administration",
    ipAddress: "192.168.1.45",
  },
  {
    id: "LOG-1002",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    agentId: "AGT-1024",
    agentName: "Marc Randria",
    agentRole: "AGENT_KYC",
    action: "KYC_VERROUILLAGE",
    details: "Prise en charge du dossier KYC #DOS-8821",
    ipAddress: "192.168.1.88",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("bo_theme") as "light" | "dark") || "light";
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("bo_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setRole = (role: UserRole) => {
    setUser((prev) => ({ ...prev, role }));
    logAction("CHANGEMENT_ROLE", `Le rôle de l'agent a été basculé sur : ${role}`);
  };

  const logAction = (action: string, details: string) => {
    const newLog: AuditLogItem = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      agentId: user.id,
      agentName: user.name,
      agentRole: user.role,
      action,
      details,
      ipAddress: "192.168.1.45",
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const permissions: PermissionCheck = {
    canValidateKYC: user.role === "AGENT_KYC" || user.role === "SUPERVISOR",
    canManageRisk: user.role === "RISK_ANALYST" || user.role === "SUPERVISOR",
    canPerformUnbarring: user.role === "RISK_ANALYST" || user.role === "SUPERVISOR",
    canExportData: user.role === "RISK_ANALYST" || user.role === "SUPERVISOR",
    canViewAuditLogs: user.role === "SUPERVISOR",
    canReassignKYC: user.role === "SUPERVISOR",
    canResendNotifications: user.role === "CUSTOMER_SUPPORT" || user.role === "SUPERVISOR",
    canModifySystem: user.role === "SUPERVISOR",
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setRole,
        permissions,
        theme,
        toggleTheme,
        auditLogs,
        logAction,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
