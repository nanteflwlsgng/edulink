import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import { useAuth } from "../context/AuthContext";
import { 
  FileText, Heart, Send, Bell, Search, 
  ChevronRight, AlertCircle, CheckCircle2,
  X, Clock, CreditCard, Upload, GraduationCap, ArrowRight, XCircle, Download, 
  CreditCard as CardIcon, MapPin
} from "lucide-react";

// ==========================================
// MOCK DATA (Scénarios)
// ==========================================
const applicationsData = [
  // CAS 1 : En attente
  { id: 1, school: "HETIC", program: "Mastère Big Data", status: "sent", date: "Il y a 2j", step: 1 },
  
  // CAS 2 : Vue par l'école
  { id: 2, school: "ESG Luxe", program: "Bachelor Marketing", status: "viewed", date: "Il y a 1 sem", step: 2 },
  
  // CAS 3 : INSCRIT DÉFINITIF (Admis + Payé + Dossier OK)
  { id: 3, school: "Sorbonne Université", program: "Licence Droit", status: "accepted", date: "Il y a 1 mois", price: "4 500 000 Ar", enrollmentComplete: true },
  
  // CAS 4 : ADMISSIBLE (Admis MAIS dossier incomplet / non payé)
  { id: 5, school: "INSCAE", program: "Master Contrôle de Gestion", status: "accepted", date: "Hier", price: "8 200 000 Ar", enrollmentComplete: false },

  // CAS 5 : Refusé
  { id: 4, school: "Epitech", program: "Coding Academy", status: "rejected", date: "Il y a 3 jours"},
];

const favoritesData = [
  { id: 101, title: "Ingénieur Logiciel", school: "Polytech" },
  { id: 102, title: "MBA Finance", school: "HEC Paris" },
];

