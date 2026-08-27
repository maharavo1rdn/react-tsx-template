import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import type { UserRole } from "../../types/navigation";

const rolePresets: { role: UserRole; title: string; email: string; desc: string }[] = [
  {
    role: "AGENT_KYC",
    title: "Agent KYC",
    email: "kyc.agent@mkajy.mg",
    desc: "Validation des pièces justificatives & dossiers d'inscription",
  },
  {
    role: "RISK_ANALYST",
    title: "Analyste Risque",
    email: "risk.analyst@mkajy.mg",
    desc: "Monitoring transactions, suspensions & recouvrements",
  },
  {
    role: "CUSTOMER_SUPPORT",
    title: "Support Client",
    email: "support@mkajy.mg",
    desc: "Recherche d'utilisateurs & consultation en lecture seule",
  },
  {
    role: "SUPERVISOR",
    title: "Superviseur / Admin",
    email: "supervisor@mkajy.mg",
    desc: "Accès complet, métriques globales & journal d'audit",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("SUPERVISOR");
  const [email, setEmail] = useState("supervisor@mkajy.mg");
  const [password, setPassword] = useState("••••••••••••");

  useEffect(() => {
    document.title = "Connexion - Mkajy Hub";
  }, []);

  const handleRoleSelect = (role: UserRole, roleEmail: string) => {
    setSelectedRole(role);
    setEmail(roleEmail);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    localStorage.setItem("mkajy-user-role", selectedRole);

    window.setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 400);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl lg:grid-cols-[1fr_1.1fr]">

        {/* Left Panel: Mkajy Hub Presentation & Roles */}
        <div className="flex flex-col justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-lg shadow-sm">
                MK
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                  Mkajy Hub
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Plateforme Back-Office Internes
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <ShieldCheck size={14} />
                Contrôle d'accès basé sur les rôles (RBAC)
              </span>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Authentification Sécurisée
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sélectionnez un rôle métier pour tester l'adaptation dynamique de l'interface et des permissions Back-Office.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Pré-sélection du profil de démonstration :
              </p>
              <div className="grid gap-2">
                {rolePresets.map((preset) => {
                  const isSelected = selectedRole === preset.role;
                  return (
                    <button
                      key={preset.role}
                      type="button"
                      onClick={() => handleRoleSelect(preset.role, preset.email)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white ring-1 ring-indigo-600"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <UserCheck
                        size={18}
                        className={`mt-0.5 shrink-0 ${
                          isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {preset.title}
                          </p>
                          <span className="text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400">
                            {preset.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {preset.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="mt-6 text-[11px] text-slate-400 dark:text-slate-500">
            Mkajy Hub &copy; 2026 • Conformité WCAG 2.1 AA & Tracé Audit Logs
          </p>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Connexion Agent</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Saisissez vos identifiants internes pour accéder à la session {selectedRole}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Adresse email professionnelle"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@mkajy.mg"
              autoComplete="email"
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              autoComplete="current-password"
              required
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Checkbox label="Se souvenir de cette session" helperText="Conservation sécurisée du jeton" />
              <button type="button" className="text-left text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Mot de passe oublié ?
              </button>
            </div>

            <div className="pt-2 space-y-2">
              <Button type="submit" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold" isLoading={isSubmitting}>
                <LockKeyhole size={17} />
                Se connecter en tant que {selectedRole}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => {
                  localStorage.setItem("mkajy-user-role", selectedRole);
                  navigate("/dashboard");
                }}
              >
                <Mail size={17} />
                Accès direct session démo
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
