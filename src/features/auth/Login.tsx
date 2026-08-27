import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Zap, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Connexion - Back-Office Financier";
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 600);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f4f5f9] dark:bg-slate-950 px-4 py-8">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl lg:grid-cols-2">
        {/* Left Branding Panel */}
        <div className="hidden bg-slate-900 dark:bg-slate-950 p-8 lg:flex lg:flex-col lg:justify-between text-white border-r border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold">
              <Zap size={20} className="fill-white text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              FinAdmin<span className="text-blue-500">.bo</span>
            </span>
          </div>

          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20">
              <ShieldCheck size={14} />
              Accès Restreint & Sécurisé
            </span>
            <h1 className="text-2xl font-bold tracking-tight leading-snug">
              Plateforme Back-Office d'Administration, KYC & Risk Monitoring.
            </h1>
            <p className="text-sm text-slate-400">
              Interface haute densité réservée aux agents internes. Authentification par rôles et traçabilité d'audit.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            © 2025 Bank Admin Inc. Tous droits réservés.
          </p>
        </div>

        {/* Right Form Panel */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Connexion Agent</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Veuillez saisir vos identifiants d'accès d'entreprise.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Adresse Email Pro
              </label>
              <input
                type="email"
                required
                defaultValue="b.vance@bank-admin.io"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                required
                defaultValue="••••••••••••"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-xs font-bold transition shadow-xs"
            >
              <LockKeyhole size={16} />
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-2.5 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <Mail size={16} />
              Accéder directement au Dashboard Démo
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
