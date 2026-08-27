import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Lock,
  MessageSquare,
  Mail,
  History,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface ClientSearchResult {
  id: string;
  name: string;
  cin: string;
  phone: string;
  alias: string;
  kycStatus: "VALIDATED" | "PENDING" | "REJECTED";
  accountStatus: "ACTIVE" | "SUSPENDED";
  registeredAt: string;
  recentTxns: { id: string; date: string; amount: string; type: string }[];
}

const mockClients: ClientSearchResult[] = [
  {
    id: "CLI-9901",
    name: "Rasoanaivo Fitiavana",
    cin: "201 987 654 321",
    phone: "+261 34 00 123 45",
    alias: "CLI-FITIA-102",
    kycStatus: "VALIDATED",
    accountStatus: "ACTIVE",
    registeredAt: "12/01/2024",
    recentTxns: [
      { id: "TRX-001", date: "29/11/2025 13:00", amount: "250 000 MGA", type: "Dépôt USSD" },
      { id: "TRX-002", date: "28/11/2025 09:45", amount: "50 000 MGA", type: "Recharge Mobile" },
    ],
  },
  {
    id: "CLI-9902",
    name: "Raharison Jean-Luc",
    cin: "101 234 567 890",
    phone: "+261 34 12 345 67",
    alias: "CLI-JEAN-882",
    kycStatus: "VALIDATED",
    accountStatus: "ACTIVE",
    registeredAt: "04/05/2023",
    recentTxns: [
      { id: "TRX-003", date: "29/11/2025 13:12", amount: "50 000 MGA", type: "Transfert Épargne" },
    ],
  },
];

export default function Support() {
  const { permissions, logAction } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClient, setActiveClient] = useState<ClientSearchResult | null>(mockClients[0] ?? null);
  const [notificationSent, setNotificationSent] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mockClients.find(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.cin.includes(searchQuery) ||
        c.phone.includes(searchQuery) ||
        c.alias.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (found) {
      setActiveClient(found);
    } else {
      alert("Aucun utilisateur trouvé pour cette recherche.");
    }
  };

  const handleResendNotification = (type: "SMS" | "EMAIL") => {
    if (!activeClient) return;
    logAction(
      "RESEND_NOTIFICATION",
      `Déclenchement du renvoi de notification (${type}) pour le client ${activeClient.name} (${activeClient.alias})`
    );
    setNotificationSent(`Notification ${type} réexpédiée à ${activeClient.name}`);
    setTimeout(() => setNotificationSent(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Support Client & Recherche Utilisateur
            </h2>
            <span className="rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs px-2.5 py-0.5 font-semibold">
              Module E (Lecture Seule Support)
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Consultation sécurisée des fiches clients, vérification des statuts et renvoi de SMS/Emails de confirmation.
          </p>
        </div>
      </div>

      {/* BARRE DE RECHERCHE RAPIDE MULTI-CRITÈRES */}
      <div className="ui-panel p-5">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par Nom, CIN, N° Téléphone, ALIAS client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-2.5 pl-10 pr-4 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-xs font-bold transition shadow-xs"
          >
            Rechercher Client
          </button>
        </form>
      </div>

      {/* FICHE CLIENT EN LECTURE SEULE (Si client sélectionné) */}
      {activeClient && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PANNEAU PROFIL CLIENT */}
          <div className="lg:col-span-5 ui-panel p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                  {activeClient.alias}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeClient.name}
                </h3>
              </div>
              <span className="ui-status-success rounded-full px-2.5 py-0.5 text-xs font-bold">
                {activeClient.accountStatus}
              </span>
            </div>

            {/* Banner Read-only reminder */}
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-2.5 text-xs text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center gap-2 font-medium">
              <Lock size={14} className="shrink-0 text-amber-600" />
              <span>Accès Support en LECTURE SEULE. Validation/Déblocage restreints.</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold">Numéro CIN</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeClient.cin}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold">Téléphone Principal</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeClient.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 font-semibold">Statut KYC</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Dossier Validé
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-semibold">Membre depuis</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{activeClient.registeredAt}</span>
              </div>
            </div>

            {/* DÉCLENCHEMENT RENVOI NOTIFICATIONS */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Assistance & Renvoi Notifications
              </p>

              {notificationSent && (
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 size={15} />
                  {notificationSent}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={!permissions.canResendNotifications}
                  onClick={() => handleResendNotification("SMS")}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-3 py-2 text-xs font-semibold shadow-xs transition disabled:opacity-50"
                >
                  <MessageSquare size={14} />
                  Renvois SMS
                </button>
                <button
                  disabled={!permissions.canResendNotifications}
                  onClick={() => handleResendNotification("EMAIL")}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 text-xs font-semibold transition disabled:opacity-50"
                >
                  <Mail size={14} />
                  Renvois Email
                </button>
              </div>
            </div>
          </div>

          {/* PANNEAU HISTORIQUE TRANSACTIONS CLIENT (LECTURE SEULE) */}
          <div className="lg:col-span-7 ui-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <History size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Dernières Transactions Client
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {activeClient.recentTxns.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs"
                >
                  <div>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{t.id}</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{t.type}</p>
                    <p className="text-[11px] text-slate-400">{t.date}</p>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {t.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
