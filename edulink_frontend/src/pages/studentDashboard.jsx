
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { 
  FileText, Heart, Send, Bell, Search, 
  MapPin, ChevronRight, AlertCircle, CheckCircle2,
  X, Clock, CreditCard, Upload, GraduationCap, ArrowRight, XCircle, Download, CreditCard as CardIcon
} from "lucide-react";

// // --- DONNÉES SIMULÉES ---
// const applicationsData = [
//   { id: 1, school: "HETIC", program: "Mastère Big Data", status: "sent", date: "Il y a 2j", step: 1 },
  
//   // CAS 2 : Candidature vue (En attente)
//   { id: 2, school: "ESG Luxe", program: "Bachelor Marketing", status: "viewed", date: "Il y a 1 sem", step: 2 },
  
//   // CAS 3 : DOSSIER TERMINÉ (Admis + Payé + Carte étudiante prête)
//   { id: 3, school: "Sorbonne", program: "Licence Droit", status: "accepted", date: "Il y a 1 mois", price: "4 500 000 Ar", enrollmentComplete: true },
  
//   // CAS 4 : NOUVEAU CAS -> ADMISSIBLE (Admis MAIS paiement/docs en attente)
//   { id: 5, school: "INSCAE", program: "Master Contrôle de Gestion", status: "accepted", date: "Hier", price: "8 200 000 Ar", enrollmentComplete: false },

//   // CAS 5 : Refusé
//   { id: 4, school: "Epitech", program: "Coding Academy", status: "rejected", date: "Il y a 3 jours"},
// ];

// const favoritesData = [
//   { id: 101, title: "Ingénieur Logiciel", school: "Polytech" },
//   { id: 102, title: "MBA Finance", school: "HEC Paris" },
// ];

// const notificationsData = [
//   { id: 1, title: "Carte Étudiante disponible", message: "Votre carte pour Sorbonne Université est prête.", type: "success", date: "À l'instant", action: "download" },
//   { id: 2, title: "Dossier HETIC", message: "Il manque votre relevé de notes.", type: "warning", date: "Il y a 2h" },
//   { id: 3, title: "Félicitations !", message: "Vous êtes admissible à l'INSCAE. Finalisez votre inscription.", type: "success", date: "Hier" }
// ];

