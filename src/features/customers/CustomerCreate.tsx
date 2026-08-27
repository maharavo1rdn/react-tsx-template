import { useState } from "react";
import {
  AlertOctagon,
  CheckCircle2,
  FileText,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";

export interface RestrictedAccount {
  id: string;
  clientName: string;
  cin: string;
  phone: string;
  alias: string;
  overdueStatus: "P1" | "P2" | "P3";
  overdueDays: number;
  unpaidAmountAr: number;
  riskReason: string;
  blockedDate: string;
  isBlocked: boolean;
  historyLogs: {
    date: string;
    action: string;
    agent: string;
    justification: string;
  }[];
}

const mockRestrictedAccounts: RestrictedAccount[] = [
  {
    id: "ACC-9041",
    clientName: "Ratsimbazafy Heriniaina",
    cin: "101 445 092 110",
    phone: "+261 34 88 901 22",
    alias: "MK-582910",
    overdueStatus: "P3",
    overdueDays: 94,
    unpaidAmountAr: 450000,
    riskReason: "Retard de paiement > 90 jours & tentative de retrait suspecte",
    blockedDate: "2026-05-12",
    isBlocked: true,
    historyLogs: [
      {
        date: "2026-05-12 10:14",
        action: "Blocage Automatique (Barring)",
        agent: "System Risk Rules Engine",
        justification: "Seuil P3 atteint sans régularisation.",
      },
    ],
  },
  {
    id: "ACC-9042",
    clientName: "Andriamamonjy Lalaina",
    cin: "201 990 123 441",
    phone: "+261 32 11 002 99",
    alias: "MK-331049",
    overdueStatus: "P2",
    overdueDays: 45,
    unpaidAmountAr: 120000,
    riskReason: "Impayé échéance P2",
    blockedDate: "2026-07-01",
    isBlocked: true,
    historyLogs: [
      {
        date: "2026-07-01 14:00",
        action: "Suspension Compte",
        agent: "Analyste Risque - Marc",
        justification: "Dépassement du délai de gracieuseté P2.",
      },
    ],
  },
  {
    id: "ACC-9043",
    clientName: "Raveloson Tanjona",
    cin: "112 004 881 990",
    phone: "+261 33 44 210 00",
    alias: "MK-992104",
    overdueStatus: "P1",
    overdueDays: 12,
    unpaidAmountAr: 35000,
    riskReason: "Alerte de fraude - Connexions IP multiples",
    blockedDate: "2026-08-20",
    isBlocked: true,
    historyLogs: [
      {
        date: "2026-08-20 09:30",
        action: "Blocage préventif",
        agent: "Analyste Risque - Marc",
        justification: "Vérification d'usurpation d'identité requise.",
      },
    ],
  },
];

export default function CustomerCreate() {
  const [accounts, setAccounts] = useState<RestrictedAccount[]>(mockRestrictedAccounts);
  const [search, setSearch] = useState("");
  const [filterP, setFilterP] = useState("ALL");
  const [selectedAccount, setSelectedAccount] = useState<RestrictedAccount | null>(null);

  // Unbarring dialog states
  const [unbarringDialogOpen, setUnbarringDialogOpen] = useState(false);
  const [managerialJustification, setManagerialJustification] = useState("");
  const [justificationError, setJustificationError] = useState("");
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleOpenUnbarring = (acc: RestrictedAccount) => {
    setSelectedAccount(acc);
    setManagerialJustification("");
    setJustificationError("");
    setUnbarringDialogOpen(true);
  };

  const handleConfirmUnbarring = () => {
    if (!managerialJustification.trim() || managerialJustification.trim().length < 15) {
      setJustificationError("Une justification managériale détaillée est obligatoire (min. 15 caractères).");
      return;
    }

    if (!selectedAccount) return;

    const newLog = {
      date: new Date().toISOString().replace("T", " ").slice(0, 16),
      action: "Déblocage manuel (Unbarring)",
      agent: "Analyste Risque / Superviseur (Session active)",
      justification: managerialJustification,
    };

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === selectedAccount.id
          ? {
              ...acc,
              isBlocked: false,
              historyLogs: [newLog, ...acc.historyLogs],
            }
          : acc
      )
    );

    setActionSuccess(
      `Le compte ${selectedAccount.clientName} (${selectedAccount.alias}) a été débloqué avec succès. Action tracée dans le journal de recouvrement.`
    );
    setUnbarringDialogOpen(false);
    setSelectedAccount(null);
  };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.clientName.toLowerCase().includes(search.toLowerCase()) ||
      acc.cin.includes(search) ||
      acc.alias.toLowerCase().includes(search.toLowerCase()) ||
      acc.phone.includes(search);
    const matchesP = filterP === "ALL" || acc.overdueStatus === filterP;
    return matchesSearch && matchesP;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-amber-600 dark:text-amber-400" size={24} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Suivi des Suspensions & Recouvrement
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Module C • Gestion des blocages (Barring / Unbarring), statuts de retard P1/P2/P3 & justification managériale
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 dark:text-emerald-300 hover:underline font-medium">
            Masquer
          </button>
        </div>
      )}

      {/* Main Panel */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 max-w-md">
            <Input
              label="Rechercher client restreint"
              placeholder="Nom, CIN, ALIAS, N° Téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              label="Statut de retard"
              value={filterP}
              onChange={(e) => setFilterP(e.target.value)}
              options={[
                { label: "Tous les niveaux (P1, P2, P3)", value: "ALL" },
                { label: "P1 (1 à 30 jours)", value: "P1" },
                { label: "P2 (31 à 90 jours)", value: "P2" },
                { label: "P3 (90+ jours)", value: "P3" },
              ]}
            />
          </div>
        </div>

        {/* Restricted Accounts Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                <th className="px-4 py-3">Client & ALIAS</th>
                <th className="px-4 py-3">N° CIN & Contact</th>
                <th className="px-4 py-3">Niveau Retard</th>
                <th className="px-4 py-3">Montant Impayé</th>
                <th className="px-4 py-3">Motif de Restriction</th>
                <th className="px-4 py-3">Statut Compte</th>
                <th className="px-4 py-3 text-right">Action Habilitée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredAccounts.map((acc) => (
                <tr key={acc.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 dark:text-white">{acc.clientName}</p>
                    <p className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400">{acc.alias}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono">{acc.cin}</p>
                    <p className="text-[10px] text-slate-400">{acc.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 font-mono font-bold px-2 py-0.5 rounded border text-[11px] ${
                        acc.overdueStatus === "P3"
                          ? "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                          : acc.overdueStatus === "P2"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800"
                          : "bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800"
                      }`}
                    >
                      <AlertOctagon size={12} />
                      {acc.overdueStatus} ({acc.overdueDays} j)
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                    {acc.unpaidAmountAr.toLocaleString()} Ar
                  </td>
                  <td className="px-4 py-3 max-w-xs text-slate-600 dark:text-slate-400">
                    <p className="truncate text-xs">{acc.riskReason}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Restreint le : {acc.blockedDate}</p>
                  </td>
                  <td className="px-4 py-3">
                    {acc.isBlocked ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold text-[10px] border border-rose-200 dark:border-rose-800">
                        <Lock size={11} /> Compte Bloqué
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px] border border-emerald-200 dark:border-emerald-800">
                        <ShieldCheck size={11} /> Actif (Débloqué)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {acc.isBlocked ? (
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                        onClick={() => handleOpenUnbarring(acc)}
                      >
                        <Unlock size={14} />
                        Débloquer (Unbarring)
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenUnbarring(acc)}
                        className="text-xs text-slate-500"
                      >
                        <FileText size={14} />
                        Historique
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                    Aucun compte restreint ne correspond à la recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Unbarring & Justification Dialog */}
      {unbarringDialogOpen && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Unlock size={22} />
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Déblocage Manuel (Unbarring)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Client : {selectedAccount.clientName} ({selectedAccount.alias})
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Statut actuel de retard : <strong className="font-mono text-rose-600 dark:text-rose-400">{selectedAccount.overdueStatus}</strong>
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                Montant en souffrance : <strong className="font-mono">{selectedAccount.unpaidAmountAr.toLocaleString()} Ar</strong>
              </p>
            </div>

            <div className="space-y-2">
              <Textarea
                label="Justification Managériale Obligatoire"
                placeholder="Ex. Accord de rééchelonnement validé par la direction régionale ou réception d'un justificatif de virement..."
                value={managerialJustification}
                onChange={(e) => {
                  setManagerialJustification(e.target.value);
                  setJustificationError("");
                }}
                error={justificationError}
                required
              />
              <p className="text-[11px] text-slate-400 font-mono">
                Cette justification est inaltérable et sera sauvegardée dans les Audit Logs.
              </p>
            </div>

            {/* Audit Logs for this account */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Historique des actions sur ce compte
              </p>
              <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                {selectedAccount.historyLogs.map((log, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] space-y-0.5">
                    <div className="flex items-center justify-between text-slate-500 font-mono">
                      <span>{log.date}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{log.agent}</span>
                    </div>
                    <p className="font-semibold text-slate-900 dark:text-white">{log.action}</p>
                    <p className="text-slate-600 dark:text-slate-400 italic font-mono">"{log.justification}"</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setUnbarringDialogOpen(false)}>
                Annuler
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                onClick={handleConfirmUnbarring}
              >
                Valider le Déblocage (Unbarring)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
