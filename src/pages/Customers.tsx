import { MoreHorizontal, Plus, Search, Trash2, UserX } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/Feedback";

export default function Customers() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Clients</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gérez votre base de clients et leurs informations.
          </p>
        </div>
        <Link
          to="/customers/create"
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 sm:w-auto"
        >
          <Plus size={16} />
          Nouveau client
        </Link>
      </div>

      <section className="rounded-lg border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="w-full max-w-md">
            <Input
              label="Rechercher un client"
              placeholder="Nom, email, entreprise..."
              type="search"
            />
          </div>
          <Button variant="secondary" aria-label="Rechercher" size="icon">
            <Search size={17} />
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-100">
          <div className="grid grid-cols-[1.2fr_1fr_0.7fr_auto] gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase text-slate-500 max-md:hidden">
            <span>Client</span>
            <span>Email</span>
            <span>Statut</span>
            <span>Actions</span>
          </div>
          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-1 gap-3 px-4 py-4 md:grid-cols-[1.2fr_1fr_0.7fr_auto] md:items-center md:gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Naina Studio
                </p>
                <p className="text-xs text-slate-500">Compte professionnel</p>
              </div>
              <p className="text-sm text-slate-600">contact@naina.dev</p>
              <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                Actif
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" aria-label="Plus d'actions">
                  <MoreHorizontal size={17} />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Supprimer">
                  <Trash2 size={16} className="text-rose-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <EmptyState
            icon={UserX}
            title="Aucun résultat pour ce filtre"
            description="L'état vide est prêt à être utilisé quand l'API renvoie une liste vide ou qu'une recherche n'a aucun résultat."
            action={
              <Button variant="outline">
                <Plus size={16} />
                Ajouter le premier client
              </Button>
            }
          />
        </div>
      </section>
    </div>
  );
}
