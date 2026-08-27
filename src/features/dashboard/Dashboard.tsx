import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileSpreadsheet,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";

export interface AuditLogItem {
  id: string;
  agentId: string;
  agentName: string;
  role: string;
  action: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  status: "SUCCESS" | "WARNING" | "FAILURE";
}

const mockAuditLogs: AuditLogItem[] = [
  {
    id: "LOG-88091",
    agentId: "AG-102",
    agentName: "Harisoa Rasoanaivo",
    role: "AGENT_KYC",
    action: "VALIDATION_DOSSIER_KYC",
    module: "KYC Validation",
    timestamp: "2026-08-27 10:45:12",
    ipAddress: "192.168.1.45",
    status: "SUCCESS",
  },
  {
    id: "LOG-88092",
    agentId: "AG-108",
    agentName: "Jean Marc Analyst",
    role: "RISK_ANALYST",
    action: "UNBARRING_MANUEL_CLIENT",
    module: "Recouvrement",
    timestamp: "2026-08-27 10:40:02",
    ipAddress: "192.168.1.88",
    status: "WARNING",
  },
  {
    id: "LOG-88093",
    agentId: "AG-105",
    agentName: "Support Agent 1",
    role: "CUSTOMER_SUPPORT",
    action: "RENVOI_NOTIFICATION_SMS",
    module: "Support Client",
    timestamp: "2026-08-27 10:32:44",
    ipAddress: "192.168.1.12",
    status: "SUCCESS",
  },
  {
    id: "LOG-88094",
    agentId: "AG-101",
    agentName: "Superviseur Admin",
    role: "SUPERVISOR",
    action: "REATTRIBUTION_KYC_BLOQUE",
    module: "Supervision",
    timestamp: "2026-08-27 09:15:20",
    ipAddress: "192.168.1.1",
    status: "SUCCESS",
  },
];

const mockKpiCards = [
  {
    title: "KYC Validés Aujourd'hui",
    value: "148 dossiers",
    subtext: "Temps moyen SLA : 14 min",
    icon: FileCheck2,
    trend: "+18%",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
  },
  {
    title: "Volume Transactions (24h)",
    value: "184,5 M Ar",
    subtext: "2 410 transactions traitées",
    icon: TrendingUp,
    trend: "+5.4%",
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
  },
  {
    title: "Taux d'Échec Technique",
    value: "0.82%",
    subtext: "Sous le seuil d'alerte SLA (2%)",
    icon: AlertTriangle,
    trend: "-0.15%",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
  },
  {
    title: "Agents KYC Actifs",
    value: "12 connectés",
    subtext: "Productivité : 12.3 dossiers/h",
    icon: Users,
    trend: "Normal",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
  },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"METRICS" | "AUDIT">("METRICS");
  const [auditLogs] = useState<AuditLogItem[]>(mockAuditLogs);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Tableau de Bord & Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Module D • Dashboard synthétique de productivité, métriques globales & journal des logs d'audit inaltérable
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("METRICS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "METRICS"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Vue Synthétique & Métriques
          </button>
          <button
            onClick={() => setActiveTab("AUDIT")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "AUDIT"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Journal d'Audit (Audit Logs)
          </button>
        </div>
      </div>

      {activeTab === "METRICS" ? (
        <div className="space-y-6">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockKpiCards.map((card, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl border ${card.bg} space-y-3 transition hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {card.title}
                  </span>
                  <card.icon size={18} className={card.color} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                    {card.value}
                  </p>
                  <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>{card.subtext}</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                      <ArrowUpRight size={12} /> {card.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Productivity & Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Hourly Activity Table */}
            <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="text-indigo-600 dark:text-indigo-400" size={18} />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Activité Opérationnelle par Tranche Horaire
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Date : 27 Août 2026</span>
              </div>

              <div className="space-y-3">
                {[
                  { hour: "08:00 - 09:00", kyc: 34, txns: 412, errors: "0.4%" },
                  { hour: "09:00 - 10:00", kyc: 52, txns: 890, errors: "0.9%" },
                  { hour: "10:00 - 11:00", kyc: 62, txns: 1108, errors: "0.7%" },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2 font-mono font-bold text-slate-900 dark:text-white">
                      <Clock size={14} className="text-slate-400" />
                      {row.hour}
                    </div>
                    <div className="flex items-center gap-6 font-mono">
                      <span>
                        KYC Traités : <strong className="text-indigo-600 dark:text-indigo-400">{row.kyc}</strong>
                      </span>
                      <span>
                        Volume Txns : <strong className="text-slate-900 dark:text-white">{row.txns}</strong>
                      </span>
                      <span>
                        Taux d'erreur : <strong className="text-emerald-600 dark:text-emerald-400">{row.errors}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Productivity Status */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Équipe KYC en ligne
                </h3>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  SLA OK
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { name: "Harisoa Rasoanaivo", count: 24, status: "En inspection" },
                  { name: "Jean Marc", count: 19, status: "Disponible" },
                  { name: "Voahirana R.", count: 31, status: "En pause" },
                ].map((agent, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{agent.name}</p>
                      <p className="text-[10px] text-slate-400">{agent.status}</p>
                    </div>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {agent.count} val.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Audit Logs View */
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className="text-purple-600 dark:text-purple-400" size={20} />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Journal d'Audit Inaltérable (Audit Trail)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Traçabilité complète des actions des agents : ID, rôle, action, IP et horodatage.
                </p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200">
              <FileSpreadsheet size={14} /> Exporter Logs
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="px-4 py-3">ID Log</th>
                  <th className="px-4 py-3">Horodatage</th>
                  <th className="px-4 py-3">Agent & Rôle</th>
                  <th className="px-4 py-3">Module & Action Réalisée</th>
                  <th className="px-4 py-3">Adresse IP</th>
                  <th className="px-4 py-3 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 font-mono transition">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{log.id}</td>
                    <td className="px-4 py-3 text-slate-500">{log.timestamp}</td>
                    <td className="px-4 py-3 font-sans">
                      <p className="font-semibold text-slate-900 dark:text-white">{log.agentName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{log.agentId} • {log.role}</p>
                    </td>
                    <td className="px-4 py-3 font-sans">
                      <p className="font-semibold text-indigo-600 dark:text-indigo-400">{log.action}</p>
                      <p className="text-[10px] text-slate-400">{log.module}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{log.ipAddress}</td>
                    <td className="px-4 py-3 text-right">
                      {log.status === "SUCCESS" && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                          <CheckCircle2 size={12} /> Succès
                        </span>
                      )}
                      {log.status === "WARNING" && (
                        <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[10px]">
                          <AlertTriangle size={12} /> Sensible
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
