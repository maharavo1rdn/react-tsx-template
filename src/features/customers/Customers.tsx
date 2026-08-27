import { useState, useEffect, useCallback } from "react";
import {
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  Filter,
  Lock,
  Maximize2,
  Minimize2,
  RotateCw,
  XCircle,
  ZoomIn,
  ZoomOut,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";

export interface KycItem {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  cin: string;
  dob: string;
  address: string;
  phone: string;
  submissionDate: string;
  slaMinutes: number;
  status: "EN_ATTENTE" | "EN_COURS" | "VALIDE" | "REJETE";
  lockedBy?: string;
  score: number;
  documents: {
    type: string;
    label: string;
    url: string;
  }[];
}

const mockKycQueue: KycItem[] = [
  {
    id: "KYC-2026-8801",
    fullName: "Rasoanaivo Harisoa",
    firstName: "Harisoa",
    lastName: "Rasoanaivo",
    cin: "101 245 890 112",
    dob: "14/08/1992",
    address: "Lot II M 45 Antanimena, Antananarivo 101",
    phone: "+261 34 12 345 67",
    submissionDate: "2026-08-27 08:30",
    slaMinutes: 12,
    status: "EN_ATTENTE",
    score: 94,
    documents: [
      { type: "cin_recto", label: "CIN Recto", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
      { type: "cin_verso", label: "CIN Verso", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80" },
      { type: "selfie", label: "Selfie de vérification", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "KYC-2026-8802",
    fullName: "Rakotondrazaka Andry",
    firstName: "Andry",
    lastName: "Rakotondrazaka",
    cin: "201 098 334 511",
    dob: "03/11/1988",
    address: "Enceinte PAMF Ankorondrano, Antananarivo",
    phone: "+261 32 04 999 12",
    submissionDate: "2026-08-27 09:15",
    slaMinutes: 45,
    status: "EN_COURS",
    lockedBy: "Agent KYC - Jean Marc",
    score: 88,
    documents: [
      { type: "cin_recto", label: "CIN Recto", url: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80" },
      { type: "selfie", label: "Selfie", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "KYC-2026-8803",
    fullName: "Ramanantsoa Voahirana",
    firstName: "Voahirana",
    lastName: "Ramanantsoa",
    cin: "112 309 881 002",
    dob: "22/05/1995",
    address: "Manakara Centre, BP 402",
    phone: "+261 33 88 112 00",
    submissionDate: "2026-08-27 07:10",
    slaMinutes: 125,
    status: "VALIDE",
    score: 98,
    documents: [
      { type: "cin_recto", label: "CIN Recto", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80" },
    ],
  },
  {
    id: "KYC-2026-8804",
    fullName: "Randrianarivelo Faly",
    firstName: "Faly",
    lastName: "Randrianarivelo",
    cin: "301 445 109 998",
    dob: "19/01/1990",
    address: "Fianarantsoa Haute Ville",
    phone: "+261 34 55 123 99",
    submissionDate: "2026-08-26 16:40",
    slaMinutes: 320,
    status: "REJETE",
    score: 42,
    documents: [
      { type: "cin_recto", label: "CIN Recto", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80" },
    ],
  },
];

export default function Customers() {
  const [queue, setQueue] = useState<KycItem[]>(mockKycQueue);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedKyc, setSelectedKyc] = useState<KycItem | null>(null);

  // Document viewer states
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [contrastHigh, setContrastHigh] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("Pièce illisible");
  const [rejectNotes, setRejectNotes] = useState("");

  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleOpenInspection = (item: KycItem) => {
    // Soft Lock simulation
    setQueue((prev) =>
      prev.map((k) =>
        k.id === item.id && k.status === "EN_ATTENTE"
          ? { ...k, status: "EN_COURS", lockedBy: "Vous (Session Agent)" }
          : k
      )
    );
    setSelectedKyc({
      ...item,
      status: item.status === "EN_ATTENTE" ? "EN_COURS" : item.status,
      lockedBy: item.lockedBy || "Vous (Session Agent)",
    });
    setActiveDocIndex(0);
    setZoom(1);
    setRotation(0);
    setContrastHigh(false);
  };

  const handleCloseInspection = useCallback(() => {
    setSelectedKyc(null);
  }, []);

  const handleApprove = useCallback(() => {
    if (!selectedKyc) return;
    const generatedAlias = `MK-${Math.floor(100000 + Math.random() * 900000)}`;
    setQueue((prev) =>
      prev.map((k) => (k.id === selectedKyc.id ? { ...k, status: "VALIDE" } : k))
    );
    setActionSuccessMessage(`Dossier ${selectedKyc.id} validé avec succès. Identifiant Client (ALIAS) généré : ${generatedAlias}`);
    setSelectedKyc(null);
  }, [selectedKyc]);

  const handleConfirmReject = () => {
    if (!selectedKyc) return;
    setQueue((prev) =>
      prev.map((k) => (k.id === selectedKyc.id ? { ...k, status: "REJETE" } : k))
    );
    setActionSuccessMessage(`Dossier ${selectedKyc.id} rejeté. Motif : ${rejectReason}`);
    setRejectModalOpen(false);
    setSelectedKyc(null);
  };

  const handleConfirmRevision = () => {
    if (!selectedKyc) return;
    setQueue((prev) =>
      prev.map((k) => (k.id === selectedKyc.id ? { ...k, status: "EN_ATTENTE" } : k))
    );
    setActionSuccessMessage(`Notification de révision envoyée pour le dossier ${selectedKyc.id}.`);
    setRevisionModalOpen(false);
    setSelectedKyc(null);
  };

  // Keyboard Shortcuts (Hotkeys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedKyc) return;
      if (e.key === "Escape") {
        if (rejectModalOpen) setRejectModalOpen(false);
        else if (revisionModalOpen) setRevisionModalOpen(false);
        else handleCloseInspection();
      } else if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        handleApprove();
      } else if (e.altKey && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        setRejectModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedKyc, rejectModalOpen, revisionModalOpen, handleApprove, handleCloseInspection]);

  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(search.toLowerCase()) ||
      item.cin.includes(search) ||
      item.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck2 className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Validation & Queue KYC
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Module A • Inspection des pièces d'état civil, verrouillage Soft Lock & raccourcis clavier
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <span>Raccourcis:</span>
          <span className="bg-white dark:bg-slate-700 px-1 rounded border">Alt+A</span> Valider
          <span className="bg-white dark:bg-slate-700 px-1 rounded border">Alt+R</span> Rejeter
          <span className="bg-white dark:bg-slate-700 px-1 rounded border">Esc</span> Fermer
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button onClick={() => setActionSuccessMessage(null)} className="text-emerald-700 dark:text-emerald-300 hover:underline">
            Masquer
          </button>
        </div>
      )}

      {/* Split View Modal / Full Inspector */}
      {selectedKyc ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
          {/* Inspection Topbar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-3 bg-slate-50 dark:bg-slate-900/60">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {selectedKyc.id}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {selectedKyc.fullName}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-semibold px-2 py-0.5 border border-amber-200 dark:border-amber-800">
                <Lock size={10} />
                {selectedKyc.lockedBy}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">
                Score automatique : <strong className="text-slate-900 dark:text-white font-mono">{selectedKyc.score}%</strong>
              </span>
              <Button variant="ghost" size="sm" onClick={handleCloseInspection}>
                Fermer (Esc)
              </Button>
            </div>
          </div>

          {/* Split View Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800 min-h-[500px]">
            {/* Left Panel: Inspection Form */}
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Données d'État Civil Saisies
                </h3>
                <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                  Statut : {selectedKyc.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">N° CIN</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {selectedKyc.cin}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Téléphone</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                    {selectedKyc.phone}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Nom complet</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedKyc.fullName}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Date de naissance</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {selectedKyc.dob}
                  </span>
                </div>
                <div className="col-span-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">Adresse Résidence</span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {selectedKyc.address}
                  </span>
                </div>
              </div>

              {/* Automated Rules Checks */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Contrôles automatiques backend
                </p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Format CIN & Unicité</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Conforme
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Score de détection de visage (Selfie / CIN)</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} /> High match (96%)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Recherche listes de sanctions & PEP</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 size={13} /> Aucun résultat (Clean)
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={handleApprove}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    <CheckCircle2 size={15} />
                    [Alt+A] Valider
                  </Button>
                  <Button
                    onClick={() => setRejectModalOpen(true)}
                    variant="outline"
                    className="border-rose-300 text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold"
                  >
                    <XCircle size={15} />
                    [Alt+R] Rejeter
                  </Button>
                  <Button
                    onClick={() => setRevisionModalOpen(true)}
                    variant="secondary"
                    className="text-xs font-semibold"
                  >
                    <RotateCcw size={15} />
                    Révision
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Panel: Document Viewer */}
            <div className="p-5 flex flex-col justify-between bg-slate-900 text-white min-h-[450px]">
              {/* Document Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex gap-2">
                  {selectedKyc.documents.map((doc, idx) => (
                    <button
                      key={doc.type}
                      onClick={() => {
                        setActiveDocIndex(idx);
                        setZoom(1);
                        setRotation(0);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        activeDocIndex === idx
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {doc.label}
                    </button>
                  ))}
                </div>

                {/* Viewer Toolbar */}
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                  <button
                    onClick={() => setZoom((z) => Math.min(z + 0.25, 3))}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Zoom avant"
                  >
                    <ZoomIn size={15} />
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Zoom arrière"
                  >
                    <ZoomOut size={15} />
                  </button>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Rotation 90°"
                  >
                    <RotateCw size={15} />
                  </button>
                  <button
                    onClick={() => setContrastHigh((c) => !c)}
                    className={`p-1 rounded text-slate-300 ${contrastHigh ? "bg-indigo-600 text-white" : "hover:bg-slate-700"}`}
                    title="Ajuster le contraste"
                  >
                    <Filter size={15} />
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-1 hover:bg-slate-700 rounded text-slate-300"
                    title="Plein écran"
                  >
                    {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                  </button>
                </div>
              </div>

              {/* Canvas Preview */}
              <div className="flex-1 flex items-center justify-center overflow-hidden my-4 relative bg-slate-950 rounded-xl p-4">
                {selectedKyc.documents[activeDocIndex] ? (
                  <img
                    src={selectedKyc.documents[activeDocIndex].url}
                    alt={selectedKyc.documents[activeDocIndex].label}
                    className="max-h-[340px] max-w-full object-contain transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom}) rotate(${rotation}deg)`,
                      filter: contrastHigh ? "contrast(180%) brightness(110%)" : "none",
                    }}
                  />
                ) : (
                  <p className="text-xs text-slate-500">Aucun document chargé</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
                <span>Zoom : {Math.round(zoom * 100)}%</span>
                <span>Rotation : {rotation}°</span>
                <span>Contraste : {contrastHigh ? "Élevé" : "Normal"}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Queue View */
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex-1 max-w-md">
              <Input
                label="Recherche rapide"
                placeholder="Rechercher par Nom, ID Dossier, N° CIN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                label="Filtrer par statut"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { label: "Tous les statuts", value: "ALL" },
                  { label: "En attente", value: "EN_ATTENTE" },
                  { label: "En cours d'examen", value: "EN_COURS" },
                  { label: "Validé", value: "VALIDE" },
                  { label: "Rejeté", value: "REJETE" },
                ]}
              />
            </div>
          </div>

          {/* Queue Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="px-4 py-3">ID Dossier</th>
                  <th className="px-4 py-3">Client (Nom & Prénom)</th>
                  <th className="px-4 py-3">N° CIN</th>
                  <th className="px-4 py-3">Soumission</th>
                  <th className="px-4 py-3">SLA Attente</th>
                  <th className="px-4 py-3">Statut & Verrou</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">
                      {item.id}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      <p className="text-slate-900 dark:text-white font-semibold">{item.fullName}</p>
                      <p className="text-[10px] text-slate-400">{item.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-mono">{item.cin}</td>
                    <td className="px-4 py-3 text-slate-500">{item.submissionDate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 font-mono font-medium ${
                        item.slaMinutes > 60 ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-600 dark:text-slate-400"
                      }`}>
                        <Clock size={12} />
                        {item.slaMinutes} min
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {item.status === "EN_ATTENTE" && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                            En attente
                          </span>
                        )}
                        {item.status === "EN_COURS" && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold text-[10px] flex items-center gap-1">
                            <Lock size={10} /> En cours ({item.lockedBy || "Agent"})
                          </span>
                        )}
                        {item.status === "VALIDE" && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
                            Validé
                          </span>
                        )}
                        {item.status === "REJETE" && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold text-[10px]">
                            Rejeté
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant={item.status === "VALIDE" ? "outline" : "primary"}
                        onClick={() => handleOpenInspection(item)}
                        className="text-xs"
                      >
                        <Eye size={14} />
                        Inspecter
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredQueue.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400 text-xs">
                      Aucun dossier ne correspond à vos filtres.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Rejection Modal */}
      {rejectModalOpen && selectedKyc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle size={20} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Motif de Rejet KYC ({selectedKyc.id})
              </h3>
            </div>
            <div className="space-y-3">
              <Select
                label="Sélectionnez un motif principal"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                options={[
                  { label: "Pièce illisible / floue", value: "Pièce illisible / floue" },
                  { label: "Incohérence Nom / CIN", value: "Incohérence Nom / CIN" },
                  { label: "Document expiré", value: "Document expiré" },
                  { label: "Justificatif non conforme", value: "Justificatif non conforme" },
                ]}
              />
              <Textarea
                label="Note explicative pour l'agent de support & le client"
                placeholder="Précisez pourquoi la pièce a été refusée..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-rose-600 hover:bg-rose-700 text-white" onClick={handleConfirmReject}>
                Confirmer le Rejet
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {revisionModalOpen && selectedKyc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <RotateCcw size={20} />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Demander une Révision ({selectedKyc.id})
              </h3>
            </div>
            <div className="space-y-3">
              <Textarea
                label="Instructions envoyées au client (SMS / App)"
                placeholder="Veuillez reprendre en photo le recto de votre carte CIN sous un bon éclairage."
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setRevisionModalOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-amber-600 hover:bg-amber-700 text-white" onClick={handleConfirmRevision}>
                Envoyer la Demande
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
