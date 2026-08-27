import { useState } from "react";
import {
  Unlock,
  Search,
  CheckCircle2,
  Filter,
  UserX,
} from "lucide-react";
import type { SuspendedAccount } from "@/types/rbac";
import { useAuth } from "@/context/AuthContext";

const mockSuspendedAccounts: SuspendedAccount[] = [
  {
    id: "SUSP-101",
    clientId: "CLI-9901",
    clientName: "Ranaivoson Tojo",
    phone: "+261 34 55 111 22",
    cin: "101 999 888 777",
    alias: "CLI-TOJO-901",
    reason: "Alerte Fraude USSD - Tentatives d'accès répétées",
    delayStatus: "P3",
    amountDue: 450000,
    currency: "MGA",
    suspendedAt: "2025-11-20",
    isBlocked: true,
  },
  {
    id: "SUSP-102",
    clientId: "CLI-9902",
    clientName: "Rasoamihanta Lala",
    phone: "+261 32 44 333 22",
    cin: "201 444 333 222",
    alias: "CLI-LALA-302",
    reason: "Retard de remboursement prêt micro-crédit (> 30j)",
    delayStatus: "P1",
    amountDue: 120000,
    currency: "MGA",
    suspendedAt: "2025-11-25",
    isBlocked: true,
  },
  {
    id: "SUSP-103",
    clientId: "CLI-9903",
    clientName: "Andriamora Eric",
    phone: "+261 33 88 777 66",
    cin: "301 777 666 555",
    alias: "CLI-ERIC-770",
    reason: "Dépassement de seuil d'impayé consécutif",
    delayStatus: "P2",
    amountDue: 890000,
    currency: "MGA",
    suspendedAt: "2025-11-15",
    isBlocked: true,
  },
];

export default function SuspensionsManagement() {
  const { permissions, logAction } = useAuth();
  const [accounts, setAccounts] = useState<SuspendedAccount[]>(mockSuspendedAccounts);
  const [selectedAccount, setSelectedAccount] = useState<SuspendedAccount | null>(null);

  // Unbarring modal state
  const [unbarringModalOpen, setUnbarringModalOpen] = useState(false);
  const [justification, setJustification] = useState("");
  const [delayFilter, setDelayFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccounts = accounts.filter((acc) => {
    if (delayFilter !== "ALL" && acc.delayStatus !== delayFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        acc.clientName.toLowerCase().includes(q) ||
        acc.phone.toLowerCase().includes(q) ||
        acc.alias.toLowerCase().includes(q) ||
        acc.cin.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenUnbarringModal = (acc: SuspendedAccount) => {
    if (!permissions.canPerformUnbarring) return;
    setSelectedAccount(acc);
    setJustification("");
    setUnbarringModalOpen(true);
  };

  const handleConfirmUnbarring = () => {
    if (!selectedAccount || !justification.trim()) return;

    const updated = accounts.map((a) =>
      a.id === selectedAccount.id ? { ...a, isBlocked: false } : a
    );
    setAccounts(updated);

    logAction(
      "UNBARRING_CLIENT",
      `Déblocage manuel (Unbarring) du client ${selectedAccount.clientName} (${selectedAccount.alias}). Justification managériale: ${justification}`
    );

    setUnbarringModalOpen(false);
    setSelectedAccount(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Suivi des Suspensions & Recouvrement
            </h2>
            <span className="rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 text-xs px-2.5 py-0.5 font-semibold">
              Module C (Barring / Unbarring)
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestion des comptes restreints ou bloqués suite aux impayés (P1, P2, P3) ou alertes de risque.
          </p>
        </div>
      </div>

      {/* FILTRES & BARRE DE RECHERCHE */}
      <div className="ui-panel p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher nom, CIN, N° télé, ALIAS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-slate-400" />
          <label className="text-xs font-semibold text-slate-500">Statut Retard :</label>
          <select
            value={delayFilter}
            onChange={(e) => setDelayFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">Tous (P1, P2, P3)</option>
            <option value="P1">P1 (1 à 30 jours de retard)</option>
            <option value="P2">P2 (31 à 60 jours de retard)</option>
            <option value="P3">P3 (plus de 60 jours / Fraude)</option>
          </select>
        </div>
      </div>

      {/* TABLEAU DES COMPTES SUSPENDUS */}
      <div className="ui-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">ID Client</th>
                <th className="px-4 py-3">Client (ALIAS)</th>
                <th className="px-4 py-3">Motif de Blocage</th>
                <th className="px-4 py-3">Niveau Retard</th>
                <th className="px-4 py-3 text-right">Montant Dû</th>
                <th className="px-4 py-3">Statut Compte</th>
                <th className="px-4 py-3 text-right">Action Habilitée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {acc.clientId}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{acc.clientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{acc.alias} • {acc.phone}</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300 max-w-xs">
                    {acc.reason}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        acc.delayStatus === "P3"
                          ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          : acc.delayStatus === "P2"
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      }`}
                    >
                      {acc.delayStatus} ({acc.delayStatus === "P1" ? "1-30j" : acc.delayStatus === "P2" ? "31-60j" : ">60j / Fraude"})
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {acc.amountDue.toLocaleString()} {acc.currency}
                  </td>
                  <td className="px-4 py-3.5">
                    {acc.isBlocked ? (
                      <span className="ui-status-danger inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                        <UserX size={12} />
                        Bloqué (Barred)
                      </span>
                    ) : (
                      <span className="ui-status-success inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                        <CheckCircle2 size={12} />
                        Actif (Unbarred)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {acc.isBlocked ? (
                      <button
                        disabled={!permissions.canPerformUnbarring}
                        onClick={() => handleOpenUnbarringModal(acc)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                          permissions.canPerformUnbarring
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                        }`}
                        title={
                          permissions.canPerformUnbarring
                            ? "Débloquer le compte client"
                            : "Permission Analyste Risque ou Superviseur requise"
                        }
                      >
                        <Unlock size={14} />
                        Unbarring
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Compte rétabli</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALE DE JUSTIFICATION MANAGEMENT (UNBARRING) */}
      {unbarringModalOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md ui-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Unlock size={18} className="text-emerald-600" />
                Déblocage de Compte (Unbarring)
              </h3>
              <button
                onClick={() => setUnbarringModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Client : {selectedAccount.clientName} ({selectedAccount.alias})
                </p>
                <p className="text-slate-500">Motif initial : {selectedAccount.reason}</p>
                <p className="font-mono text-rose-600 font-bold">
                  Impayé associé : {selectedAccount.amountDue.toLocaleString()} MGA
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Justification Managériale Obligatoire <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Ex: Régularisation de l'impayé effectuée en agence le 29/11/2025 (Reçu #88219)."
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUnbarringModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                disabled={!justification.trim()}
                onClick={handleConfirmUnbarring}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition ${
                  justification.trim()
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                    : "bg-slate-300 dark:bg-slate-800 cursor-not-allowed"
                }`}
              >
                Confirmer le Déblocage (Traçabilité audit)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
