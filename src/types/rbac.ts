export type UserRole = "AGENT_KYC" | "RISK_ANALYST" | "CUSTOMER_SUPPORT" | "SUPERVISOR";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | undefined;
}

export interface PermissionCheck {
  canValidateKYC: boolean;
  canManageRisk: boolean;
  canPerformUnbarring: boolean;
  canExportData: boolean;
  canViewAuditLogs: boolean;
  canReassignKYC: boolean;
  canResendNotifications: boolean;
  canModifySystem: boolean;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  agentRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}

export interface TransactionItem {
  id: string;
  reference: string;
  timestamp: string;
  clientName: string;
  clientPhone: string;
  alias: string;
  amount: number;
  currency: string;
  type: "DEPOT" | "RETRAIT" | "REMBOURSEMENT" | "TRANSFERT_EPARGNE";
  status: "SUCCES" | "ECHEC" | "EN_COURS" | "ANNULE";
  errorCode?: string | undefined;
  errorMessage?: string | undefined;
  piiMasked?: boolean | undefined;
  executionTrace: {
    step: string;
    timestamp: string;
    status: "OK" | "ERROR" | "PENDING";
    details: string;
  }[];
}

export interface KYCDocument {
  id: string;
  type: "CIN_RECTO" | "CIN_VERSO" | "SELFIE" | "JUSTIFICATIF_DOMICILE";
  label: string;
  url: string;
}

export interface KYCDossier {
  id: string;
  clientName: string;
  cin: string;
  phone: string;
  birthDate: string;
  address: string;
  submittedAt: string;
  slaWaitTime: string;
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "NEEDS_REVISION";
  lockedBy?: {
    id: string;
    name: string;
  } | undefined;
  eligibilityScore: number;
  autoStatus: "ELIGIBLE" | "RISK_MEDIUM" | "MANUAL_CHECK";
  documents: KYCDocument[];
  alias?: string | undefined;
  rejectionReason?: string | undefined;
  rejectionNote?: string | undefined;
}

export interface SuspendedAccount {
  id: string;
  clientId: string;
  clientName: string;
  phone: string;
  cin: string;
  alias: string;
  reason: string;
  delayStatus: "P1" | "P2" | "P3";
  amountDue: number;
  currency: string;
  suspendedAt: string;
  isBlocked: boolean;
}
