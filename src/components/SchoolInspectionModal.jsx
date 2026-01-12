import React, { useState } from "react";
import { 
  X, Building2, Calendar, CheckCircle, XCircle, Eye, 
  Mail, Phone, MapPin, Globe, Lock, FileText, Download, 
  Ban, Undo2 
} from "lucide-react";

export default function SchoolInspectionModal({ school, onClose, onStatusChange }) {
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'docs'

  // Documents simulés pour l'école
  const documents = [
    { name: "Registre du Commerce", file: "rcs_ecole.pdf", size: "1.2 Mo" },
    { name: "Agrément Ministériel", file: "agrement.pdf", size: "3.5 Mo" },
    { name: "Statuts de l'établissement", file: "statuts.pdf", size: "2.1 Mo" },
    { name: "RIB Bancaire", file: "rib.pdf", size: "500 Ko" },
  ];

  if (!school) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeInUp relative">
        
        {/* HEADER ENCADRÉ (Dégradé Violet) */}
        <div className="bg-gradient-to-r from-[#370669] to-[#5b2299] p-8 relative flex-shrink-0 flex items-center gap-6">
            <button 
                onClick={onClose} 
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-sm"
            >
                <X className="w-5 h-5" />
            </button>
            
            {/* Logo École */}
            <div className="w-24 h-24 rounded-2xl bg-white/20 p-1 backdrop-blur-sm flex-shrink-0 border border-white/30 shadow-lg">
                <img 
                    src={school.logo || "https://via.placeholder.com/150"} 
                    alt={school.nom} 
                    className="w-full h-full object-cover rounded-xl bg-white" 
                />
            </div>

            {/* Infos Textuelles */}
            <div className="text-white">
                <h2 className="text-3xl font-bold leading-tight mb-1">{school.nom}</h2>
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10">
                        <Building2 className="w-4 h-4" /> Établissement d'Enseignement
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Demande du {new Date(school.date_creation).toLocaleDateString()}
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
                         school.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' : 
                         school.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' : 
                         'bg-orange-50 text-orange-700 border-orange-100'
                     }`}>
                        {school.status === 'approved' ? <CheckCircle className="w-3.5 h-3.5"/> : 
                         school.status === 'rejected' ? <XCircle className="w-3.5 h-3.5"/> : 
                         <Eye className="w-3.5 h-3.5"/>}
                        {school.status === "pending" ? "En attente de validation" : school.status === 'approved' ? 'Validé' : 'Refusé'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* COLONNE GAUCHE : INFO & DOCS */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Onglets */}
                    <div className="flex gap-6 border-b border-gray-100">
                        <button onClick={() => setActiveTab("info")} className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'info' ? 'text-[#370669]' : 'text-gray-400 hover:text-gray-600'}`}>
                            Informations Générales
                            {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#370669] rounded-t-full"></span>}
                        </button>
                        <button onClick={() => setActiveTab("docs")} className={`pb-3 text-sm font-bold transition-colors relative ${activeTab === 'docs' ? 'text-[#370669]' : 'text-gray-400 hover:text-gray-600'}`}>
                            Documents Légaux
                            {activeTab === 'docs' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#370669] rounded-t-full"></span>}
                        </button>
                    </div>

                    {activeTab === "info" ? (
                        <div className="space-y-6 animate-fadeIn">
                             <div className="grid grid-cols-2 gap-4">
                                <InfoItem icon={Mail} label="Email Admin" value={school.email} />
                                <InfoItem icon={Phone} label="Standard" value={school.telephone} />
                                <InfoItem icon={MapPin} label="Adresse" value={school.adresse} />
                                <InfoItem icon={Globe} label="Site Web" value={school.site_web} isLink />
                                <InfoItem icon={Lock} label="ID Admin" value={`User #${school.id_utilisateur}`} />
                                <InfoItem icon={Calendar} label="Création" value={new Date(school.date_creation).toLocaleDateString()} />
                             </div>
                             
                             <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <h4 className="text-xs font-bold uppercase text-gray-400 mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Description de l'établissement
                                </h4>
                                <p className="text-sm text-slate-700 leading-relaxed italic">
                                    "{school.description || "Aucune description fournie."}"
                                </p>
                             </div>
                        </div>
                    ) : (
                        <div className="space-y-3 animate-fadeIn">
                            {documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-[#370669]/30 hover:shadow-sm transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 text-gray-500 flex items-center justify-center group-hover:bg-[#370669]/10 group-hover:text-[#370669] transition-colors">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800">{doc.name}</h4>
                                            <p className="text-[10px] text-gray-400 font-medium">PDF • {doc.size}</p>
                                        </div>
                                    </div>
                                    <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 text-xs font-bold text-gray-600 hover:bg-[#370669] hover:text-white transition-colors">
                                        <Download className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Ouvrir</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* COLONNE DROITE : ACTIONS CONTEXTUELLES */}
                <div className="lg:col-span-1">
                    <div className="sticky top-0 space-y-6">
                        
                        {/* 1. CAS : VALIDÉ */}
                        {school.status === 'approved' && (
                            <div className="bg-green-50 rounded-2xl p-6 border border-green-100 animate-fadeIn">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg shadow-sm">
                                        <CheckCircle className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-green-900 text-sm">Établissement Validé</h3>
                                        <p className="text-[10px] text-green-700 font-medium">Accès actif</p>
                                    </div>
                                </div>
                                <p className="text-xs text-green-800 mb-6 leading-relaxed">
                                    L'établissement a accès à son tableau de bord.
                                </p>
                                <button 
                                    onClick={() => onStatusChange(school.id_ecole, 'rejected')}
                                    className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold text-xs hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Ban className="w-3.5 h-3.5" /> Suspendre / Révoquer
                                </button>
                            </div>
                        )}

                        {/* 2. CAS : REFUSÉ */}
                        {school.status === 'rejected' && (
                            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 animate-fadeIn">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg shadow-sm">
                                        <XCircle className="w-5 h-5"/>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-red-900 text-sm">Accès Refusé</h3>
                                        <p className="text-[10px] text-red-700 font-medium">Compte bloqué</p>
                                    </div>
                                </div>
                                <p className="text-xs text-red-800 mb-6 leading-relaxed">
                                    L'établissement ne peut pas se connecter.
                                </p>
                                <button 
                                    onClick={() => onStatusChange(school.id_ecole, 'pending')}
                                    className="w-full bg-white border border-red-200 text-red-600 py-3 rounded-xl font-bold text-xs hover:bg-red-50 transition-colors"
                                >
                                    <Undo2 className="w-3.5 h-3.5 inline mr-1" /> Reconsidérer
                                </button>
                            </div>
                        )}

                        {/* 3. CAS PAR DÉFAUT : EN ATTENTE */}
                        {school.status === 'pending' && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-fadeIn">
                                <h3 className="font-bold text-slate-900 mb-6 text-sm uppercase tracking-wide border-b border-gray-50 pb-3">
                                    Décision Admin
                                </h3>
                                
                                <div className="space-y-3">
                                    <button 
                                        onClick={() => onStatusChange(school.id_ecole, 'approved')}
                                        className="w-full bg-[#370669] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#2a0552] transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#370669]/20"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Valider l'accès
                                    </button>
                                    
                                    <button 
                                        onClick={() => onStatusChange(school.id_ecole, 'rejected')}
                                        className="w-full bg-white border border-gray-200 text-slate-700 py-3.5 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle className="w-4 h-4" /> Refuser
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Contact */}
                        <div className="pt-4">
                            <button className="w-full text-xs font-bold text-gray-400 hover:text-[#370669] flex items-center justify-center gap-2 transition-colors group">
                                <Mail className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Contacter l'admin
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

// Composant interne pour les lignes d'info (isolé pour ce fichier)
const InfoItem = ({ icon: Icon, label, value, isLink }) => (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100 transition-all">
        <Icon className="w-4 h-4 text-gray-400 mt-0.5" />
        <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">{label}</p>
            {isLink ? (
                <a href={`https://${value}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#370669] hover:underline truncate block">{value}</a>
            ) : (
                <p className="text-sm font-bold text-slate-800">{value}</p>
            )}
        </div>
    </div>
);