import { Activity, CreditCard, TrendingUp, Users } from "lucide-react";
import { Skeleton, Toast } from "../components/ui/Feedback";

const stats = [
  { label: "Clients actifs", value: "1 284", trend: "+12,4%", icon: Users },
  {
    label: "Revenus mensuels",
    value: "42,8 M Ar",
    trend: "+8,1%",
    icon: CreditCard,
  },
  {
    label: "Taux de conversion",
    value: "18,6%",
    trend: "+2,7%",
    icon: TrendingUp,
  },
];

const activities = [
  { label: "Contrat renouvelé", detail: "Entreprise Ravinala", time: "09:24" },
  {
    label: "Nouveau prospect",
    detail: "Qualification commerciale",
    time: "10:10",
  },
  { label: "Facture validée", detail: "Paiement confirmé", time: "11:38" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-2">
        <p className="text-sm font-medium text-sky-700">Vue synthétique</p>
        <h2 className="text-2xl font-semibold text-slate-950 sm:text-3xl">
          Pilotage clair, actions rapides.
        </h2>
        <p className="max-w-2xl text-sm text-slate-500">
          Les indicateurs restent lisibles, les états sont explicites et la
          hiérarchie visuelle privilégie le scan rapide.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-subtle text-sky-700">
                <stat.icon size={18} />
              </span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-2xl font-semibold text-slate-950">
                {stat.value}
              </p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-950">
                Activité récente
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Dernières opérations importantes.
              </p>
            </div>
            <Activity size={18} className="text-slate-400" />
          </div>
          <div className="divide-y divide-slate-100">
            {activities.map((activity) => (
              <div
                key={`${activity.label}-${activity.time}`}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {activity.label}
                  </p>
                  <p className="text-sm text-slate-500">{activity.detail}</p>
                </div>
                <time className="text-xs font-medium text-slate-400">
                  {activity.time}
                </time>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <h2 className="text-base font-semibold text-slate-950">
            Chargement maîtrisé
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Exemple de skeleton loader discret pour les données asynchrones.
          </p>
          <div className="mt-5 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-5/6" />
          </div>
          <div className="mt-5">
            <Toast
              tone="success"
              title="Synchronisation terminée"
              description="Les retours utilisateur utilisent des composants dédiés, pas alert()."
            />
          </div>
        </section>
      </div>
    </div>
  );
}
