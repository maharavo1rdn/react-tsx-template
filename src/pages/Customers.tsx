import { Plus, Search, UserX } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Customers() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez votre base de clients et leurs informations.</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          Nouveau client
        </Button>
      </div>

      <div className="bg-surface p-6 border border-slate-200 rounded-xl shadow-sm">
        <div className="max-w-md flex items-end gap-3 mb-8">
          <Input
            label="Rechercher un client"
            placeholder="Nom, email, entreprise..."
            type="search"
          />
          <Button variant="outline" className="px-3" aria-label="Rechercher">
            <Search size={18} className="text-slate-500" />
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-100 rounded-lg">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <UserX size={24} className="text-slate-400" />
          </div>
          <h3 className="text-slate-900 font-medium mb-1">Aucun client trouvé</h3>
          <p className="text-slate-500 text-sm mb-4 max-w-sm">
            Vous n'avez pas encore de clients enregistrés ou votre recherche n'a donné aucun résultat.
          </p>
          <Button variant="outline" className="gap-2">
            <Plus size={16} />
            Ajouter le premier client
          </Button>
        </div>
      </div>
    </div>
  );
}