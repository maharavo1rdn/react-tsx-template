import { useState } from "react";
import {
  Search,
  Download,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import type { TransactionItem } from "@/types/rbac";
import { useAuth } from "@/context/AuthContext";

const mockTransactions: TransactionItem[] = [
  {
    id: "TXN-99401",
    reference: "TRX-20251129-001",
    timestamp: "2025-11-29 13:00",
    clientName: "Rasoanaivo Fitiavana",
    clientPhone: "+261 34 00 123 45",
    alias: "CLI-FITIA-102",
    amount: 250000,
    currency: "MGA",
    type: "DEPOT",
    status: "SUCCES",
    piiMasked: true,
    executionTrace: [
      { step: "USSD Gateway", timestamp: "13:00:01", status: "OK", details: "Requête USSD reçue de +261340012345 (*144#)" },
      { step: "Payment Gateway", timestamp: "13:00:02", status: "OK", details: "Autorisation accordée par l'opérateur Telecom" },
      { step: "Core Banking System", timestamp: "13:00:03", status: "OK", details: "Compte crédité de 250 000 MGA" },
      { step: "SMS Notification", timestamp: "13:00:04", status: "OK", details: "SMS de confirmation transmis avec référence TRX-20251129-001" },
    ],
  },
  {
    id: "TXN-99402",
    reference: "TRX-20251129-002",
    timestamp: "2025-11-29 13:05",
    clientName: "Rakotoarisoa Marc",
    clientPhone: "+261 32 99 888 77",
    alias: "CLI-MARC-441",
    amount: 1200000,
    currency: "MGA",
    type: "RETRAIT",
    status: "ECHEC",
    errorCode: "ERR_CORE_INSUFFICIENT_FUNDS",
    errorMessage: "Solde insuffisant sur le compte principal lors du débit.",
    piiMasked: true,
    executionTrace: [
      { step: "USSD Gateway", timestamp: "13:05:00", status: "OK", details: "Session USSD valide" },
      { step: "Payment Gateway", timestamp: "13:05:01", status: "OK", details: "Check limite transactionnelle réussi" },
      { step: "Core Banking System", timestamp: "13:05:02", status: "ERROR", details: "Refus du Core Banking : Solde disponible 45 000 MGA < 1 200 000 MGA" },
      { step: "SMS Notification", timestamp: "13:05:03", status: "OK", details: "SMS d'échec envoyé au client" },
    ],
  },
  {
    id: "TXN-99403",
    reference: "TRX-20251129-003",
    timestamp: "2025-11-29 13:12",
    clientName: "Raharison Jean-Luc",
    clientPhone: "+261 33 11 222 33",
    alias: "CLI-JEAN-882",
    amount: 50000,
    currency: "MGA",
    type: "TRANSFERT_EPARGNE",
    status: "EN_COURS",
    piiMasked: true,
    executionTrace: [
      { step: "USSD Gateway", timestamp: "13:12:00", status: "OK", details: "App de souscription mobile" },
      { step: "Payment Gateway", timestamp: "13:12:01", status: "PENDING", details: "En attente du callback de la passerelle bancaire..." },
    ],
  },
  {
    id: "TXN-99404",
    reference: "TRX-20251129-004",
    timestamp: "2025-11-29 13:20",
    clientName: "Razafy Hery",
    clientPhone: "+261 34 55 666 77",
    alias: "CLI-HERY-119",
    amount: 800000,
    currency: "MGA",
    type: "REMBOURSEMENT",
    status: "SUCCES",
    piiMasked: true,
    executionTrace: [
      { step: "USSD Gateway", timestamp: "13:20:01", status: "OK", details: "Ordre de remboursement automatique" },
      { step: "Core Banking System", timestamp: "13:20:02", status: "OK", details: "Compte prêt crédité" },
      { step: "SMS Notification", timestamp: "13:20:03", status: "OK", details: "Reçu de remboursement envoyé" },
    ],
  },
];

export default function TransactionsMonitoring() {
  const { permissions, logAction } = useAuth();
  const [transactions] = useState<TransactionItem[]>(mockTransactions);
  const [selectedTxnId, setSelectedTxnId] = useState<string>("TXN-99401"); // Selected row (style 44f4d04d1b9c686fb6add96dcf0ffdb3.jpg)
  const [drawerTxn, setDrawerTxn] = useState<TransactionItem | null>(null);

  // Filters state
  const [datePreset, setDatePreset] = useState("Aujourd'hui");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // PII Unmask state per transaction drawer
  const [showPII, setShowPII] = useState(false);

  const filteredTransactions = transactions.filter((t) => {
    if (typeFilter !== "ALL" && t.type !== typeFilter) return false;
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.reference.toLowerCase().includes(q) ||
        t.clientName.toLowerCase().includes(q) ||
        t.clientPhone.toLowerCase().includes(q) ||
        t.alias.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    if (!permissions.canExportData) return;
    logAction("EXPORT_TRANSACTIONS", "Exportation CSV de la sélection des transactions de monitoring.");
    alert("Export CSV initié avec succès. Téléchargement en cours...");
  };

  const maskPhone = (phone: string) => {
    if (showPII) return phone;
    return phone.replace(/(\+261 \d{2}) \d{2} \d{3} (\d{2})/, "$1 ** *** $2");
  };

  const handleTogglePII = () => {
    const nextState = !showPII;
    setShowPII(nextState);
    if (nextState && drawerTxn) {
      logAction("PII_UNMASK", `Consultation des données personnelles (PII) pour la transaction ${drawerTxn.reference}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Monitoring & Transactions
            </h2>
            <span className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs px-2.5 py-0.5 font-semibold">
              Module B
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Surveillance en temps réel, filtres multi-critères et traçabilité technique bout en bout.
          </p>
        </div>

        {/* Export action button matching style 44f4d04d1b9c686fb6add96dcf0ffdb3.jpg top bar */}
        {permissions.canExportData && (
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shadow-xs transition"
          >
            <Download size={15} />
            Exporter la sélection (CSV)
          </button>
        )}
      </div>

      {/* FILTRES D'ENTÊTE (Style RTA Table Filters dans 44f4d04d1b9c686fb6add96dcf0ffdb3.jpg) */}
      <div className="ui-panel p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Plage de dates */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Plage de Dates
            </label>
            <select
              value={datePreset}
              onChange={(e) => setDatePreset(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="Aujourd'hui">Aujourd'hui (29/11/2025)</option>
              <option value="7 jours">7 derniers jours</option>
              <option value="Ce mois">Ce mois-ci</option>
            </select>
          </div>

          {/* Type de transaction */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Type Opération
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">Tous les types</option>
              <option value="DEPOT">Dépôt</option>
              <option value="RETRAIT">Retrait</option>
              <option value="REMBOURSEMENT">Remboursement</option>
              <option value="TRANSFERT_EPARGNE">Transfert Épargne</option>
            </select>
          </div>

          {/* Statut */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="SUCCES">Succès</option>
              <option value="ECHEC">Échec</option>
              <option value="EN_COURS">En cours</option>
            </select>
          </div>

          {/* Recherche Textuelle */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">
              Recherche Avancée
            </label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="ID Txn, N° Téléphone, ALIAS, Client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TABLEAU DYNAMIQUE (Exactement l'esthétique 44f4d04d1b9c686fb6add96dcf0ffdb3.jpg) */}
      <div className="ui-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3 text-center">
                  <input type="checkbox" className="rounded border-slate-300" />
                </th>
                <th className="px-4 py-3">Réf Transaction</th>
                <th className="px-4 py-3">Client (ALIAS)</th>
                <th className="px-4 py-3">Horodatage</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Montant</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
              {filteredTransactions.map((t) => {
                const isSelected = selectedTxnId === t.id;
                return (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTxnId(t.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "table-selected-row"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => setSelectedTxnId(t.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold">
                      {t.reference}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold">{t.clientName}</div>
                      <div className={`text-[11px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                        {t.alias}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">{t.timestamp}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono font-bold text-sm">
                      {t.amount.toLocaleString()} {t.currency}
                    </td>
                    <td className="px-4 py-3.5">
                      {t.status === "SUCCES" && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isSelected ? "bg-emerald-400 text-slate-950" : "ui-status-success"
                        }`}>
                          <CheckCircle2 size={12} />
                          Succès
                        </span>
                      )}
                      {t.status === "ECHEC" && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isSelected ? "bg-rose-400 text-slate-950" : "ui-status-danger"
                        }`}>
                          <XCircle size={12} />
                          Échec
                        </span>
                      )}
                      {t.status === "EN_COURS" && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          isSelected ? "bg-amber-300 text-slate-950" : "ui-status-pending"
                        }`}>
                          <Clock size={12} />
                          En cours
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-center relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDrawerTxn(t);
                        }}
                        className={`p-1.5 rounded hover:bg-black/10 transition ${
                          isSelected ? "text-white" : "text-slate-500"
                        }`}
                        title="Détails & Traçabilité"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER LATÉRAL (DÉTAILS ET ARBRE CHRONOLOGIQUE D'EXÉCUTION) */}
      {drawerTxn && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 h-full shadow-2xl overflow-y-auto p-6 space-y-6 border-l border-slate-200 dark:border-slate-800">
            {/* Header Drawer */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {drawerTxn.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Détail Transaction
                </h3>
              </div>
              <button
                onClick={() => setDrawerTxn(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Fiche synthétique */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Montant total</span>
                <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">
                  {drawerTxn.amount.toLocaleString()} {drawerTxn.currency}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Type</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {drawerTxn.type}
                </span>
              </div>

              {/* PII Toggle Option with Logged action */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {drawerTxn.clientName}
                  </p>
                  <p className="text-xs font-mono text-slate-500">
                    {maskPhone(drawerTxn.clientPhone)}
                  </p>
                </div>
                <button
                  onClick={handleTogglePII}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition"
                  title="Masquer/Démasquer PII avec traçabilité log"
                >
                  {showPII ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{showPII ? "Masquer PII" : "Afficher PII"}</span>
                </button>
              </div>
            </div>

            {/* Core Banking Error details if status is ECHEC */}
            {drawerTxn.status === "ECHEC" && (
              <div className="rounded-xl bg-rose-50 dark:bg-rose-950/40 p-4 border border-rose-200 dark:border-rose-900 space-y-1">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs font-bold">
                  <AlertCircle size={16} />
                  <span>Code d'Erreur Backend : {drawerTxn.errorCode}</span>
                </div>
                <p className="text-xs text-rose-600 dark:text-rose-400 pl-6">
                  {drawerTxn.errorMessage}
                </p>
              </div>
            )}

            {/* ARBRE CHRONOLOGIQUE D'EXÉCUTION TECHNIQUE */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Arbre Chronologique d'Exécution Technique
              </h4>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {drawerTxn.executionTrace.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Node Dot */}
                    <span
                      className={`absolute -left-6 top-0.5 h-5 w-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold ${
                        step.status === "OK"
                          ? "bg-emerald-500 text-white"
                          : step.status === "ERROR"
                          ? "bg-rose-500 text-white"
                          : "bg-amber-400 text-slate-950"
                      }`}
                    >
                      ✓
                    </span>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {step.step}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {step.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {step.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