// --- COMPOSANT PRINCIPAL ---
export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentProfile, setStudentProfile] = useState(null); 
  // --- ÉTATS POUR LES DONNÉES RÉELLES ---
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // États des Modals
  const [selectedApp, setSelectedApp] = useState(null); // Candidature
  const [showDossierModal, setShowDossierModal] = useState(false); // Modal Dossier Complet
  const [showAlertsModal, setShowAlertsModal] = useState(false); // Modal Notifications

  // --- CHARGEMENT DES DONNÉES DEPUIS LE BACKEND ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Récupérer le profil complet (avec inscriptions si inclus dans le back)
        // Note: Si ton endpoint /profil ne renvoie pas les inscriptions, 
        // il faudra peut-être créer une route spécifique GET /inscriptions/mes-inscriptions
        const profileRes = await api.get("/etudiants/profil");
      
      // Extraction sécurisée de la donnée réelle
      const studentData = profileRes.data.data; 
      
      console.log("=== VERIFICATION ===");
      console.log("Adresse :", studentData.adresse); // Fonctionnera maintenant
      console.log("Nom :", studentData.utilisateur?.nom);

      setStudentProfile(studentData);
        
        // 2. Récupérer les notifications
        const notifRes = await api.get("/etudiants/notifications");
        

        // --- ADAPTATION DES DONNÉES (MAPPING) ---
        // On transforme les données du backend pour qu'elles collent à ton design
        
        // Exemple de transformation pour les inscriptions (à adapter selon ton Prisma)
        const inscriptionsBackend = profileRes.data.inscriptions || []; 
        const formattedApps = inscriptionsBackend.map(ins => ({
            id: ins.id,
            school: ins.formation?.ecole?.nom || "École inconnue",
            program: ins.formation?.nom || "Formation",
            status: mapStatus(ins.statut), // Fonction pour convertir 'EN_ATTENTE' -> 'sent'
            date: new Date(ins.date_inscription).toLocaleDateString(),
            price: ins.formation?.prix + " Ar",
            enrollmentComplete: ins.statut === "INSCRIT", // Exemple
            originalData: ins // On garde l'objet original au cas où
        }));

        const formattedNotifs = notifRes.data.map(notif => ({
            id: notif.id,
            title: notif.titre,
            message: notif.message,
            type: notif.type === 'ALERTE' ? 'warning' : 'success', // À adapter
            date: new Date(notif.date_creation).toLocaleDateString()
        }));

        setApplications(formattedApps);
        setNotifications(formattedNotifs);
        
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Fonction utilitaire pour traduire les statuts du Backend vers le Frontend
  const mapStatus = (backendStatus) => {
      // Adapte ces chaînes selon ce que tu as mis dans ton Schema Prisma / Enum
      const mapping = {
          'EN_ATTENTE': 'sent',
          'VUE': 'viewed',
          'ADMIS': 'accepted',
          'REFUSE': 'rejected',
          'INSCRIT': 'accepted' // Ou un statut spécial
      };
      return mapping[backendStatus] || 'sent';
  };

  // LOGIQUE : Vérifier si un dossier est 100% complet
  const completedEnrollment = applications.find(app => app.enrollmentComplete);
  const isDossierComplete = !!completedEnrollment;

  // --- GESTION MODALS ---
  const openModal = (app) => { setSelectedApp(app); document.body.style.overflow = 'hidden'; };
  const closeModal = () => { setSelectedApp(null); setShowDossierModal(false); setShowAlertsModal(false); document.body.style.overflow = 'unset'; };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#18B49C]">Chargement de vos données...</div>;




  return (
    <div className="min-h-screen font-poppins selection:bg-[#18B49C] selection:text-white bg-[#fafafa]">
      <StudentNavbar className="-z-10" />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
              Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">{user?.prenom || "Étudiant"}</span>.
            </h1>
            <p className="text-gray-500 text-base">Suivez vos démarches en temps réel.</p>
          </div>
          
          <Link to="/formations" className="group bg-[#370669] text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-[#370669]/20 hover:scale-105 transition-all flex items-center gap-3">
             <Search className="w-5 h-5" />
             <span>Explorer les formations</span>
          </Link>
        </div>

        {/* STATS INTERACTIVES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Send />} label="Candidatures" value={applications.length} subtext="Total envoyé" color="#370669" />
<StatCard icon={<Heart />} label="Favoris" value={0} subtext="Formations suivies" color="#ec4899" />          
          {/* CARTE DOSSIER DYNAMIQUE */}
          <StatCard 
            icon={isDossierComplete ? <CheckCircle2 /> : <FileText />} 
            label={isDossierComplete ? "Dossier Validé" : "Dossier"} 
            // value={isDossierComplete ? "100%" : "85%"} 
            value={isDossierComplete ? "Validé" : "En cours"}
            subtext={isDossierComplete ? "Inscription confirmée" : "Documents manquants"} 
            color={isDossierComplete ? "#18B49C" : "#f59e0b"} 
            isWarning={!isDossierComplete}
            onClick={() => isDossierComplete && setShowDossierModal(true)} 
            isClickable={isDossierComplete}
          />

          {/* CARTE ALERTES CLIQUABLE */}
          <StatCard 
            icon={<Bell />} 
            label="Alertes" 
            value={notifications.length} 
            subtext="Nouveaux messages" 
            color="#27b6d8" 
            onClick={() => setShowAlertsModal(true)}
            isClickable={true}
          />
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
                {applications.map((app) => (
                  <div 
                    key={app.id} 
                    onClick={() => openModal(app)}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-[#370669]/10 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
                  >
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
                         {/* Badge spécial si enrollmentComplete */}
                        {app.enrollmentComplete ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border bg-[#18B49C]/10 text-[#18B49C] border-[#18B49C]/20">
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
          {/* DROITE : PROFIL */}
          <div className="flex flex-col gap-6">
            <div className="relative bg-[#370669] text-white rounded-[2rem] p-8 overflow-hidden text-center shadow-xl shadow-[#370669]/20">
                <div className="relative z-10 flex flex-col items-center">
                    
                    {/* INITIALE */}
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold mb-4 backdrop-blur-md border border-white/20 shadow-xl uppercase">
                        {/* On essaie d'abord le profil complet, sinon la session user, sinon "U" */}
                        {studentProfile?.utilisateur?.prenom.charAt(0).toUpperCase() || user?.utilisateur?.prenom.charAt(0).toUpperCase() || "U"}
                    </div>
                    
                    {/* NOM COMPLET */}
                    <h3 className="text-xl font-bold mb-1 capitalize">
                        {studentProfile?.utilisateur?.prenom || user?.utilisateur?.prenom || "Étudiant"} {studentProfile?.nom || user?.nom || ""}
                    </h3>
                    
                    {/* VILLE (Donnée spécifique au profil étudiant) */}
                    <p className="text-white/60 text-sm mb-6 flex items-center gap-2 justify-center">
                        <MapPin size={12} /> 
                        {studentProfile?.adresse || "Ville non renseignée"}
                    </p>
                    
                    <button onClick={() => navigate('/compte')}  className="w-full py-3 rounded-xl bg-white text-[#370669] hover:bg-gray-100 transition-colors text-xs font-bold uppercase tracking-wider">
                        Modifier mon profil
                    </button>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- MODALS --- */}
      
      {/* 1. Modal Candidature Classique */}
      {selectedApp && <ApplicationModal application={selectedApp} onClose={closeModal} />}
      
      {/* 2. Modal Dossier Complet */}
      {showDossierModal && <DossierStatusModal onClose={closeModal} school={completedEnrollment?.school} />}

      {/* 3. Modal Notifications / Alertes */}
      {showAlertsModal && <NotificationsModal  notifications={notifications} onClose={closeModal} />}

    </div>
  );
}

// --- NOUVEAU MODAL : STATUT DU DOSSIER ---
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
                    <div className="bg-blue-100 p-2 rounded-full h-fit text-blue-600">
                        <CardIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm">Carte Étudiante</h4>
                        <p className="text-xs text-blue-800 mt-1">
                            L'école prépare votre carte. Vous recevrez une notification dans l'onglet <span className="font-bold">Alertes</span> pour la télécharger dès qu'elle sera prête.
                        </p>
                    </div>
                </div>

                <button onClick={onClose} className="w-full bg-[#370669] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2b0554] transition-all">
                    J'ai compris
                </button>
            </div>
        </div>
    );
}

// --- NOUVEAU MODAL : NOTIFICATIONS / ALERTES ---
function NotificationsModal({notifications, onClose }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-scaleIn" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-[#27b6d8]" /> Vos Alertes
                    </h2>
                    <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                
                <div className="p-2 max-h-[60vh] overflow-y-auto">

                    {(!notifications || notifications.length === 0) ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                            Aucune notification pour le moment.
                        </div>
                    ) : 
                    notifications.map((notif) => (
                        <div key={notif.id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors border-b border-gray-50 last:border-0">
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    notif.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {notif.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-bold text-slate-900 text-sm">{notif.title}</h4>
                                        <span className="text-[10px] text-gray-400">{notif.date}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-3">{notif.message}</p>
                                    
                                    {notif.action === 'download' && (
                                        <button className="flex items-center gap-2 text-[10px] font-bold bg-[#18B49C] text-white px-3 py-1.5 rounded-lg hover:bg-[#159c87] transition-colors shadow-md shadow-[#18B49C]/20">
                                            <Download className="w-3 h-3" /> Télécharger la carte (PDF)
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// --- SOUS-COMPOSANT : MODAL CANDIDATURE ---
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

                <div className="p-8">
                    {application.status === 'accepted' && <AcceptedContent app={application} onClose={onClose} />}
                    {['sent', 'viewed'].includes(application.status) && <PendingContent app={application} />}
                    {application.status === 'rejected' && <RejectedContent app={application} onClose={onClose} />}
                </div>
            </div>
        </div>
    );
}

// --- COMPOSANTS DE CONTENU MODAL ---
function AcceptedContent({ app, onClose }) {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const handleGoToPayment = () => { onClose(); navigate(`/paiement/${app.id}`); };

    // Si l'inscription est DÉJÀ complète (simulé via prop), on affiche le message de succès
    if(app.enrollmentComplete) {
         return (
            <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Inscription Terminée</h3>
                <p className="text-gray-500 mt-2 text-sm">Votre paiement a été reçu et votre dossier est validé.</p>
            </div>
         );
    }

    // Sinon, on affiche le Stepper (Docs -> Paiement)
    return (
        <div className="animate-fadeIn">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full blur-[50px] opacity-30 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3"><GraduationCap className="w-6 h-6" /></div>
                    <h3 className="text-xl font-bold text-green-800 mb-1">Félicitations ! Vous êtes admissible.</h3>
                    <p className="text-sm text-green-700 max-w-md mx-auto">Finalisez votre inscription avant le <span className="font-bold">25 Septembre</span>.</p>
                </div>
            </div>
            <div className="flex items-center mb-8 px-4">
                <div className={`flex-1 h-2 rounded-l-full ${step >= 1 ? 'bg-[#18B49C]' : 'bg-gray-100'}`}></div>
                <div className={`flex-1 h-2 rounded-r-full ${step === 2 ? 'bg-[#18B49C]' : 'bg-gray-100'}`}></div>
            </div>
            {step === 1 ? (
                <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-[#370669]" /> Pièces manquantes</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer"><Upload className="w-6 h-6 text-gray-400 mb-2" /><span className="text-xs font-bold text-slate-700">Photo d'identité</span></div>
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 cursor-pointer"><Upload className="w-6 h-6 text-gray-400 mb-2" /><span className="text-xs font-bold text-slate-700">Attestation BAC</span></div>
                    </div>
                    <div className="flex justify-end pt-4"><button onClick={() => setStep(2)} className="bg-[#370669] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#2b0554] flex items-center gap-2 shadow-lg shadow-[#370669]/20">Suivant <ArrowRight className="w-4 h-4" /></button></div>
                </div>
            ) : (
                <div className="space-y-6 animate-fadeIn">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2"><CreditCard className="w-5 h-5 text-[#370669]" /> Frais de scolarité</h4>
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-4"><span className="text-sm text-gray-500">Montant annuel</span><span className="font-bold text-lg text-slate-900">{app.price}</span></div>
                        <div className="flex justify-between items-center pt-4 border-t border-gray-200"><span className="text-sm font-bold text-[#370669]">Acompte requis (20%)</span><span className="font-bold text-xl text-[#18B49C]">900 000 Ar</span></div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button onClick={handleGoToPayment} className="w-full bg-[#18B49C] text-white py-4 rounded-xl font-bold hover:bg-[#149984] flex items-center justify-center gap-2 shadow-xl shadow-[#18B49C]/20"><CreditCard className="w-4 h-4" /> Accéder au paiement sécurisé</button>
                        <button onClick={() => setStep(1)} className="text-gray-400 text-xs font-bold hover:text-gray-600 py-2">Retour aux documents</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function PendingContent({ app }) {
    return (
        <div className="text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-50 text-blue-600 mb-6"><Clock className="w-8 h-8" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Dossier en cours d'examen</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mb-10">L'équipe pédagogique étudie votre dossier.</p>
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
            <p className="text-sm text-gray-500 leading-relaxed mb-6 bg-gray-50 p-4 rounded-xl text-left">"Malgré la qualité de votre profil, nous ne pouvons donner suite..."</p>
            <div className="border-t border-gray-100 pt-6"><button onClick={handleGoToFormation} className="block w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800">Voir d'autres formations</button></div>
        </div>
    );
}

// --- UTILS ---

function StatusBadge({ status }) {
    const config = { sent: { color: "bg-blue-50 text-blue-600 border-blue-100", label: "Envoyée", icon: Send }, viewed: { color: "bg-orange-50 text-orange-600 border-orange-100", label: "Vue", icon: CheckCircle2 }, accepted: { color: "bg-green-50 text-green-600 border-green-100", label: "Admissible", icon: GraduationCap }, rejected: { color: "bg-red-50 text-red-600 border-red-100", label: "Refusée", icon: AlertCircle } };
    const current = config[status] || config.sent;
    const Icon = current.icon;
    return <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${current.color}`}><Icon size={12} /> {current.label}</span>;
}

function getStatusColor(status) {
    switch (status) { case 'accepted': return 'bg-green-500'; case 'viewed': return 'bg-orange-500'; case 'rejected': return 'bg-red-500'; default: return 'bg-blue-500'; }
}

function StatCard({ icon, label, value, subtext, color, isWarning, onClick, isClickable }) {
  return (
    <div 
        onClick={isClickable ? onClick : undefined}
        className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-all duration-300 group relative overflow-hidden ${isClickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg hover:border-[#370669]/10' : ''}`}
    >
        <div className="flex items-start justify-between mb-4">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110" style={{ backgroundColor: color }}>
                {React.cloneElement(icon, { size: 20 })}
             </div>
             {isWarning && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
             {/* Petit indicateur visuel si cliquable */}
             {isClickable && <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300"><ChevronRight size={16} /></div>}
        </div>
        <div>
            <p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p>
            <p className="text-sm font-bold text-slate-700">{label}</p>
            <p className={`text-[10px] mt-1 font-medium ${isWarning ? 'text-orange-500' : 'text-gray-400'}`}>{subtext}</p>
        </div>
    </div>
  );
}