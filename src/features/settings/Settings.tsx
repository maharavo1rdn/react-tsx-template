import { Settings2 } from "lucide-react";
import { ConfirmDialog, Toast } from "@components/ui/Feedback";

export default function Settings() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Paramètres</h2>
        <p className="mt-1 text-sm text-slate-500">
          Zone prévue pour les préférences globales de l'application.
        </p>
      </div>
      <section className="ui-panel p-5">
        <div className="flex items-start gap-3">
          <span className="ui-icon-tile flex h-10 w-10 items-center justify-center rounded-lg">
            <Settings2 size={19} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-950">
              Actions sensibles
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Le template inclut un composant de confirmation réutilisable pour
              les suppressions et annulations critiques.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <Toast
            tone="warning"
            title="Confirmation requise"
            description="Les actions destructives doivent passer par une modale dédiée."
          />
        </div>
      </section>
      <ConfirmDialog
        open={false}
        title="Supprimer l'élément"
        description="Cette action est définitive."
        onCancel={() => undefined}
        onConfirm={() => undefined}
      />
    </div>
  );
}
