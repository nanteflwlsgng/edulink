import React, { useState } from "react";
import { 
  X, User, Calendar, MapPin, Mail, Phone, GraduationCap, 
  FileText, Download, CheckCircle, Eye, XCircle, Bell, ChevronRight, Hash, ShieldCheck
} from "lucide-react";

// On définit l'URL de base pour les fichiers
const API_BASE_URL = "http://localhost:5000";

export default function CandidatureModal({ isOpen, onClose, candidat, onAction }) {
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'docs'

  if (!isOpen || !candidat) return null;

  // --- 1. GESTION DYNAMIQUE DES DOCUMENTS ---
  // On construit la liste des docs uniquement si les liens existent
  const documents = [];
  
  // Fonction helper pour construire l'URL complète
  const getFileUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${API_BASE_URL}/${path}`;
  };

  if (candidat.cv) {
    documents.push({ 
        name: "Curriculum Vitae", 
        type: "PDF", 
        url: getFileUrl(candidat.cv) 
    });
  }
  
  // Si la lettre de motivation est un fichier (pas du texte), on l'ajoute ici
  // Sinon, elle s'affichera dans l'onglet Info
  const isMotivationFile = candidat.letter && (candidat.letter.endsWith('.pdf') || candidat.letter.endsWith('.docx'));
  if (isMotivationFile) {
    documents.push({ 
        name: "Lettre de Motivation", 
        type: "DOC", 
        url: getFileUrl(candidat.letter) 
    });
  }

  // --- RENDER ---
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeInUp relative">
        
        {/* HEADER ENCADRÉ */}
        <div className="bg-gradient-to-r from-[#370669] to-[#5b2299] p-8 relative flex-shrink-0 flex items-center gap-6">
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
            >
                <X className="w-5 h-5" />
            </button>
            
            {/* Image Profil Dynamique */}
            <div className="w-24 h-24 rounded-2xl bg-white/20 p-1 backdrop-blur-sm flex-shrink-0 border border-white/30 shadow-lg">
                <img 
                    src={candidat.image || "https://via.placeholder.com/150"} 
                    alt={candidat.name} 
                    className="w-full h-full object-cover rounded-xl bg-white" 
                />
            </div>

            {/* Infos Textuelles Dynamiques */}
            <div className="text-white">
                <h2 className="text-3xl font-bold leading-tight mb-1">{candidat.name}</h2>
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                        <GraduationCap className="w-4 h-4" /> {candidat.formation}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Reçu le {new Date(candidat.date).toLocaleDateString('fr-FR')}
                    </span>
                </div>
            </div>
        </div>

        {/* CONTENU */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#fcfcfc]">
            
            {/* Barre de Statut */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">État actuel :</span>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                         candidat.status === 'Admis' ? 'bg-green-50 text-green-700 border-green-100' : 
                         candidat.status === 'Refusé' ? 'bg-red-50 text-red-700 border-red-100' : 
                         candidat.status === 'Inscrit' ? 'bg-[#370669]/10 text-[#370669] border-[#370669]/20' :
                         'bg-blue-50 text-blue-700 border-blue-100'
                     }`}>
                        {candidat.status === 'Admis' ? <CheckCircle className="w-3.5 h-3.5"/> : 
                         candidat.status === 'Refusé' ? <XCircle className="w-3.5 h-3.5"/> : 
                         candidat.status === 'Inscrit' ? <GraduationCap className="w-3.5 h-3.5"/> :
                         <Eye className="w-3.5 h-3.5"/>}
                        {candidat.status === "Vu" ? "En examen" : candidat.status}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLONNE GAUCHE : INFO & DOCS */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Onglets */}
                    <div className="flex gap-6 border-b border-gray-100">
                        <button onClick={() => setActiveTab("info")} className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'info' ? 'text-[#370669]' : 'text-gray-400 hover:text-gray-600'}`}>
                            Informations
                            {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#370669] rounded-t-full"></span>}
                        </button>
                        <button onClick={() => setActiveTab("docs")} className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'docs' ? 'text-[#370669]' : 'text-gray-400 hover:text-gray-600'}`}>
                            Pièces Jointes ({documents.length})
                            {activeTab === 'docs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#370669] rounded-t-full"></span>}
                        </button>
                    </div>

                    {activeTab === "info" ? (
                        <div className="space-y-6 animate-fadeIn">
                             {/* Grille d'infos dynamiques */}
                             <div className="grid grid-cols-2 gap-4">
                                <InfoItem icon={Mail} label="Email" value={candidat.email || "Non renseigné"} />
                                <InfoItem icon={Phone} label="Téléphone" value={candidat.phone || "Non renseigné"} />
                                <InfoItem icon={ShieldCheck} label="N° CIN / ID" value={candidat.cin || "Non renseigné"} />
                                <InfoItem icon={Hash} label="Matricule" value={candidat.matricule || "En attente"} />
                             </div>
                             
                             {/* Lettre de motivation (Si c'est du texte) */}
                             {!isMotivationFile && candidat.letter ? (
                                 <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                                        <FileText className="w-4 h-4" /> Lettre de motivation
                                    </h4>
                                    <p className="text-sm text-slate-700 leading-relaxed italic whitespace-pre-wrap">
                                        "{candidat.letter}"
                                    </p>
                                 </div>
                             ) : (
                                <div className="p-4 rounded-xl border border-dashed border-gray-200 text-center text-xs text-gray-400">
                                    Aucune lettre de motivation textuelle fournie.
                                </div>
                             )}
                        </div>
                    ) : (
                        <div className="space-y-3 animate-fadeIn">
                            {documents.length > 0 ? documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-[#370669]/30 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center group-hover:bg-[#370669]/10 group-hover:text-[#370669] transition-colors">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800">{doc.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-medium">{doc.type}</p>
                                        </div>
                                    </div>
                                    <a 
                                        href={doc.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-bold text-gray-600 hover:bg-[#370669] hover:text-white transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ouvrir</span>
                                    </a>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-gray-400">
                                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">Aucun document joint.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* COLONNE DROITE : ACTIONS CONTEXTUELLES */}
                <div className="lg:col-span-1">
                    <div className="sticky top-0 space-y-6">
                        
                        {/* 1. CAS : DÉJÀ ADMIS */}
                        {candidat.status === 'Admis' && (
                            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 animate-fadeIn">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg shadow-sm">
                                        <CheckCircle className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-green-900 text-sm">Dossier Validé</h3>
                                        <p className="text-[10px] text-green-700 font-medium">En attente de paiement</p>
                                    </div>
                                </div>
                                <p className="text-xs text-green-800 mb-6 leading-relaxed">
                                    L'étudiant a été notifié. Il doit maintenant régler les droits d'inscription.
                                </p>
                                <button 
                                    onClick={() => onAction(candidat.id, 'Notifier')}
                                    className="w-full bg-green-600 text-white py-3 rounded-xl font-bold text-xs hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-600/20"
                                >
                                    <Bell className="w-3.5 h-3.5" /> Envoyer un rappel
                                </button>
                            </div>
                        )}

                        {/* 2. CAS : REFUSÉ */}
                        {candidat.status === 'Refusé' && (
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 animate-fadeIn">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg shadow-sm">
                                        <XCircle className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-red-900 text-sm">Candidature Refusée</h3>
                                        <p className="text-[10px] text-red-700 font-medium">Dossier archivé</p>
                                    </div>
                                </div>
                                <p className="text-xs text-red-800 mb-6 leading-relaxed">
                                    La décision a été transmise.
                                </p>
                                <button 
                                    onClick={() => onAction(candidat.id, 'En attente')}
                                    className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold text-xs hover:bg-red-50 transition-colors"
                                >
                                    Reconsidérer le dossier
                                </button>
                            </div>
                        )}

                        {/* 3. CAS : INSCRIT */}
                        {candidat.status === 'Inscrit' && (
                            <div className="bg-[#370669]/5 rounded-2xl p-6 border border-[#370669]/10 animate-fadeIn">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-[#370669] text-white rounded-lg shadow-sm">
                                        <GraduationCap className="w-5 h-5"/>
                                    </div>
                                    <h3 className="font-bold text-[#370669] text-sm">Étudiant Inscrit</h3>
                                </div>
                                <p className="text-xs text-slate-600 mb-4">
                                    L'étudiant fait partie de l'effectif. Retrouvez son dossier dans l'onglet "Étudiants".
                                </p>
                            </div>
                        )}

                        {/* 4. CAS PAR DÉFAUT : À TRAITER */}
                        {['En attente', 'Vu'].includes(candidat.status) && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-fadeIn">
                                <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wide border-b border-gray-50 pb-3">
                                    Décision du Jury
                                </h3>
                                
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => onAction(candidat.id, 'Admis')}
                                        className="w-full bg-[#370669] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#2a0552] transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#370669]/20"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Accepter le dossier
                                    </button>
                                    
                                    <button 
                                        onClick={() => onAction(candidat.id, 'Refusé')}
                                        className="w-full bg-white border border-gray-200 text-slate-700 py-3.5 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> Refuser
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Contact */}
                        <div className="pt-4">
                            <a href={`mailto:${candidat.email}`} className="w-full text-xs font-bold text-gray-400 hover:text-[#370669] flex items-center justify-center gap-2 transition-colors group">
                                <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Envoyer un email
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
        <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
        <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">{label}</p>
            <p className="text-sm font-bold text-slate-800 break-all">{value}</p>
        </div>
    </div>
);