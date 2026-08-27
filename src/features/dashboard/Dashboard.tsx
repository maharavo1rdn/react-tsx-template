import { Activity, ShieldCheck, Clock, AlertTriangle, ArrowUpRight, TrendingUp, UserCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const kpiStats = [
  { label: "KYC Validés Aujourd'hui", value: "48", trend: "+18%", icon: UserCheck },
  { label: "Temps Moyen SLA / Dossier", value: "11 min 45s", trend: "-2 min", icon: Clock },
  { label: "Volume Global 24h", value: "148,5 M MGA", trend: "+12.4%", icon: TrendingUp },
  { label: "Taux d'Échec Technique", value: "0.82%", trend: "-0.15%", icon: AlertTriangle },
];

const hourlyActivity = [
  { hour: "08h - 09h", kyc: 12, txns: 140, errors: 1 },
  { hour: "09h - 10h", kyc: 18, txns: 280, errors: 2 },
  { hour: "10h - 11h", kyc: 24, txns: 410, errors: 0 },
  { hour: "11h - 12h", kyc: 15, txns: 320, errors: 1 },
  { hour: "12h - 13h", kyc: 9, txns: 190, errors: 0 },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Tableau de Bord & Pilotage Agent
            </h2>
            <span className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs px-2.5 py-0.5 font-semibold">
              Rôle Actif : {user.role}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Indicateurs de performance en temps réel, métriques SLA et monitoring des flux financiers.
          </p>
        </div>
      </div>

      {/* KPI CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiStats.map((stat) => (
          <div key={stat.label} className="ui-panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {stat.label}
              </span>
              <div className="ui-icon-tile p-2 rounded-xl">
                <stat.icon size={18} />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </span>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight size={14} />
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ACTIVITY GRAPH & SLA METRICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graphique / Tableau Activité par tranche horaire */}
        <div className="lg:col-span-8 ui-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Volume d'Activité par Tranche Horaire
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Mise à jour à l'instant</span>
          </div>

          <div className="space-y-3">
            {hourlyActivity.map((slot) => (
              <div key={slot.hour} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{slot.hour}</span>
                  <span className="font-mono">{slot.txns} Transactions / {slot.kyc} KYC</span>
                </div>
                {/* Visual Bar representing density */}
                <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="bg-blue-600 h-full rounded-l-full"
                    style={{ width: `${(slot.txns / 500) * 100}%` }}
                    title={`Transactions : ${slot.txns}`}
                  />
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(slot.kyc / 30) * 20}%` }}
                    title={`KYC Validés : ${slot.kyc}`}
                  />
                  {slot.errors > 0 && (
                    <div
                      className="bg-rose-500 h-full rounded-r-full"
                      style={{ width: "4%" }}
                      title={`Échecs : ${slot.errors}`}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panneau latéral Métriques Agents */}
        <div className="lg:col-span-4 ui-panel p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Agents en Service
              </h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Marc Randria</p>
                <p className="text-[11px] text-slate-400">Agent KYC • 14 dossiers traités</p>
              </div>
              <span className="ui-status-success rounded-full px-2 py-0.5 font-bold text-[10px]">
                En ligne
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Brooklyn Vance (Vous)</p>
                <p className="text-[11px] text-slate-400">Superviseur • Espace actif</p>
              </div>
              <span className="ui-status-success rounded-full px-2 py-0.5 font-bold text-[10px]">
                En ligne
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">Tahina Razafy</p>
                <p className="text-[11px] text-slate-400">Analyste Risque • Pause de midi</p>
              </div>
              <span className="ui-status-pending rounded-full px-2 py-0.5 font-bold text-[10px]">
                Occupé
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
