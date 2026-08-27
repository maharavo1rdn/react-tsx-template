import { useState } from "react";
import {
  ArrowLeftRight,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  Filter,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";

export interface Transaction {
  id: string;
  timestamp: string;
  type: "DEPOT" | "RETRAIT" | "REMBOURSEMENT" | "TRANSFERT_EPARGNE";
  amountAr: number;
  status: "SUCCES" | "ECHEC" | "EN_COURS" | "ANNULE";
  clientName: string;
  phone: string;
  alias: string;
  errorCode?: string;
  errorDetail?: string;
  executionTree: {
    step: string;
    status: "OK" | "ERROR" | "INFO";
    time: string;
    details: string;
  }[];
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-2026-9901",
    timestamp: "2026-08-27 10:42:15",
    type: "DEPOT",
    amountAr: 250000,
    status: "SUCCES",
    clientName: "Rasoanaivo Harisoa",
    phone: "+261 34 12 345 67",
    alias: "MK-882104",
    executionTree: [
      { step: "USSD Gateway", status: "OK", time: "10:42:15.102", details: "Initiation session *111# OK" },
      { step: "Payment Gateway", status: "OK", time: "10:42:15.340", details: "Validation PIN client & tokenisation" },
      { step: "Core Banking PAMF", status: "OK", time: "10:42:15.890", details: "Crédit compte principal +250 000 Ar" },
      { step: "SMS Notification", status: "OK", time: "10:42:16.010", details: "SMS de confirmation envoyé (ID: SMS-881)" },
    ],
  },
  {
    id: "TXN-2026-9902",
    timestamp: "2026-08-27 10:35:00",
    type: "RETRAIT",
    amountAr: 500000,
    status: "ECHEC",
    clientName: "Rakotondrazaka Andry",
    phone: "+261 32 04 999 12",
    alias: "MK-449102",
    errorCode: "ERR_CORE_INSUFFICIENT_FUNDS",
    errorDetail: "Solde disponible insuffisant sur le compte Core Banking du client lors de la réservation.",
    executionTree: [
      { step: "USSD Gateway", status: "OK", time: "10:35:00.010", details: "Demande retrait cash" },
      { step: "Payment Gateway", status: "OK", time: "10:35:00.220", details: "Contrôle des plafonds journaliers OK" },
      { step: "Core Banking PAMF", status: "ERROR", time: "10:35:00.650", details: "Échec débit : ERR_CORE_INSUFFICIENT_FUNDS (Solde disponible = 42 000 Ar)" },
      { step: "SMS Notification", status: "OK", time: "10:35:00.800", details: "SMS d'alerte échec débit envoyé" },
    ],
  },
  {
    id: "TXN-2026-9903",
    timestamp: "2026-08-27 09:12:44",
    type: "REMBOURSEMENT",
    amountAr: 150000,
    status: "SUCCES",
    clientName: "Ramanantsoa Voahirana",
    phone: "+261 33 88 112 00",
    alias: "MK-109244",
    executionTree: [
      { step: "USSD Gateway", status: "OK", time: "09:12:44.050", details: "Paiement échéance prêt" },
      { step: "Payment Gateway", status: "OK", time: "09:12:44.200", details: "Autorisation accordée" },
      { step: "Core Banking PAMF", status: "OK", time: "09:12:44.780", details: "Remboursement partiel micro-crédit enregistré" },
      { step: "SMS Notification", status: "OK", time: "09:12:44.900", details: "Notification reçu numérique transmis" },
    ],
  },
  {
    id: "TXN-2026-9904",
    timestamp: "2026-08-27 08:50:11",
    type: "TRANSFERT_EPARGNE",
    amountAr: 80000,
    status: "EN_COURS",
    clientName: "Randrianarivelo Faly",
    phone: "+261 34 55 123 99",
    alias: "MK-772109",
    executionTree: [
      { step: "USSD Gateway", status: "OK", time: "08:50:11.100", details: "Virement compte courant -> Épargne Mkajy" },
      { step: "Payment Gateway", status: "OK", time: "08:50:11.310", details: "Verrou de transaction activé" },
      { step: "Core Banking PAMF", status: "INFO", time: "08:50:11.900", details: "Attente de compensation interbancaire" },
    ],
  },
];

