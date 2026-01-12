import React, { useState, useEffect } from "react";
import { X, Sparkles, Trophy, Users, AlertCircle, BrainCircuit, FileText, CheckCircle2, ScanLine } from "lucide-react";

export default function SelectionIAModal({ isOpen, onClose, candidats, formations, onApplySelection }) {
  // Sélection par défaut
  const [selectedFormationId, setSelectedFormationId] = useState(formations[0]?.id || "");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(""); // Pour afficher ce que l'IA fait
  const [results, setResults] = useState(null);

  // Récupérer les infos de la formation sélectionnée (dont le quota)
  const currentFormation = formations.find(f => f.id.toString() === selectedFormationId.toString()) || formations[0];
  // On simule un quota si non présent dans les props (par défaut 10)
  const quota = currentFormation?.studentsMax || 10; 

  // Reset quand on ferme/ouvre
  useEffect(() => {
    if (isOpen) {
        setResults(null); 
        setIsAnalyzing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // --- MOTEUR IA SIMULÉ ---
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setResults(null);

    const steps = [
        "Connexion à la base de données...",
        "Récupération des dossiers candidats...",
        "Analyse OCR des relevés de notes...",
        "Lecture sémantique des lettres de motivation...",
        "Vérification des mentions diplômes...",
        "Calcul du Scoring Global..."
    ];

    let currentStep = 0;

    // Simulation de l'affichage des étapes
    const interval = setInterval(() => {
        setAnalysisStep(steps[currentStep]);
        currentStep++;
        if (currentStep >= steps.length) {
            clearInterval(interval);
            finalizeAnalysis();
        }
    }, 800); // 800ms par étape
  };

  const finalizeAnalysis = () => {
    // 1. Filtrer les candidats concernés (et qui ne sont pas déjà inscrits/refusés définitivement)
    // On ne garde que ceux "En attente", "Vu", ou "Admis" (pour recalculer le rang)
    const pool = candidats.filter(c => 
        c.formation === currentFormation.title && 
        ['En attente', 'Vu', 'Admis'].includes(c.status)
    );

    // 2. Générer Score & Rang
    const ranked = pool.map(c => ({
        ...c,
        score: Math.floor(Math.random() * (99 - 65) + 65), // Score entre 65 et 99
        academicNote: Math.floor(Math.random() * (20 - 12) + 12), // Note /20
        motivationScore: Math.floor(Math.random() * 100)
    })).sort((a, b) => b.score - a.score);

    setResults(ranked);
    setIsAnalyzing(false);
  };

  const handleApply = () => {
    // On renvoie la liste classée au parent pour mise à jour
    // Les N premiers (quota) deviennent 'Admis', les autres 'Liste d'attente' (simulé par un statut custom ou 'Refusé' selon votre logique)
    onApplySelection(results, quota);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0f172a]/90 backdrop-blur-xl animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* HEADER */}
        <div className="bg-white px-8 py-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-[#370669] to-[#5b2299] rounded-2xl shadow-lg text-white">
                    <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">IA Selection Engine™</h2>
                    <p className="text-xs text-gray-500">Analyse cognitive des dossiers de candidature</p>
                </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-50 rounded-full transition-colors"><X className="w-6 h-6 text-gray-400"/></button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden relative">
            
            {/* VIEW 1: CONFIGURATION (Si pas de résultats) */}
            {!results && !isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center animate-fadeIn bg-slate-50/50">
                    <div className="max-w-md w-full space-y-8">
                        <div className="text-left space-y-3">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Formation cible</label>
                            <select 
                                value={selectedFormationId} 
                                onChange={(e) => setSelectedFormationId(e.target.value)}
                                className="w-full p-5 rounded-2xl border border-gray-200 bg-white font-bold text-lg text-slate-800 focus:ring-2 focus:ring-[#370669]/20 outline-none shadow-sm"
                            >
                                {formations.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                            </select>
                        </div>

                        <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl text-left">
                            <div className="p-2 bg-white rounded-lg h-fit text-blue-600"><Users className="w-5 h-5"/></div>
                            <div>
                                <p className="text-sm font-bold text-blue-900">Quota détecté : {quota} places</p>
                                <p className="text-xs text-blue-700 mt-1">L'IA sélectionnera les {quota} meilleurs profils. Les autres seront placés en liste d'attente.</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleAnalyze}
                            className="w-full py-5 rounded-2xl bg-[#370669] text-white font-bold text-lg shadow-xl shadow-[#370669]/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                        >
                            <Sparkles className="w-5 h-5" /> Lancer l'analyse des dossiers
                        </button>
                    </div>
                </div>
            )}

            {/* VIEW 2: ANALYSE (Loading) */}
            {isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center p-12 animate-fadeIn relative">
                    {/* Visualisation Scanner */}
                    <div className="relative w-32 h-32 mb-8">
                        <div className="absolute inset-0 bg-[#370669]/10 rounded-full animate-ping"></div>
                        <div className="relative z-10 w-full h-full bg-white rounded-full border-4 border-[#370669] flex items-center justify-center">
                            <ScanLine className="w-12 h-12 text-[#370669] animate-pulse" />
                        </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{analysisStep}</h3>
                    <p className="text-gray-400 text-sm">Ne fermez pas la fenêtre...</p>

                    {/* Fichiers volants (Animation CSS simulée) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
                        <FileText className="absolute top-1/4 left-1/4 w-8 h-8 text-gray-400 animate-bounce" style={{animationDuration: '3s'}} />
                        <FileText className="absolute bottom-1/3 right-1/4 w-6 h-6 text-gray-300 animate-bounce" style={{animationDuration: '2s'}} />
                        <FileText className="absolute top-1/2 left-2/3 w-10 h-10 text-gray-500 animate-bounce" style={{animationDuration: '4s'}} />
                    </div>
                </div>
            )}

            {/* VIEW 3: RÉSULTATS */}
            {results && (
                <div className="h-full flex flex-col animate-fadeInUp">
                    {/* Header Résultats */}
                    <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100 shadow-sm z-10">
                        <div className="flex gap-8">
                            <div className="text-center">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase">Candidats analysés</span>
                                <span className="text-xl font-bold text-slate-900">{results.length}</span>
                            </div>
                            <div className="text-center">
                                <span className="block text-[10px] font-bold text-gray-400 uppercase">Places Dispo</span>
                                <span className="text-xl font-bold text-[#18B49C]">{quota}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setResults(null)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50">Relancer</button>
                            <button onClick={handleApply} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#370669] text-white hover:bg-[#2a0552] shadow-lg shadow-[#370669]/20 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Appliquer la sélection
                            </button>
                        </div>
                    </div>

                    {/* Liste Classée */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-slate-50/50">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-400 uppercase tracking-wider">
                                    <th className="pb-4 pl-4 font-bold">Rang</th>
                                    <th className="pb-4 font-bold">Candidat</th>
                                    <th className="pb-4 font-bold text-center">Score IA</th>
                                    <th className="pb-4 font-bold text-center">Statut Projeté</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {results.map((c, index) => {
                                    const isQualified = index < quota;
                                    return (
                                        <tr key={c.id} className={`group bg-white hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 ${isQualified ? '' : 'opacity-60 grayscale-[0.5]'}`}>
                                            <td className="py-4 pl-4 w-20">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                                                    index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                                    index === 1 ? 'bg-gray-200 text-gray-700' : 
                                                    index === 2 ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-4">
                                                    <img src={c.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                                    <div>
                                                        <p className="font-bold text-slate-900">{c.name}</p>
                                                        <p className="text-xs text-gray-500">{c.formation}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 w-48">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex justify-between text-xs font-bold">
                                                        <span className={isQualified ? "text-[#18B49C]" : "text-orange-500"}>{c.score}/100</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div style={{width: `${c.score}%`}} className={`h-full rounded-full transition-all duration-1000 ${isQualified ? 'bg-[#18B49C]' : 'bg-orange-400'}`}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 text-center">
                                                {isQualified ? (
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                                                        <Trophy className="w-3 h-3" /> Admissible
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                                                        <AlertCircle className="w-3 h-3" /> Liste d'attente
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}