const notificationsData = [
  { id: 1, title: "Carte Étudiante disponible", message: "Votre carte pour Sorbonne Université est prête.", type: "success", date: "À l'instant", action: "download" },
  { id: 2, title: "Dossier INSCAE", message: "Complétez votre dossier pour valider l'inscription.", type: "warning", date: "Hier" }
];

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function StudentDashboard() {
  const { user } = useAuth();
  
  // États des Modals
  const [selectedApp, setSelectedApp] = useState(null); 
  const [showDossierModal, setShowDossierModal] = useState(false); 
  const [showAlertsModal, setShowAlertsModal] = useState(false); 

  // Vérifier si au moins une inscription est terminée
  const completedEnrollment = applicationsData.find(app => app.enrollmentComplete);
  const isDossierComplete = !!completedEnrollment;

  // Gestion des modals
  const openModal = (app) => {
    setSelectedApp(app);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedApp(null);
    setShowDossierModal(false);
    setShowAlertsModal(false);
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
            <p className="text-gray-500 text-base">Suivez vos démarches en temps réel.</p>
          </div>
          
          <Link to="/formations" className="group bg-[#370669] text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-[#370669]/20 hover:scale-105 transition-all flex items-center gap-3">
             <Search className="w-5 h-5" />
             <span>Catalogue 2025</span>
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Send />} label="Candidatures" value={applicationsData.length} subtext="Total envoyé" color="#370669" />
          <StatCard icon={<Heart />} label="Favoris" value={favoritesData.length} subtext="Formations suivies" color="#ec4899" />
          
          {/* Carte "Dossier Validé" vs "À Finaliser" */}
          <StatCard 
            icon={isDossierComplete ? <CheckCircle2 /> : <AlertCircle />} 
            label={isDossierComplete ? "Inscription" : "À Finaliser"} 
            value={isDossierComplete ? "Validée" : "1 Action"} 
            subtext={isDossierComplete ? "Dossier complet" : "Paiement en attente"} 
            color={isDossierComplete ? "#18B49C" : "#f59e0b"} 
            isWarning={!isDossierComplete}
            onClick={() => isDossierComplete && setShowDossierModal(true)} 
            isClickable={isDossierComplete}
          />

          <StatCard 
            icon={<Bell />} label="Alertes" value={notificationsData.length} subtext="Nouveaux messages" color="#27b6d8" 
            onClick={() => setShowAlertsModal(true)} isClickable={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* GAUCHE : LISTE CANDIDATURES */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#18B49C]" /> État des dossiers
                </h2>
              </div>

              <div className="space-y-3">
                {applicationsData.map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => openModal(app)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-[#370669]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
                    {/* Indicateur coloré à gauche */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        app.enrollmentComplete ? 'bg-green-500' : getStatusColor(app.status)
                    } transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom`}></div>

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
                        {/* LOGIQUE D'AFFICHAGE DU BADGE */}
                        {app.enrollmentComplete ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-[#18B49C]/10 text-[#18B49C] border-[#18B49C]/20 animate-fadeIn">
                                <CheckCircle2 size={12} /> Inscrit
                            </span>
                        ) : (
                            <StatusBadge status={app.status} />
                        )}
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

      {/* --- MODALS --- */}
      {selectedApp && <ApplicationModal application={selectedApp} onClose={closeModal} />}
      {showDossierModal && <DossierStatusModal onClose={closeModal} school={completedEnrollment?.school} />}
      {showAlertsModal && <NotificationsModal onClose={closeModal} />}

    </div>
  );
}

// ==========================================
// SOUS-COMPOSANTS MODALS
// ==========================================

function ApplicationModal({ application, onClose }) {
    const handleContentClick = (e) => e.stopPropagation();

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden relative animate-scaleIn max-h-[90vh] overflow-y-auto" onClick={handleContentClick}>
                <div className="flex justify-between items-start p-8 border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-2xl font-bold text-[#370669]">
                            {application.school.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{application.program}</h2>
                            <p className="text-gray-500 font-medium">{application.school}</p>
                            <p className="text-xs text-gray-400 mt-1">Dernière maj: {application.date}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {/* Logique conditionnelle forte pour l'affichage */}
                    {application.status === 'accepted' && <AcceptedContent app={application} onClose={onClose} />}
                    {['sent', 'viewed'].includes(application.status) && <PendingContent app={application} />}
                    {application.status === 'rejected' && <RejectedContent app={application} onClose={onClose} />}
                </div>
            </div>
        </div>
    );
}

// --- CONTENU: ADMISSIBLE vs INSCRIT ---
function AcceptedContent({ app, onClose }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Docs, 2: Paiement
    const handleGoToPayment = () => { onClose(); navigate(`/paiement/${app.id}`); };

    // 1. CAS INSCRIT (Tout est fini)
    if(app.enrollmentComplete) {
         return (
            <div className="text-center py-8">
                <div className="w-24 h-24 bg-[#18B49C]/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <CheckCircle2 className="w-12 h-12 text-[#18B49C]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Inscription Terminée</h3>
                <p className="text-gray-500 mb-8 text-sm">Votre paiement a été reçu et votre dossier administratif est validé.</p>
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 flex items-center gap-4 text-left">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-[#370669]"><GraduationCap size={24}/></div>
                    <div>
                        <p className="font-bold text-slate-900 text-sm">Carte d'étudiant</p>
                        <p className="text-xs text-gray-400">Année 2025-2026</p>
                    </div>
                    <button className="ml-auto text-[#18B49C] hover:text-[#149984]"><Download size={20}/></button>
                </div>
            </div>
         );
    }

    // 2. CAS ADMISSIBLE (Parcours à compléter)
    return (
        <div className="animate-fadeIn">
            {/* Bannière Admissible */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white text-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-orange-100">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-orange-800 mb-1">Vous êtes Admissible !</h3>
                    <p className="text-sm text-orange-700 max-w-md mx-auto">
                        Pour valider définitivement votre statut <span className="font-bold">"Inscrit"</span>, veuillez finaliser les étapes suivantes.
                    </p>
                </div>
            </div>

            {/* Stepper */}
            <div className="flex items-center mb-8 px-4">
                <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-[#370669]' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 1 ? 'bg-[#370669] text-white' : 'bg-gray-100'}`}>1</div>
                    <span className="text-[10px] font-bold uppercase">Documents</span>
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${step >= 2 ? 'bg-[#370669]' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-[#370669]' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${step >= 2 ? 'bg-[#370669] text-white' : 'bg-gray-100'}`}>2</div>
                    <span className="text-[10px] font-bold uppercase">Paiement</span>
                </div>
            </div>

            {step === 1 ? (
                // ÉTAPE 1 : DOCUMENTS MANQUANTS
                <div className="space-y-6 animate-fadeIn">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <FileText className="w-4 h-4 text-[#370669]" /> Pièces complémentaires requises
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <UploadCard label="Photo d'identité" />
                        <UploadCard label="Attestation BAC" />
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-50">
                        <button onClick={() => setStep(2)} className="bg-[#370669] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#2b0554] flex items-center gap-2 shadow-lg shadow-[#370669]/20 transition-all">
                            Valider et passer au paiement <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                // ÉTAPE 2 : PAIEMENT
                <div className="space-y-6 animate-fadeIn">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <CreditCard className="w-4 h-4 text-[#370669]" /> Règlement des droits
                    </h4>
                    
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-gray-500 font-medium">Scolarité Annuelle</span>
                            <span className="font-bold text-lg text-slate-900">{app.price}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                            <span className="text-sm font-bold text-[#370669]">Acompte requis (Inscription)</span>
                            <span className="font-bold text-xl text-[#18B49C]">900 000 Ar</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button onClick={handleGoToPayment} className="w-full bg-[#18B49C] text-white py-4 rounded-xl font-bold hover:bg-[#149984] flex items-center justify-center gap-2 shadow-xl shadow-[#18B49C]/20 transition-all">
                            <CreditCard className="w-4 h-4" /> Payer maintenant et s'inscrire
                        </button>
                        <button onClick={() => setStep(1)} className="text-gray-400 text-xs font-bold hover:text-gray-600 py-2">
                            Retour aux documents
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function UploadCard({ label }) {
    return (
        <div className="border border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 hover:border-[#370669] cursor-pointer transition-all group">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-[#370669]/10 group-hover:text-[#370669] transition-colors">
                <Upload className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-xs font-bold text-slate-700">{label}</span>
            <span className="text-[10px] text-gray-400 mt-1">PDF ou JPG</span>
        </div>
    );
}

function PendingContent({ app }) {
    return (
        <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-50 text-blue-600 mb-6 animate-pulse"><Clock className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Dossier en cours d'examen</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-10">
                Votre dossier est entre les mains du jury. Vous recevrez une notification dès que le statut changera.
            </p>
            <div className="max-w-xs mx-auto text-left space-y-6 relative pl-2">
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
                {[{l:"Candidature envoyée",a:true,d:app.date},{l:"Réception par l'école",a:app.status==='viewed',d:app.status==='viewed'?"Hier":"En attente"},{l:"Décision du jury",a:false,d:"Estimé: 25 Sept."}].map((s,i)=>(
                    <div key={i} className="relative flex items-center gap-4 z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${s.a?'bg-blue-600 text-white':'bg-gray-200 text-gray-400'}`}>{s.a?<CheckCircle2 className="w-4 h-4"/>:<Clock className="w-4 h-4"/>}</div>
                        <div><p className={`text-sm font-bold ${s.a?'text-slate-900':'text-gray-400'}`}>{s.l}</p><p className="text-xs text-gray-400">{s.d}</p></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function RejectedContent({ app, onClose }) {
    const navigate = useNavigate();
    const handleGoToFormation = () => { onClose(); navigate(`/formations`); };
    return (
        <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-red-50 text-red-500 mb-6"><XCircle className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Candidature non retenue</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 bg-gray-50 p-4 rounded-xl text-left border border-gray-100">
                "Nous vous remercions pour l'intérêt porté à notre établissement. Malheureusement, après étude de votre dossier, nous ne pouvons donner suite à votre candidature pour cette année."
            </p>
            <div className="border-t border-gray-100 pt-6">
                <button onClick={handleGoToFormation} className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                    Explorer d'autres formations
                </button>
            </div>
        </div>
    );
}

// ==========================================
// AUTRES MODALS (Dossier Status & Alerts)
// ==========================================

function DossierStatusModal({ onClose, school }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl relative animate-scaleIn text-center" onClick={e => e.stopPropagation()}>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Dossier Complet !</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Félicitations, votre inscription à <span className="font-bold text-slate-800">{school}</span> est administrativement validée.
                </p>
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-8 text-left flex gap-4">
                    <div className="bg-blue-100 p-2 rounded-full h-fit text-blue-600"><CardIcon className="w-5 h-5" /></div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">Carte Étudiante</h4>
                        <p className="text-xs text-blue-800 mt-1">L'école prépare votre carte. Vous recevrez une notification bientôt.</p>
                    </div>
                </div>
                <button onClick={onClose} className="w-full bg-[#370669] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2b0554] transition-all">J'ai compris</button>
            </div>
        </div>
    );
}

function NotificationsModal({ onClose }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-scaleIn" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Bell className="w-5 h-5 text-[#27b6d8]" /> Vos Alertes</h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                <div className="p-2 max-h-[60vh] overflow-y-auto">
                    {notificationsData.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                                    {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1"><h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4><span className="text-[10px] text-gray-400">{notif.date}</span></div>
                                    <p className="text-xs text-gray-500 mb-3">{notif.message}</p>
                                    {notif.action === 'download' && <button className="flex items-center gap-2 text-[10px] font-bold bg-[#18B49C] text-white px-3 py-1.5 rounded-lg hover:bg-[#159c87] transition-colors"><Download className="w-3 h-3" /> Télécharger</button>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- UTILS UI ---

function StatusBadge({ status }) {
    // Note: 'accepted' ici signifie Admissible (avant paiement)
    const config = { 
        sent: { color: "bg-blue-50 text-blue-600 border-blue-100", label: "Envoyée", icon: Send }, 
        viewed: { color: "bg-orange-50 text-orange-600 border-orange-100", label: "Vue", icon: CheckCircle2 }, 
        accepted: { color: "bg-purple-50 text-purple-600 border-purple-100", label: "Admissible", icon: GraduationCap }, // Changé en Admissible
        rejected: { color: "bg-red-50 text-red-600 border-red-100", label: "Refusée", icon: AlertCircle } 
    };
    const current = config[status] || config.sent;
    const Icon = current.icon;
    return <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${current.color}`}><Icon size={12} /> {current.label}</span>;
}

function getStatusColor(status) {
    switch (status) { case 'accepted': return 'bg-purple-500'; case 'viewed': return 'bg-orange-500'; case 'rejected': return 'bg-red-500'; default: return 'bg-blue-500'; }
}

function StatCard({ icon, label, value, subtext, color, isWarning, onClick, isClickable }) {
  return (
    <div onClick={isClickable ? onClick : undefined} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 group relative overflow-hidden ${isClickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-[#370669]/10' : ''}`}>
        <div className="flex items-start justify-between mb-4">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110" style={{ backgroundColor: color }}>{React.cloneElement(icon, { size: 20 })}</div>
             {isWarning && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
             {isClickable && <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300"><ChevronRight size={16} /></div>}
        </div>
        <div><p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p><p className="text-sm font-bold text-slate-700">{label}</p><p className={`text-[10px] mt-1 font-medium ${isWarning ? 'text-orange-500' : 'text-gray-400'}`}>{subtext}</p></div>
    </div>
  );
}