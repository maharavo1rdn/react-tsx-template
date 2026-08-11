export default function Dashboard() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Bienvenue sur votre espace d'administration. Voici un aperçu de l'activité.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="p-6 bg-surface border border-slate-200 rounded-xl shadow-sm flex flex-col gap-3"
                    >
                        <div className="h-4 bg-slate-100 rounded-md w-1/2 animate-pulse"></div>
                        <div className="h-8 bg-slate-100 rounded-md w-1/3 animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}