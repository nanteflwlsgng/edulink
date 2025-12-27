import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate est bien importé
import StudentNavbar from "../components/StudentNavbar";
import { useAuth } from "../context/AuthContext";
import { 
  FileText, Heart, Send, Bell, Search, 
  MapPin, ChevronRight, AlertCircle, CheckCircle2,
  X, Clock, CreditCard, Upload, GraduationCap, ArrowRight, XCircle
} from "lucide-react";

// --- DONNÉES SIMULÉES ---
const applicationsData = [
  { id: 1, school: "HETIC", program: "Mastère Big Data", status: "sent", date: "Il y a 2j", step: 1 },
  { id: 2, school: "ESG Luxe", program: "Bachelor Marketing", status: "viewed", date: "Il y a 1 sem", step: 2 },
  { id: 3, school: "Sorbonne", program: "Licence Droit", status: "accepted", date: "Il y a 1 mois", price: "4 500 000 Ar" },
  { id: 4, school: "Epitech", program: "Coding Academy", status: "rejected", date: "Il y a 3 jours" },
];

const favoritesData = [
  { id: 101, title: "Ingénieur Logiciel", school: "Polytech" },
  { id: 102, title: "MBA Finance", school: "HEC Paris" },
];

// --- COMPOSANT PRINCIPAL ---
export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedApp, setSelectedApp] = useState(null); // État pour le modal

  // Gestion de l'ouverture du modal
  const openModal = (app) => {
    setSelectedApp(app);
    // Empêcher le scroll en arrière-plan
    document.body.style.overflow = 'hidden';
  };

  // Gestion de la fermeture
  const closeModal = () => {
    setSelectedApp(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="min-h-screen font-poppins selection:bg-[#18B49C] selection:text-white bg-[#fafafa]">
      <StudentNavbar className="-z-10" />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
              Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">{user?.firstName || "Étudiant"}</span>.
            </h1>
            <p className="text-gray-500 text-base md:text-lg">Suivez vos démarches en temps réel.</p>
          </div>
          
          <Link to="/formations" className="group bg-[#370669] text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-[#370669]/20 hover:scale-105 transition-all flex items-center gap-3">
             <Search className="w-5 h-5" />
             <span>Explorer les formations</span>
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Send />} label="Candidatures" value={applicationsData.length} subtext="Total envoyé" color="#370669" />
          <StatCard icon={<Heart />} label="Favoris" value={favoritesData.length} subtext="Formations suivies" color="#ec4899" />
          <StatCard icon={<FileText />} label="Dossier" value="85%" subtext="Documents manquants" color="#f59e0b" isWarning />
          <StatCard icon={<Bell />} label="Alertes" value="2" subtext="Non lues" color="#27b6d8" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* GAUCHE : LISTE CANDIDATURES */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#18B49C]" /> Suivi des candidatures
                </h2>
              </div>

              <div className="space-y-3">
                {applicationsData.map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => openModal(app)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-[#370669]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    {/* Indicateur visuel à gauche */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor(app.status)} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom`}></div>

                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm border border-gray-50 font-bold text-[#370669] group-hover:bg-[#370669] group-hover:text-white transition-colors duration-300">
                            {app.school.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm">{app.program}</h3>
                            <p className="text-xs text-gray-500 font-medium">{app.school} • <span className="text-gray-400">{app.date}</span></p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <StatusBadge status={app.status} />
                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#370669] transform group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DROITE : PROFIL */}
          <div className="flex flex-col gap-6">
            <div className="relative bg-[#370669] text-white rounded-[2rem] p-8 overflow-hidden text-center shadow-xl shadow-[#370669]/20">
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold mb-4 backdrop-blur-md border border-white/20 shadow-xl">
                        {user?.firstName?.charAt(0) || "U"}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-white/60 text-sm mb-6 flex items-center gap-2 justify-center">
                        <MapPin size={12} /> {user?.city || "Antananarivo"}
                    </p>
                    <button className="w-full py-3 rounded-xl bg-white text-[#370669] hover:bg-gray-100 transition-colors text-xs font-bold uppercase tracking-wider">
                        Modifier mon profil
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODAL INTELLIGENT --- */}
      {selectedApp && (
        <ApplicationModal application={selectedApp} onClose={closeModal} />
      )}
    </div>
  );
}

// --- SOUS-COMPOSANT : MODAL ---
function ApplicationModal({ application, onClose }) {
    const handleContentClick = (e) => e.stopPropagation();

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-scaleIn max-h-[90vh] overflow-y-auto"
                onClick={handleContentClick}
            >
                {/* Header du Modal */}
                <div className="flex justify-between items-start p-8 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl font-bold text-[#370669]">
                            {application.school.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{application.program}</h2>
                            <p className="text-gray-500 font-medium">{application.school}</p>
                            <p className="text-xs text-gray-400 mt-1">Candidature envoyée le {application.date}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Corps du Modal */}
                <div className="p-8">
                    {/* ICI : J'ai ajouté onClose={onClose} pour le passer à l'enfant */}
                    {application.status === 'accepted' && <AcceptedContent app={application} onClose={onClose} />}
                    {['sent', 'viewed'].includes(application.status) && <PendingContent app={application} />}
                    {application.status === 'rejected' && <RejectedContent app={application} />}
                </div>
            </div>
        </div>
    );
}

// --- CONTENU ADMISSIBLE (LE PLUS COMPLEXE) ---
function AcceptedContent({ app, onClose }) { // Ajout de la prop onClose
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Info, 2: Paiement

    // Nouvelle fonction pour gérer la fermeture + navigation
    const handleGoToPayment = () => {
        onClose(); // Ferme le modal
        navigate(`/paiement/${app.id}`); // Redirige
    };

    return (
        <div className="animate-fadeIn">
            {/* Bannière de félicitations */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-[50px] opacity-30 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-1">Félicitations ! Vous êtes admissible.</h3>
                    <p className="text-sm text-green-700 max-w-md mx-auto">
                        Votre profil a retenu toute l'attention du jury. Finalisez votre inscription avant le <span className="font-bold">25 Septembre</span> pour garantir votre place.
                    </p>
                </div>
            </div>

            {/* Stepper visuel */}
            <div className="flex items-center mb-8 px-4">
                <div className={`flex-1 h-2 rounded-l-full ${step >= 1 ? 'bg-[#18B49C]' : 'bg-gray-100'}`}></div>
                <div className={`flex-1 h-2 rounded-r-full ${step === 2 ? 'bg-[#18B49C]' : 'bg-gray-100'}`}></div>
            </div>

            {step === 1 ? (
                // ÉTAPE 1 : RÉCAPITULATIF & DOSSIERS
                <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#370669]" /> Pièces manquantes pour l'inscription
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs font-bold text-slate-700">Photo d'identité</span>
                            <span className="text-[10px] text-gray-400">JPG, PNG</span>
                        </div>
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer transition-colors">
                            <Upload className="w-6 h-6 text-gray-400 mb-2" />
                            <span className="text-xs font-bold text-slate-700">Attestation du BAC</span>
                            <span className="text-[10px] text-gray-400">PDF Original</span>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={() => setStep(2)}
                            className="bg-[#370669] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#2b0554] transition-all flex items-center gap-2 shadow-lg shadow-[#370669]/20"
                        >
                            Suivant : Paiement <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                // ÉTAPE 2 : PAIEMENT
                <div className="space-y-6 animate-fadeIn">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-[#370669]" /> Frais de scolarité
                    </h4>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-500">Montant annuel</span>
                            <span className="font-bold text-lg text-slate-900">{app.price}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <span className="text-sm font-bold text-[#370669]">Acompte requis (20%)</span>
                            <span className="font-bold text-xl text-[#18B49C]">900 000 Ar</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleGoToPayment} // Utilisation du handler
                            className="w-full bg-[#18B49C] text-white py-4 rounded-xl font-bold hover:bg-[#149984] transition-colors flex items-center justify-center gap-2 shadow-xl shadow-[#18B49C]/20"
                        >
                            <CreditCard className="w-4 h-4" /> Accéder au paiement sécurisé
                        </button>
                        <button 
                            onClick={() => setStep(1)}
                            className="text-gray-400 text-xs font-bold hover:text-gray-600 py-2"
                        >
                            Retour aux documents
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- CONTENU EN ATTENTE ---
function PendingContent({ app }) {
    const steps = [
        { label: "Candidature envoyée", active: true, date: app.date },
        { label: "Réception par l'école", active: app.status === 'viewed', date: app.status === 'viewed' ? "Hier" : "En attente" },
        { label: "Décision du jury", active: false, date: "Estimé: 25 Sept." },
    ];

    return (
        <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-50 text-blue-600 mb-6">
                <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Dossier en cours d'examen</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-10">
                L'équipe pédagogique étudie actuellement votre dossier. Vous recevrez une notification dès que le statut changera.
            </p>

            {/* Timeline Verticale */}
            <div className="max-w-xs mx-auto text-left space-y-6 relative pl-2">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                {steps.map((s, i) => (
                    <div key={i} className="relative flex items-center gap-4 z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${s.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {s.active ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div>
                            <p className={`text-sm font-bold ${s.active ? 'text-slate-900' : 'text-gray-400'}`}>{s.label}</p>
                            <p className="text-xs text-gray-400">{s.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- CONTENU REFUSÉ ---
function RejectedContent({ app }) {
    return (
        <div className="text-center">
             <div className="inline-flex p-4 rounded-full bg-red-50 text-red-500 mb-6">
                <XCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Candidature non retenue</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 bg-gray-50 p-4 rounded-xl text-left">
                "Malgré la qualité de votre profil, nous ne pouvons donner suite à votre demande pour cette session en raison du nombre limité de places."
            </p>
            
            <div className="border-t border-gray-100 pt-6">
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Ne vous découragez pas</p>
                <Link to="/formations" className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                    Voir d'autres formations similaires
                </Link>
            </div>
        </div>
    );
}

// --- UTILS (BADGES & COULEURS) ---

function StatusBadge({ status }) {
    const config = {
        sent: { color: "bg-blue-50 text-blue-600 border-blue-100", label: "Envoyée", icon: Send },
        viewed: { color: "bg-orange-50 text-orange-600 border-orange-100", label: "Vue", icon: CheckCircle2 },
        accepted: { color: "bg-green-50 text-green-600 border-green-100", label: "Admissible", icon: GraduationCap },
        rejected: { color: "bg-red-50 text-red-600 border-red-100", label: "Refusée", icon: AlertCircle },
    };
    const current = config[status] || config.sent;
    const Icon = current.icon;
    return (
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${current.color}`}>
            <Icon size={12} /> {current.label}
        </span>
    );
}

function getStatusColor(status) {
    switch (status) {
        case 'accepted': return 'bg-green-500';
        case 'viewed': return 'bg-orange-500';
        case 'rejected': return 'bg-red-500';
        default: return 'bg-blue-500';
    }
}

function StatCard({ icon, label, value, subtext, color, isWarning }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform duration-300 group">
        <div className="flex items-start justify-between mb-4">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
                {React.cloneElement(icon, { size: 20 })}
             </div>
             {isWarning && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
        </div>
        <div>
            <p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p>
            <p className="text-sm font-bold text-slate-700">{label}</p>
            <p className="text-[10px] text-gray-400 mt-1">{subtext}</p>
        </div>
    </div>
  );
}