import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { RotateCcw, Save, Wand2 } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Switch } from "../../components/ui/Switch";
import { Textarea } from "../../components/ui/Textarea";
import { Toast } from "../../components/ui/Feedback";

const customerTypes = [
  { label: "Particulier", value: "individual" },
  { label: "Entreprise", value: "company" },
  { label: "Administration", value: "public" },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  customerType: "",
  company: "",
  reference: "",
  notes: "",
  enabled: true,
  verified: false,
};

type CustomerForm = typeof initialForm;
type FormField = keyof CustomerForm;

export default function CustomerCreate() {
  const [form, setForm] = useState<CustomerForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState("Brouillon prêt.");

  useEffect(() => {
    document.title = form.fullName
      ? `${form.fullName} - Nouveau client`
      : "Nouveau client - LR";
  }, [form.fullName]);

  useEffect(() => {
    localStorage.setItem("customer-create-draft", JSON.stringify(form));
  }, [form]);

  const updateField = (field: FormField, value: CustomerForm[FormField]) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleTextChange =
    (field: FormField) =>
    (
      event: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      updateField(field, event.target.value);
    };

  const fillExample = () => {
    setForm({
      fullName: "Andry Rakoto",
      email: "andry@entreprise.mg",
      phone: "+261 34 00 000 00",
      customerType: "company",
      company: "Ravinala Digital",
      reference: "CLI-2026-001",
      notes: "Client prioritaire, intéressé par une offre annuelle.",
      enabled: true,
      verified: true,
    });
    setFeedback("Exemple injecté via onClick.");
  };

  const resetForm = () => {
    setForm(initialForm);
    setFeedback("Formulaire réinitialisé via onClick.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFeedback("Simulation d'enregistrement en cours.");

    window.setTimeout(() => {
      setIsSaving(false);
      setFeedback("Client prêt à être envoyé vers l'API.");
    }, 700);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">
          Nouveau client
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Exemple de formulaire typé, accessible et réutilisable.
        </p>
      </div>

      <Toast
        tone="info"
        title="Exemples useEffect et onClick"
        description={`useEffect synchronise le titre de page et sauvegarde le brouillon. Les boutons ci-dessous montrent des handlers onClick. Statut : ${feedback}`}
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-100 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="button" onClick={fillExample}>
            <Wand2 size={16} />
            Préremplir
          </Button>
          <Button variant="outline" type="button" onClick={resetForm}>
            <RotateCcw size={16} />
            Réinitialiser
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Nom complet"
            placeholder="Ex. Andry Rakoto"
            autoComplete="name"
            value={form.fullName}
            onChange={handleTextChange("fullName")}
          />
          <Input
            label="Adresse email"
            placeholder="andry@entreprise.mg"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleTextChange("email")}
          />
          <Input
            label="Téléphone"
            placeholder="+261 34 00 000 00"
            type="tel"
            helperText="Format international recommandé."
            value={form.phone}
            onChange={handleTextChange("phone")}
          />
          <Select
            label="Type de client"
            placeholder="Sélectionner un type"
            options={customerTypes}
            value={form.customerType}
            onChange={handleTextChange("customerType")}
          />
          <Input
            label="Entreprise"
            placeholder="Nom de l'entreprise"
            value={form.company}
            onChange={handleTextChange("company")}
          />
          <Input
            label="Référence interne"
            placeholder="CLI-2026-001"
            value={form.reference}
            onChange={handleTextChange("reference")}
            error={
              form.reference === "CLI-2026-001"
                ? "Cette référence existe déjà."
                : undefined
            }
          />
          <div className="md:col-span-2">
            <Textarea
              label="Notes"
              placeholder="Contexte, besoins, prochaines actions..."
              value={form.notes}
              onChange={handleTextChange("notes")}
            />
          </div>
          <div className="md:col-span-2">
            <Switch
              label="Activer le compte immédiatement"
              helperText="Le client recevra les notifications transactionnelles après création."
              checked={form.enabled}
              onChange={(event) => updateField("enabled", event.target.checked)}
            />
          </div>
          <div className="md:col-span-2">
            <Checkbox
              label="J'ai vérifié les informations saisies"
              helperText="À remplacer par une vraie règle métier si nécessaire."
              checked={form.verified}
              onChange={(event) =>
                updateField("verified", event.target.checked)
              }
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <Button variant="secondary" type="button" onClick={resetForm}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isSaving}>
            <Save size={16} />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
