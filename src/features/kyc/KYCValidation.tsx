import { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Lock,
  Search,
  ArrowLeft,
  ChevronRight,
  Clock,
  FileText,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import type { KYCDossier, KYCDocument } from "../../types/rbac";
import { useAuth } from "../../context/AuthContext";

const mockKYCDossiers: KYCDossier[] = [
  {
    id: "DOS-8821",
    clientName: "Jean-Luc Raharison",
    cin: "101 234 567 890",
    phone: "+261 34 12 345 67",
    birthDate: "14/05/1992",
    address: "Lot II M 42 Antananarivo 101",
    submittedAt: "10/05/2025 09:15",
    slaWaitTime: "14 min",
    status: "IN_REVIEW",
    lockedBy: { id: "AGT-1024", name: "Marc Randria (Vous)" },
    eligibilityScore: 94,
    autoStatus: "ELIGIBLE",
    documents: [
      { id: "doc-1", type: "CIN_RECTO", label: "CIN Recto", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" },
      { id: "doc-2", type: "CIN_VERSO", label: "CIN Verso", url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=800" },
      { id: "doc-3", type: "SELFIE", label: "Photo d'identité / Selfie", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" },
      { id: "doc-4", type: "JUSTIFICATIF_DOMICILE", label: "Justificatif de domicile (JIRAMA)", url: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800" },
    ],
  },
  {
    id: "DOS-8822",
    clientName: "Fitiavana Rasoanaivo",
    cin: "201 987 654 321",
    phone: "+261 32 88 123 45",
    birthDate: "22/11/1998",
    address: "Presqu'île d'Ivato, Lot B12",
    submittedAt: "10/05/2025 09:40",
    slaWaitTime: "42 min",
    status: "PENDING",
    eligibilityScore: 68,
    autoStatus: "MANUAL_CHECK",
    documents: [
      { id: "doc-5", type: "CIN_RECTO", label: "CIN Recto", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800" },
      { id: "doc-6", type: "SELFIE", label: "Selfie", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800" },
    ],
  },
  {
    id: "DOS-8823",
    clientName: "Andry Rakotomalala",
    cin: "301 456 789 012",
    phone: "+261 33 05 999 11",
    birthDate: "03/01/1985",
    address: "Ankorondrano, Rue de la Paix",
    submittedAt: "10/05/2025 10:02",
    slaWaitTime: "05 min",
    status: "APPROVED",
    alias: "CLI-ANDRY-991",
    lockedBy: undefined,
    eligibilityScore: 98,
    autoStatus: "ELIGIBLE",
    documents: [],
  },
  {
    id: "DOS-8824",
    clientName: "Haingo Razafindrakoto",
    cin: "102 555 444 333",
    phone: "+261 34 00 112 23",
    birthDate: "18/08/2001",
    address: "Ampandrianomby, Villa 4",
    submittedAt: "10/05/2025 10:15",
    slaWaitTime: "02 min",
    status: "REJECTED",
    rejectionReason: "Incohérence Nom/CIN",
    rejectionNote: "Le prénom sur la CIN ne correspond pas au prénom du formulaire.",
    lockedBy: undefined,
    eligibilityScore: 42,
    autoStatus: "RISK_MEDIUM",
    documents: [],
  },
];

export default function KYCValidation() {
  const { user, logAction } = useAuth();
  const [dossiers, setDossiers] = useState<KYCDossier[]>(mockKYCDossiers);
  const [selectedDossier, setSelectedDossier] = useState<KYCDossier | null>(null);

  // Document viewer state
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [contrast, setContrast] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Action modals
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("Pièce illisible");
  const [rejectNote, setRejectNote] = useState("");
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  // Keybindings listener: Alt+A (Validate), Alt+R (Reject), Esc (Back)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        if (selectedDossier && selectedDossier.status !== "APPROVED") {
          handleApproveDossier();
        }
      } else if (e.altKey && (e.key === "r" || e.key === "R")) {
        e.preventDefault();
        if (selectedDossier && selectedDossier.status !== "APPROVED") {
          setRejectModalOpen(true);
        }
      } else if (e.key === "Escape") {
        if (rejectModalOpen) setRejectModalOpen(false);
        else if (revisionModalOpen) setRevisionModalOpen(false);
        else if (selectedDossier) setSelectedDossier(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDossier, rejectModalOpen, revisionModalOpen]);

  // Open dossier split-view and lock
  const handleOpenDossier = (dossier: KYCDossier) => {
    // Apply soft lock
    const updated = dossiers.map((d) =>
      d.id === dossier.id
        ? {
            ...d,
            status: d.status === "PENDING" ? ("IN_REVIEW" as const) : d.status,
            lockedBy: { id: user.id, name: user.name },
          }
        : d
    );
    setDossiers(updated);
    setSelectedDossier(updated.find((d) => d.id === dossier.id) || dossier);
    setActiveDocIndex(0);
    setZoomLevel(1);
    setRotation(0);
    setContrast(100);
    logAction("KYC_LOCK", `Verrouillage du dossier ${dossier.id} (${dossier.clientName}) par l'agent.`);
  };

  const handleApproveDossier = () => {
    if (!selectedDossier) return;
    const generatedAlias = `CLI-${selectedDossier.clientName.split(" ")[0]!.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const updated = dossiers.map((d) =>
      d.id === selectedDossier.id
        ? {
            ...d,
            status: "APPROVED" as const,
            alias: generatedAlias,
            lockedBy: undefined,
          }
        : d
    );
    setDossiers(updated);
    logAction("KYC_VALIDATE", `Validation du dossier ${selectedDossier.id} - ALIAS généré : ${generatedAlias}`);
    setSelectedDossier(null);
  };

  const handleConfirmReject = () => {
    if (!selectedDossier) return;
    const updated = dossiers.map((d) =>
      d.id === selectedDossier.id
        ? {
            ...d,
            status: "REJECTED" as const,
            rejectionReason: rejectReason,
            rejectionNote: rejectNote,
            lockedBy: undefined,
          }
        : d
    );
    setDossiers(updated);
    logAction("KYC_REJECT", `Rejet du dossier ${selectedDossier.id} - Motif : ${rejectReason}`);
    setRejectModalOpen(false);
    setSelectedDossier(null);
  };

  const handleConfirmRevision = () => {
    if (!selectedDossier) return;
    const updated = dossiers.map((d) =>
      d.id === selectedDossier.id
        ? {
            ...d,
            status: "NEEDS_REVISION" as const,
            rejectionNote: revisionNote,
            lockedBy: undefined,
          }
        : d
    );
    setDossiers(updated);
    logAction("KYC_REVISION", `Demande de complément transmise pour le dossier ${selectedDossier.id}`);
    setRevisionModalOpen(false);
    setSelectedDossier(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Validation & Queue KYC
            </h2>
            <span className="rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs px-2.5 py-0.5 font-semibold">
              Module A
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Traitement des souscriptions et validation des pièces d'état civil avec verrouillage temporaire (Soft Lock).
          </p>
        </div>
        {selectedDossier && (
          <button
            onClick={() => setSelectedDossier(null)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition"
          >
            <ArrowLeft size={15} />
            Retour à la file d'attente (Esc)
          </button>
        )}
      </div>

      {!selectedDossier ? (
        /* VUE 1 : QUEUE DE TRAVAIL (Tableau dynamique avec soft lock) */
        <div className="ui-panel p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher CIN, Nom, N° Téléphone..."
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock size={15} className="text-amber-500" />
              <span>SLA Moyen de traitement : <strong className="text-slate-800 dark:text-slate-200">12 min 30s</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/80 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">ID Dossier</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Date Soumission</th>
                  <th className="px-4 py-3">Attente SLA</th>
                  <th className="px-4 py-3">Score AI</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 dark:divide-slate-800">
                {dossiers.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => handleOpenDossier(d)}
                  >
                    <td className="px-4 py-3.5 font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {d.id}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {d.clientName}
                      </div>
                      <div className="text-xs text-slate-500">CIN: {d.cin}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                      {d.submittedAt}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs">
                        <Clock size={12} className="text-amber-500" />
                        {d.slaWaitTime}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-xs ${
                          d.eligibilityScore >= 80
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        <Sparkles size={13} />
                        {d.eligibilityScore}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      {d.status === "PENDING" && (
                        <span className="ui-status-pending inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                          En attente
                        </span>
                      )}
                      {d.status === "IN_REVIEW" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 px-2.5 py-0.5 text-xs font-semibold">
                          <Lock size={12} />
                          En cours ({d.lockedBy?.name ?? "Agent"})
                        </span>
                      )}
                      {d.status === "APPROVED" && (
                        <span className="ui-status-success inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                          Validé ({d.alias})
                        </span>
                      )}
                      {d.status === "REJECTED" && (
                        <span className="ui-status-danger inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                          Rejeté
                        </span>
                      )}
                      {d.status === "NEEDS_REVISION" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300 px-2.5 py-0.5 text-xs font-semibold">
                          Révision demandée
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDossier(d);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        <span>Inspecter</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VUE 2 : ÉCRAN DE VALIDATION SPLIT-VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* PANNEAU GAUCHE : Formulaire d'inspection état civil & scores */}
          <div className="lg:col-span-5 space-y-5">
            <div className="ui-panel p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 font-mono">
                    {selectedDossier.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {selectedDossier.clientName}
                  </h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Score Auto</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedDossier.eligibilityScore}% Éligible
                  </span>
                </div>
              </div>

              {/* Statut de verrou (Soft Lock indicator) */}
              <div className="rounded-lg bg-slate-100 dark:bg-slate-800/80 p-2.5 text-xs flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Lock size={14} className="text-blue-600" />
                  Verrouillé par : <strong>{selectedDossier.lockedBy?.name || user.name}</strong>
                </span>
                <span className="text-[11px] text-slate-400">Pessimistic Soft-Lock Active</span>
              </div>

              {/* Formulaire Données Saisies Client */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Données d'État Civil
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Nom & Prénom</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedDossier.clientName}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Numéro CIN</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedDossier.cin}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold font-mono text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Date de Naissance</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedDossier.birthDate}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">N° Téléphone</label>
                    <input
                      type="text"
                      readOnly
                      value={selectedDossier.phone}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold font-mono text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-500">Adresse de Résidence</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedDossier.address}
                    className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Zone d'Actions Rapides */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Décision d'Inspection
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handleApproveDossier}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-semibold shadow-xs transition"
                    title="Alt + A"
                  >
                    <CheckCircle2 size={16} />
                    Valider (Alt+A)
                  </button>

                  <button
                    onClick={() => setRejectModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-3 py-2 text-xs font-semibold shadow-xs transition"
                    title="Alt + R"
                  >
                    <XCircle size={16} />
                    Rejeter (Alt+R)
                  </button>

                  <button
                    onClick={() => setRevisionModalOpen(true)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-2 text-xs font-semibold transition"
                  >
                    <RefreshCw size={14} />
                    Révision
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PANNEAU DROIT : Visionneuse de Documents avec Zoom, Rotation, Contraste */}
          <div className="lg:col-span-7 ui-panel p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Visionneuse de Documents
                </h3>
              </div>

              {/* Document Selector Tabs */}
              <div className="flex gap-1 overflow-x-auto">
                {selectedDossier.documents.map((doc: KYCDocument, idx: number) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setActiveDocIndex(idx);
                      setZoomLevel(1);
                      setRotation(0);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      activeDocIndex === idx
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {doc.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Viewer Toolbar */}
            {selectedDossier.documents.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-100 dark:bg-slate-800 p-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {selectedDossier.documents[activeDocIndex]?.label}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                      className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      title="Zoom Arrière"
                    >
                      <ZoomOut size={16} />
                    </button>
                    <span className="text-xs font-mono font-bold w-12 text-center text-slate-600 dark:text-slate-300">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                      className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      title="Zoom Avant"
                    >
                      <ZoomIn size={16} />
                    </button>

                    <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1" />

                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      title="Rotation 90°"
                    >
                      <RotateCw size={16} />
                    </button>

                    <button
                      onClick={() => setContrast((c) => (c === 100 ? 150 : c === 150 ? 200 : 100))}
                      className="px-2 py-1 rounded text-xs font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300"
                      title="Ajuster le contraste"
                    >
                      Contraste: {contrast}%
                    </button>

                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="p-1.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      title="Plein Écran"
                    >
                      <Maximize2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Document Display Canvas */}
                <div
                  className={`relative flex items-center justify-center rounded-xl bg-slate-950 overflow-hidden min-h-[380px] border border-slate-800 ${
                    isFullscreen ? "fixed inset-0 z-50 rounded-none bg-black p-10" : ""
                  }`}
                >
                  {isFullscreen && (
                    <button
                      onClick={() => setIsFullscreen(false)}
                      className="absolute top-4 right-4 z-50 rounded-lg bg-white/20 text-white p-2 hover:bg-white/40"
                    >
                      Fermer Plein Écran
                    </button>
                  )}
                  <img
                    src={selectedDossier.documents[activeDocIndex]?.url}
                    alt="Document client"
                    className="max-h-[420px] object-contain transition-transform duration-200"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      filter: `contrast(${contrast}%)`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                Aucun document téléversé pour ce dossier.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALE DE REJET */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md ui-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-rose-600 flex items-center gap-2">
                <AlertTriangle size={18} />
                Motif de Rejet du Dossier
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Motif Principal</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs font-medium"
                >
                  <option value="Pièce illisible">Pièce illisible ou floue</option>
                  <option value="Incohérence Nom/CIN">Incohérence Nom / Prénom / CIN</option>
                  <option value="Document expiré">Document d'identité expiré</option>
                  <option value="Selfie non conforme">Selfie / Photo non conforme</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Note Explicative Obligatoire</label>
                <textarea
                  rows={3}
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Préciser l'erreur constatée pour l'historique d'audit..."
                  className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                Confirmer le Rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE DEMANDE DE RÉVISION */}
      {revisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md ui-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw size={18} className="text-blue-600" />
                Demande de Révision / Complément
              </h3>
              <button
                onClick={() => setRevisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Instruction au client (SMS/Email)</label>
              <textarea
                rows={3}
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="Ex: Merci de renvoyer le verso de votre CIN avec une meilleure netteté."
                className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRevisionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmRevision}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Envoyer la Demande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
