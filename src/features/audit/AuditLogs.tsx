import { useState } from "react";
import { Search, Filter, Terminal } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuditLogs() {
  const { auditLogs } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  const filteredLogs = auditLogs.filter((log) => {
    if (roleFilter !== "ALL" && log.agentRole !== roleFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.agentName.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Journal d'Audit Inaltérable
            </h2>
            <span className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs px-2.5 py-0.5 font-semibold">
              Module D (Audit Logs)
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Traçabilité complète et sécurisée de chaque action effectuée sur le Back-Office d'Administration.
          </p>
        </div>
      </div>

      {/* FILTRES D'AUDIT */}
      <div className="ui-panel p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher action, agent, IP, motif..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-slate-400" />
          <label className="text-xs font-semibold text-slate-500">Filtrer par Rôle :</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">Tous les Rôles</option>
            <option value="AGENT_KYC">Agent KYC</option>
            <option value="RISK_ANALYST">Analyste Risque</option>
            <option value="CUSTOMER_SUPPORT">Support Client</option>
            <option value="SUPERVISOR">Superviseur</option>
          </select>
        </div>
      </div>

      {/* TABLEAU DES LOGS D'AUDIT */}
      <div className="ui-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">ID Log</th>
                <th className="px-4 py-3">Horodatage</th>
                <th className="px-4 py-3">Agent & Rôle</th>
                <th className="px-4 py-3">Action Réalisée</th>
                <th className="px-4 py-3">Détails de l'Opération</th>
                <th className="px-4 py-3 text-right">Adresse IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                    {log.id}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300 font-mono">
                    {new Date(log.timestamp).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{log.agentName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.agentId} ({log.agentRole})</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[11px] font-bold text-slate-800 dark:text-slate-200">
                      <Terminal size={12} className="text-blue-500" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 max-w-md">
                    {log.details}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
