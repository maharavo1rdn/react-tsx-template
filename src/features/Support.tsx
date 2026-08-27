import { useState } from "react";
import {
  CheckCircle2,
  LifeBuoy,
  Mail,
  Phone,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  User,
  XCircle,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export interface SupportCustomerProfile {
  id: string;
  fullName: string;
  cin: string;
  phone: string;
  email: string;
  alias: string;
  registrationDate: string;
  kycStatus: "VALIDE" | "EN_ATTENTE" | "REJETE";
  kycReason?: string;
  accountStatus: "ACTIF" | "SUSPENDU" | "BLOQUE";
  recentTransactions: {
    id: string;
    type: string;
    amountAr: number;
    date: string;
    status: string;
  }[];
}

const mockSupportDatabase: SupportCustomerProfile[] = [
  {
    id: "CUST-1001",
    fullName: "Rasoanaivo Harisoa",
    cin: "101 245 890 112",
    phone: "+261 34 12 345 67",
    email: "harisoa.rasoanaivo@gmail.com",
    alias: "MK-882104",
    registrationDate: "2026-01-15",
    kycStatus: "VALIDE",
    accountStatus: "ACTIF",
    recentTransactions: [
      { id: "TXN-9901", type: "DEPOT", amountAr: 250000, date: "2026-08-27 10:42", status: "SUCCES" },
      { id: "TXN-9840", type: "RETRAIT", amountAr: 50000, date: "2026-08-20 14:10", status: "SUCCES" },
    ],
  },
  {
    id: "CUST-1002",
    fullName: "Ratsimbazafy Heriniaina",
    cin: "101 445 092 110",
    phone: "+261 34 88 901 22",
    email: "heriniaina.r@yahoo.fr",
    alias: "MK-582910",
    registrationDate: "2026-03-10",
    kycStatus: "VALIDE",
    accountStatus: "BLOQUE",
    recentTransactions: [
      { id: "TXN-9710", type: "REMBOURSEMENT", amountAr: 120000, date: "2026-05-10 09:12", status: "ECHEC" },
    ],
  },
  {
    id: "CUST-1003",
    fullName: "Randrianarivelo Faly",
    cin: "301 445 109 998",
    phone: "+261 34 55 123 99",
    email: "faly.randria@outlook.com",
    alias: "MK-772109",
    registrationDate: "2026-08-25",
    kycStatus: "REJETE",
    kycReason: "Pièce CIN recto illisible",
    accountStatus: "SUSPENDU",
    recentTransactions: [],
  },
];

export default function Support() {
  const [query, setQuery] = useState("");
  const [activeProfile, setActiveProfile] = useState<SupportCustomerProfile | null>(
    mockSupportDatabase[0] ?? null
  );
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const found = mockSupportDatabase.find(
      (c) =>
        c.fullName.toLowerCase().includes(query.toLowerCase()) ||
        c.cin.includes(query) ||
        c.phone.includes(query) ||
        c.alias.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      setActiveProfile(found);
      setNotificationStatus(null);
    } else {
      setActiveProfile(null);
    }
  };

  const handleTriggerSmsNotification = () => {
    if (!activeProfile) return;
    setNotificationStatus(`Notification SMS de confirmation renvoyée avec succès à ${activeProfile.phone}.`);
  };

  const handleTriggerEmailNotification = () => {
    if (!activeProfile) return;
    setNotificationStatus(`Email de confirmation & instructions renvoyé avec succès à ${activeProfile.email}.`);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <LifeBuoy className="text-emerald-600 dark:text-emerald-400" size={24} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Support Client & Consultation
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Rôle 3 • Consultation en LECTURE SEULE, recherche par Nom/CIN/Phone/ALIAS & renvoi de notifications
          </p>
        </div>
      </div>

      {/* Quick Search Form */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 items-end">
          <div className="flex-1">
            <Input
              label="Recherche rapide d'utilisateur"
              placeholder="Saisissez un Nom, N° CIN, N° Téléphone ou Identifiant / ALIAS (ex. MK-882104)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-10">
            <Search size={16} />
            Rechercher Client
          </Button>
        </form>
      </section>

      {notificationStatus && (
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{notificationStatus}</span>
          </div>
          <button onClick={() => setNotificationStatus(null)} className="text-emerald-700 dark:text-emerald-300 hover:underline">
            Masquer
          </button>
        </div>
      )}

      {/* Profile Detail View (Read Only) */}
      {activeProfile ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Info Card */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-lg border border-slate-200 dark:border-slate-700">
                  <User size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {activeProfile.fullName}
                    </h3>
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800">
                      {activeProfile.alias}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">ID Interne : {activeProfile.id} • Inscrit le : {activeProfile.registrationDate}</p>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                Mode Lecture Seule
              </span>
            </div>

            {/* Read-Only Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Numéro CIN</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {activeProfile.cin}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Téléphone Portable</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  {activeProfile.phone}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Adresse Email</span>
                <span className="font-medium text-slate-900 dark:text-white truncate block">
                  {activeProfile.email}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Statut Compte</span>
                <span className="inline-flex items-center gap-1 font-bold">
                  {activeProfile.accountStatus === "ACTIF" && (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck size={14} /> Actif
                    </span>
                  )}
                  {activeProfile.accountStatus === "BLOQUE" && (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <ShieldAlert size={14} /> Bloqué (Recouvrement)
                    </span>
                  )}
                  {activeProfile.accountStatus === "SUSPENDU" && (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <ShieldAlert size={14} /> Suspendu
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* KYC Status & Details */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Statut Dossier KYC
                </span>
                {activeProfile.kycStatus === "VALIDE" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                    Validé
                  </span>
                )}
                {activeProfile.kycStatus === "REJETE" && (
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold text-[10px]">
                    Rejeté
                  </span>
                )}
              </div>
              {activeProfile.kycReason && (
                <p className="text-xs text-rose-700 dark:text-rose-400 italic font-mono">
                  Motif de rejet enregistré : "{activeProfile.kycReason}"
                </p>
              )}
            </div>

            {/* Read-Only Recent Transactions */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Historique des transactions (Lecture seule)
              </h4>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500">
                    <tr>
                      <th className="p-2.5">ID Txn</th>
                      <th className="p-2.5">Type</th>
                      <th className="p-2.5">Montant</th>
                      <th className="p-2.5">Date</th>
                      <th className="p-2.5 text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activeProfile.recentTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="p-2.5 font-bold text-slate-900 dark:text-white">{tx.id}</td>
                        <td className="p-2.5">{tx.type}</td>
                        <td className="p-2.5">{tx.amountAr.toLocaleString()} Ar</td>
                        <td className="p-2.5 text-slate-400">{tx.date}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-600">{tx.status}</td>
                      </tr>
                    ))}
                    {activeProfile.recentTransactions.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-4 text-center text-slate-400 font-sans text-xs">
                          Aucune transaction récente enregistrée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Action Panel (Allowed Actions for Support) */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Send size={18} className="text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Actions de Support Autorisées
                </h3>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Le rôle Support Client permet de déclencher le renvoi des notifications de confirmation par SMS ou Email.
              </p>

              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleTriggerSmsNotification}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                >
                  <Phone size={15} />
                  Renvois Notification SMS
                </Button>

                <Button
                  onClick={handleTriggerEmailNotification}
                  variant="outline"
                  className="w-full text-xs font-semibold"
                >
                  <Mail size={15} />
                  Renvois Notification Email
                </Button>
              </div>
            </div>

            {/* Role Restriction Banner */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30 p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <XCircle size={16} /> Restrictions du rôle Support
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                Impossible de valider/rejeter un KYC ou de débloquer un compte suspendu depuis cet écran. Ces actions requièrent un rôle <strong>AGENT_KYC</strong> ou <strong>RISK_ANALYST</strong>.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-slate-400 text-xs">
          Aucun utilisateur trouvé pour cette recherche.
        </div>
      )}
    </div>
  );
}
