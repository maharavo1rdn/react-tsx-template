import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { BrandMark } from "../../components/layout/BrandMark";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Connexion - Mkajy Hub";
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    window.setTimeout(() => {
      setIsSubmitting(false);
      navigate("/dashboard");
    }, 650);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.04)] ring-1 ring-slate-200/50 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-slate-50/40 p-10 lg:flex lg:flex-col border-r border-slate-100 relative">
          <div>
            <BrandMark />
          </div>

          <div className="flex flex-1 flex-col justify-center pr-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Mkajy Hub
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
              Plateforme centralisée pour l'instruction des dossiers KYC,
              l'analyse des risques et la supervision des opérations.
            </p>
          </div>

          {/* Ancre en bas : Footer discret */}
          <div className="mt-auto">
            <p className="text-sm font-medium text-slate-400">
              Accès sécurisé et audité
            </p>
          </div>
        </div>

        {/* Panneau de droite : Formulaire ultra-épuré */}
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
          <BrandMark className="mb-10 lg:hidden" />

          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Connexion
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Accédez à votre espace de travail.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="agent@mkajy.mg"
              autoComplete="email"
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
              <Checkbox label="Se souvenir de moi" />
              <button
                type="button"
                className="text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>

            <div className="pt-4 space-y-3">
              <Button
                type="submit"
                size="lg"
                className="w-full shadow-sm"
                isLoading={isSubmitting}
              >
                <LockKeyhole size={18} className="mr-2" />
                Se connecter
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => navigate("/dashboard")}
              >
                <Mail size={18} className="mr-2" />
                Mode démo
              </Button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
