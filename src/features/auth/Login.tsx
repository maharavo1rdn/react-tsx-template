import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { BrandMark } from "../../components/layout/BrandMark";
import { Button } from "../../components/ui/Button";
import { Checkbox } from "../../components/ui/Checkbox";
import { Input } from "../../components/ui/Input";
import { Toast } from "../../components/ui/Feedback";

export default function Login() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        document.title = "Connexion - LR";
    }, []);

    const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        window.setTimeout(() => {
            setIsSubmitting(false);
            navigate("/dashboard");
        }, 650);
    };

    return (
        <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-8">
            <section className="grid w-full max-w-5xl overflow-hidden rounded-xl bg-[#fffefd] shadow-[0_24px_70px_rgba(23,32,51,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
                <div className="hidden bg-surface-warm p-8 lg:flex lg:flex-col lg:justify-between">
                    <BrandMark />
                    <div className="space-y-4">
                        <p className="text-sm font-semibold uppercase text-sky-700">Accès sécurisé</p>
                        <h1 className="max-w-sm text-3xl font-semibold text-slate-950">Un espace clair pour piloter vos opérations.</h1>
                        <p className="max-w-md text-base text-slate-600">
                            Le login reste volontairement séparé du layout applicatif : aucun header, aucune sidebar, seulement le parcours d'authentification.
                        </p>
                    </div>
                    <p className="text-sm text-slate-500">Variables, sessions et validations sont à connecter côté backend.</p>
                </div>

                <div className="p-6 sm:p-8 lg:p-10">
                    <BrandMark className="mb-8 lg:hidden" />
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-slate-950">Connexion</h2>
                        <p className="mt-1 text-base text-slate-500">Entrez vos identifiants pour accéder au tableau de bord.</p>
                    </div>

                    <Toast
                        tone="info"
                        title="Compte de démonstration"
                        description="Le formulaire simule une connexion puis redirige vers le dashboard."
                    />

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <Input
                            label="Adresse email"
                            type="email"
                            placeholder="admin@LR.dev"
                            autoComplete="email"
                            required
                        />
                        <Input
                            label="Mot de passe"
                            type="password"
                            placeholder="Votre mot de passe"
                            autoComplete="current-password"
                            required
                        />

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <Checkbox label="Se souvenir de moi" helperText="À connecter à votre stratégie de session." />
                            <button type="button" className="text-left text-sm font-semibold text-sky-700 hover:text-sky-800">
                                Mot de passe oublié
                            </button>
                        </div>

                        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
                            <LockKeyhole size={17} />
                            Se connecter
                        </Button>

                        <Button type="button" variant="secondary" size="lg" className="w-full" onClick={() => navigate("/dashboard")}>
                            <Mail size={17} />
                            Continuer en mode démo
                        </Button>
                    </form>
                </div>
            </section>
        </main>
    );
}