export default function Settings() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [datePreset, setDatePreset] = useState("TODAY");
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [showPii, setShowPii] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportCsv = () => {
    setExportNotice("Export CSV généré et téléchargé (soumis à la traçabilité des logs audit).");
    setTimeout(() => setExportNotice(null), 4000);
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(search.toLowerCase()) ||
      txn.alias.toLowerCase().includes(search.toLowerCase()) ||
      txn.phone.includes(search) ||
      txn.clientName.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "ALL" || txn.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || txn.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Monitoring des Transactions
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Module B • Table dynamique multi-critères, traçabilité USSD/Gateway/Core & masquage PII
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleExportCsv} variant="outline" className="text-xs font-semibold">
            <Download size={14} />
            Exporter Sélection (CSV)
          </Button>
        </div>
      </div>

      {exportNotice && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-200">
          <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Main Content & Drawer Wrapper */}
      <div className="relative flex">
        {/* Table Panel */}
        <section className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
          {/* Header Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-1">
              <Input
                label="Recherche textuelle"
                placeholder="ID Txn, Phone, ALIAS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Select
                label="Plage de dates"
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
                options={[
                  { label: "Aujourd'hui", value: "TODAY" },
                  { label: "7 derniers jours", value: "7D" },
                  { label: "Ce mois-ci", value: "MONTH" },
                ]}
              />
            </div>
            <div>
              <Select
                label="Type de Transaction"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { label: "Tous les types", value: "ALL" },
                  { label: "Dépôt", value: "DEPOT" },
                  { label: "Retrait", value: "RETRAIT" },
                  { label: "Remboursement", value: "REMBOURSEMENT" },
                  { label: "Transfert Épargne", value: "TRANSFERT_EPARGNE" },
                ]}
              />
            </div>
            <div>
              <Select
                label="Statut"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: "Tous les statuts", value: "ALL" },
                  { label: "Succès", value: "SUCCES" },
                  { label: "Échec", value: "ECHEC" },
                  { label: "En cours", value: "EN_COURS" },
                ]}
              />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="px-4 py-3">Horodatage & ID</th>
                  <th className="px-4 py-3">Client (ALIAS)</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredTransactions.map((txn) => (
                  <tr
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition"
                  >
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{txn.id}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{txn.timestamp}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{txn.clientName}</p>
                      <p className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400">{txn.alias}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">
                      {txn.type}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {txn.amountAr.toLocaleString()} Ar
                    </td>
                    <td className="px-4 py-3">
                      {txn.status === "SUCCES" && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
                          Succès
                        </span>
                      )}
                      {txn.status === "ECHEC" && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold text-[10px]">
                          Échec
                        </span>
                      )}
                      {txn.status === "EN_COURS" && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold text-[10px]">
                          En cours
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">
                      <ChevronRight size={16} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Drawer / Slide-over detail panel */}
        {selectedTxn && (
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Filter size={18} className="text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Traçabilité Technique ({selectedTxn.id})
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              {/* PII Masking Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Masquage des données PII
                  </span>
                </div>
                <button
                  onClick={() => setShowPii(!showPii)}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {showPii ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPii ? "Masquer PII" : "Afficher PII"}
                </button>
              </div>

              {/* Client Info */}
              <div className="space-y-2 text-xs border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nom Client :</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {showPii ? selectedTxn.clientName : "••••••••••••"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Téléphone :</span>
                  <span className="font-mono text-slate-900 dark:text-white">
                    {showPii ? selectedTxn.phone : "+261 34 •• ••• ••"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ALIAS Client :</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                    {selectedTxn.alias}
                  </span>
                </div>
              </div>

              {/* Backend Error Code if Failed */}
              {selectedTxn.errorCode && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                    <XCircle size={15} /> Code Erreur : {selectedTxn.errorCode}
                  </div>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400 leading-relaxed">
                    {selectedTxn.errorDetail}
                  </p>
                </div>
              )}

              {/* Chronological Execution Tree */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Arbre chronologique d'exécution
                </h4>
                <div className="relative pl-4 space-y-4 border-l-2 border-indigo-200 dark:border-indigo-900">
                  {selectedTxn.executionTree.map((step, idx) => (
                    <div key={idx} className="relative group">
                      <div
                        className={`absolute -left-[21px] top-0.5 h-3 w-3 rounded-full border-2 bg-white dark:bg-slate-900 ${
                          step.status === "OK"
                            ? "border-emerald-500"
                            : step.status === "ERROR"
                            ? "border-rose-500"
                            : "border-amber-500"
                        }`}
                      />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 dark:text-white">{step.step}</span>
                        <span className="font-mono text-slate-400">{step.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-mono">
                        {step.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" className="w-full text-xs" onClick={() => setSelectedTxn(null)}>
                Fermer le volet
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
