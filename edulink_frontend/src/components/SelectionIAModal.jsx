import React, { useState, useEffect } from "react";
import { X, Sparkles, BrainCircuit, Check, AlertCircle, Trophy, Users } from "lucide-react";

export default function SelectionIAModal({ isOpen, onClose, candidats, formations, onApplySelection }) {
  const [step, setStep] = useState(1); // 1: Config, 2: Analysis, 3: Result
  const [selectedFormationId, setSelectedFormationId] = useState("");
  const [quota, setQuota] = useState(15);
  const [criteria, setCriteria] = useState({
    notes: true,
    motivation: true,
    experience: false,
    diversity: false
  });

  // --- CORRECTION DU PROBLEME D'INITIALISATION ---
  useEffect(() => {
    if (isOpen && formations && formations.length > 0) {
      // On prend l'ID de la première formation (supporte id_formation OU id)
      const firstId = formations[0].id_formation || formations[0].id;
      setSelectedFormationId(firstId);
    }
  }, [isOpen, formations]);

  if (!isOpen) return null;

  // --- FONCTIONS UTILITAIRES POUR GÉRER LES DONNÉES HYBRIDES ---
  const getFormationId = (f) => f.id_formation || f.id;
  const getFormationTitle = (f) => f.titre || f.title;

  // --- CORRECTION DU CRASH "toString" ---
  const handleLaunchIA = () => {
    setStep(2);
    
    // Simulation du calcul IA
    setTimeout(() => {
      // Récupérer la formation sélectionnée de manière sécurisée
      const currentFormation = formations.find(f => 
        String(getFormationId(f)) === String(selectedFormationId)
      );

      // Filtrer les candidats pour cette formation
      // Note: Assurez-vous que vos candidats ont bien le nom de la formation ou l'ID correspondant
      // Ici on fait une simulation simple sur le tableau actuel
      const relevantCandidats = candidats.filter(c => {
        // Adaptation selon vos données candidats (par nom de formation ou par ID)
        if (!currentFormation) return true;
        return c.formation === getFormationTitle(currentFormation) || c.status === 'En attente';
      });

      // Algorithme factice de scoring
      const scored = relevantCandidats.map(c => ({
        ...c,
        score: Math.floor(Math.random() * 40) + 60, // Score entre 60 et 100
        analysis: "Profil solide, notes excellentes."
      })).sort((a, b) => b.score - a.score);

      onApplySelection(scored, quota);
      setStep(3);
    }, 2500); // 2.5s de "réflexion"
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden relative">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#370669] to-[#5b2299] p-6 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-[#27b6d8] animate-pulse" />
          <h2 className="text-2xl font-bold">Assistant de Sélection IA</h2>
          <p className="text-white/80 text-sm mt-1">Laissez l'intelligence artificielle analyser les dossiers.</p>
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        {/* BODY */}
        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Formation cible</label>
                <div className="relative">
                  <select 
                    value={selectedFormationId} 
                    onChange={(e) => setSelectedFormationId(e.target.value)} 
                    className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#370669]/20 appearance-none"
                  >
                    {formations.map(f => (
                      <option key={getFormationId(f)} value={getFormationId(f)}>
                        {getFormationTitle(f)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex justify-between">
                  <span>Quota d'admission</span>
                  <span className="text-[#370669]">{quota} étudiants</span>
                </label>
                <input 
                  type="range" min="5" max="100" step="5" 
                  value={quota} onChange={(e) => setQuota(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#370669]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-bold"><span>5</span><span>100</span></div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Critères prioritaires</label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(criteria).map(key => (
                    <button 
                      key={key}
                      onClick={() => setCriteria({...criteria, [key]: !criteria[key]})}
                      className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${criteria[key] ? 'bg-[#370669] text-white shadow-lg shadow-[#370669]/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                    >
                      {criteria[key] ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
                      <span className="capitalize">{key}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleLaunchIA} className="w-full py-4 bg-[#27b6d8] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                <BrainCircuit className="w-6 h-6" /> Lancer l'analyse
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-10 space-y-6 animate-fadeIn">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#370669] rounded-full border-t-transparent animate-spin"></div>
                <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-[#370669] animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Analyse en cours...</h3>
                <p className="text-gray-500 text-sm mt-2">L'IA examine les bulletins, lettres de motivation et expériences des candidats.</p>
              </div>
              <div className="flex justify-center gap-2">
                <span className="w-2 h-2 bg-[#370669] rounded-full animate-bounce" style={{animationDelay: '0s'}}></span>
                <span className="w-2 h-2 bg-[#370669] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                <span className="w-2 h-2 bg-[#370669] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-6 animate-fadeIn">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Analyse Terminée !</h3>
                <p className="text-gray-500 text-sm mt-2">Les candidats ont été classés et filtrés selon vos critères.</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-left flex items-center gap-4">
                <div className="p-3 bg-[#370669] text-white rounded-lg"><Users className="w-6 h-6"/></div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Sélection appliquée</div>
                  <div className="text-xs text-gray-500">Les statuts ont été mis à jour dans le tableau.</div>
                </div>
              </div>

              <button onClick={handleClose} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all">
                Voir les résultats
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}