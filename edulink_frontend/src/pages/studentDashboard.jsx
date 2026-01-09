import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { 
  FileText, Heart, Send, Bell, Search, 
  MapPin, ChevronRight, AlertCircle, CheckCircle2,
  X, GraduationCap, CreditCard as CardIcon, Download, Trash2
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // --- ÉTATS (STATES) ---
  const [studentProfile, setStudentProfile] = useState(null); 
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [favorites, setFavorites] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // --- ÉTATS DES MODALS (C'est ici qu'il manquait la déclaration !) ---
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false); // <--- AJOUTÉ ICI

  // --- CHARGEMENT DES DONNÉES ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Sécurité : Si l'utilisateur n'est pas chargé, on arrête tout de suite le loading
      if (!user) {
        setLoading(false); 
        return;
      }

      try {
        const userId = user.id_utilisateur || user.id;

        // A. PROFIL
        try {
            const profileRes = await api.get("/etudiants/profil");
            setStudentProfile(profileRes.data.data);
        } catch (e) { console.warn("Info: Profil non chargé"); }

        // B. NOTIFICATIONS
        try {
            const notifRes = await api.get("/etudiants/notifications");
            const formattedNotifs = (notifRes.data || []).map(notif => ({
                id: notif.id,
                title: notif.titre,
                message: notif.message,
                type: notif.type === 'ALERTE' ? 'warning' : 'success',
                date: new Date(notif.date_creation).toLocaleDateString()
            }));
            setNotifications(formattedNotifs);
        } catch (e) { console.warn("Info: Notifs non chargées"); }

        // C. CANDIDATURES
        try {
            const appsRes = await api.get(`/inscriptions/mes-candidatures/${userId}`);
            if (appsRes.data.success) {
                const formattedApps = appsRes.data.data.map(app => ({
                    id: app.id_inscription,
                    school: app.formation?.ecole?.nom || "École inconnue",
                    program: app.formation?.titre || "Formation",
                    status: mapStatus(app.statut), 
                    date: app.date_inscription ? new Date(app.date_inscription).toLocaleDateString('fr-FR') : "-",
                    price: app.formation?.prix ? `${app.formation.prix.toLocaleString()} Ar` : "Non spécifié",
                    enrollmentComplete: app.statut === "INSCRIT",
                    originalData: app
                }));
                setApplications(formattedApps);
            }
        } catch (e) { console.error("Erreur Candidatures:", e); }

        // D. FAVORIS
   // DANS LE DASHBOARD (useEffect)

        // D. FAVORIS
        try {
            // userId est bien l'ID UTILISATEUR (ex: 5)
            // On suppose que api est bien configuré (axios), sinon utilisez fetch
            const favRes = await api.get(`/favoris/${userId}`);
            
            if (favRes.data.success) {
                // On transforme les données pour qu'elles matchent votre interface
                const formattedFavs = favRes.data.data.map(fav => ({
                    // L'ID unique du favori (pour la clé React)
                    id: fav.id_favoris || fav.id, 
                    
                    // ID de la formation (pour le lien de redirection)
                    formationId: fav.formation.id_formation, 

                    // Données d'affichage
                    title: fav.formation.titre,
                    school: fav.formation.ecole 
                        ? `${fav.formation.ecole.nom} (${fav.formation.ecole.adresse || "Lieu non précisé"})`
                        : "École partenaire",
                    price: fav.formation.prix !== null 
                           ? new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(fav.formation.prix) 
                           : "Gratuit",
                    
                    // On ajoute une date si dispo
                    date: fav.date_ajout ? new Date(fav.date_ajout).toLocaleDateString() : ""
                }));
                
                setFavorites(formattedFavs);
            }
        } catch (e) { 
            console.warn("Info: Impossible de charger les favoris", e); 
        }

      } catch (globalError) {
        console.error("Erreur critique:", globalError);
      } finally {
        setLoading(false); // DÉBLOQUE L'ÉCRAN BLANC
      }
    };

    fetchDashboardData();
  }, [user]);

  // --- LOGIQUE METIER ---
  const mapStatus = (backendStatus) => {
      const mapping = {
          'EN_ATTENTE': 'sent', 'VUE': 'viewed', 'ADMIS': 'accepted', 'REFUSE': 'rejected', 'INSCRIT': 'accepted'
      };
      return mapping[backendStatus] || 'sent';
  };

  const completedEnrollment = applications.find(app => app.enrollmentComplete);
  const isDossierComplete = !!completedEnrollment;

  // Gestionnaires de clic
  const openAppModal = (app) => { setSelectedApp(app); };
  
  const closeModal = () => { 
      setSelectedApp(null); 
      setShowDossierModal(false); 
      setShowAlertsModal(false); 
      setShowFavoritesModal(false); 
  };

  // --- AFFICHAGE ---
  if (loading) return <div className="min-h-screen flex items-center justify-center text-[#370669] font-bold">Chargement de votre espace...</div>;

  return (
    <div className="min-h-screen font-poppins bg-[#fafafa]">
      <StudentNavbar className="-z-10" />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* HEADER */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fadeIn">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
              Bonjour, <span className="text-[#18B49C]">{studentProfile?.utilisateur?.prenom || user?.prenom || "Étudiant"}</span>.
            </h1>
            <p className="text-gray-500 text-base">Suivez vos démarches en temps réel.</p>
          </div>
          <Link to="/formations" className="bg-[#370669] text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 hover:scale-105 transition-transform">
             <Search className="w-5 h-5" /> <span>Explorer les formations</span>
          </Link>
        </div>

        {/* STATS INTERACTIVES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard icon={<Send />} label="Candidatures" value={applications?.length || 0} subtext="Total envoyé" color="#370669" />
          
          {/* CARTE FAVORIS (Cliquable) */}
          <StatCard 
            icon={<Heart />} 
            label="Favoris" 
            value={favorites?.length || 0} 
            subtext="Formations suivies" 
            color="#ec4899" 
            onClick={() => setShowFavoritesModal(true)}
            isClickable={true}
          />          
          
          <StatCard 
            icon={isDossierComplete ? <CheckCircle2 /> : <FileText />} 
            label={isDossierComplete ? "Dossier Validé" : "Dossier"} 
            value={isDossierComplete ? "Validé" : "En cours"}
            subtext={isDossierComplete ? "Inscription confirmée" : "Documents manquants"} 
            color={isDossierComplete ? "#18B49C" : "#f59e0b"} 
            isWarning={!isDossierComplete}
            onClick={() => isDossierComplete && setShowDossierModal(true)} 
            isClickable={isDossierComplete}
          />

          <StatCard 
            icon={<Bell />} 
            label="Alertes" 
            value={notifications?.length || 0} 
            subtext="Nouveaux messages" 
            color="#27b6d8" 
            onClick={() => setShowAlertsModal(true)}
            isClickable={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LISTE CANDIDATURES */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Send className="w-5 h-5 text-[#18B49C]" /> Suivi des candidatures
              </h2>
              
              <div className="space-y-3">
                {applications.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>Aucune candidature pour le moment.</p>
                        <Link to="/formations" className="text-[#18B49C] font-bold mt-2 inline-block">Chercher une école</Link>
                    </div>
                ) : (
                    applications.map((app) => (
                    <div key={app.id} onClick={() => openAppModal(app)} className="group flex justify-between p-5 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:shadow-lg cursor-pointer transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center font-bold text-[#370669] shadow-sm border border-gray-100 group-hover:bg-[#370669] group-hover:text-white transition-colors">
                                {app.school ? app.school.charAt(0).toUpperCase() : "?"}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{app.program}</h3>
                                <p className="text-xs text-gray-500">{app.school}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={app.status} />
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#370669]" />
                        </div>
                    </div>
                    ))
                )}
              </div>
            </div>
          </div>

          {/* PROFIL CARD */}
          <div className="relative bg-[#370669] text-white rounded-[2rem] p-8 text-center shadow-xl shadow-[#370669]/20">
             <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold mb-4 mx-auto border border-white/20 uppercase">
                {studentProfile?.utilisateur?.prenom?.charAt(0) || user?.prenom?.charAt(0) || "U"}
             </div>
             <h3 className="text-xl font-bold mb-1 capitalize">{studentProfile?.utilisateur?.prenom || user?.prenom}</h3>
             <p className="text-white/60 text-sm mb-6 flex justify-center items-center gap-2">
                 <MapPin size={12}/> {studentProfile?.adresse || "Adresse non renseignée"}
             </p>
             <button onClick={() => navigate('/compte')} className="w-full py-3 rounded-xl bg-white text-[#370669] hover:bg-gray-100 transition-colors text-xs font-bold uppercase tracking-wider">
                 Modifier mon profil
             </button>
          </div>
        </div>
      </main>

      {/* --- TOUS LES MODALS SONT ICI --- */}
      
      {/* 1. Modal Candidature Détail */}
      {selectedApp && <ApplicationModal application={selectedApp} onClose={closeModal} />}
      
      {/* 2. Modal Dossier Validé */}
      {showDossierModal && <DossierStatusModal onClose={closeModal} school={completedEnrollment?.school} />}
      
      {/* 3. Modal Notifications */}
      {showAlertsModal && <NotificationsModal notifications={notifications} onClose={closeModal} />}

      {/* 4. Modal Favoris (CELUI QUI MANQUAIT) */}
     {/* AJOUTEZ CECI DANS LE RETURN DE VOTRE COMPOSANT DASHBOARD */}

{showFavoritesModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col">
      
      {/* En-tête Modal */}
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#370669] text-white">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Heart className="w-5 h-5 fill-white" /> Mes Favoris ({favorites.length})
        </h3>
        <button onClick={() => setShowFavoritesModal(false)} className="hover:bg-white/20 p-1 rounded-full transition">
           ✕ Fermer
        </button>
      </div>

      {/* Liste des favoris */}
      <div className="overflow-y-auto p-6 space-y-4">
        {favorites.length === 0 ? (
           <p className="text-center text-gray-500 py-8">Aucune formation en favoris pour le moment.</p>
        ) : (
           favorites.map((fav, index) => (
             <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all bg-gray-50 group">
                <div>
                   <h4 className="font-bold text-slate-800">{fav.title}</h4>
                   <p className="text-sm text-gray-500">{fav.school}</p>
                   <span className="text-xs font-bold text-[#18B49C]">{fav.price}</span>
                </div>
                <Link 
                  to={`/formations/${fav.formationId}`} // Lien vers la page détail
                  className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg text-gray-600 group-hover:bg-[#370669] group-hover:text-white transition-colors"
                >
                  Voir
                </Link>
             </div>
           ))
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}

// --- SOUS-COMPOSANTS ---

function StatusBadge({ status }) {
    const config = { sent: { color: "bg-blue-50 text-blue-600 border-blue-100", label: "Envoyée" }, viewed: { color: "bg-orange-50 text-orange-600 border-orange-100", label: "Vue" }, accepted: { color: "bg-green-50 text-green-600 border-green-100", label: "Admis" }, rejected: { color: "bg-red-50 text-red-600 border-red-100", label: "Refusé" } };
    const current = config[status] || config.sent;
    return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${current.color}`}>{current.label}</span>;
}

function StatCard({ icon, label, value, subtext, color, isWarning, onClick, isClickable }) {
  return (
    <div onClick={isClickable ? onClick : undefined} className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 ${isClickable ? 'cursor-pointer hover:-translate-y-1 hover:shadow-lg' : ''}`}>
        <div className="flex items-start justify-between mb-4">
             <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: color }}>
                {React.cloneElement(icon, { size: 20 })}
             </div>
             {isWarning && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>}
        </div>
        <div>
            <p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p>
            <p className="text-sm font-bold text-slate-700">{label}</p>
            <p className={`text-[10px] mt-1 font-medium ${isWarning ? 'text-orange-500' : 'text-gray-400'}`}>{subtext}</p>
        </div>
    </div>
  );
}

// --- MODAL FAVORIS (NOUVEAU COMPOSANT) ---
function FavoritesModal({ favorites, onClose }) {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-6 shadow-2xl relative animate-scaleIn" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-[#ec4899] fill-current" /> Mes Favoris
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
                </div>
                
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {(!favorites || favorites.length === 0) ? (
                        <div className="py-8 text-center text-gray-400">
                            <Heart className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                            <p>Vous n'avez aucun favori pour l'instant.</p>
                        </div>
                    ) : (
                        favorites.map((fav, idx) => (
                            <Link to={`/formations/${fav.id}`} key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-pink-200 hover:bg-pink-50/30 transition-all group">
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{fav.title}</h4>
                                    <p className="text-xs text-gray-500">{fav.school}</p>
                                    <p className="text-[10px] text-[#ec4899] font-bold mt-1">{fav.price ? fav.price + "" : ""}</p>
                                </div>
                                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-300 group-hover:text-[#ec4899] shadow-sm">
                                    <ChevronRight size={16} />
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

// --- AUTRES MODALS (Simplified for display) ---
// Assurez-vous d'avoir gardé vos composants existants: 
// ApplicationModal, DossierStatusModal, NotificationsModal
// Si vous les avez supprimés, dites-le moi, je les rajoute !

function NotificationsModal({notifications, onClose }) {
    // (Utilisez votre code existant pour ce modal)
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between mb-4"><h2 className="font-bold text-xl">Alertes</h2><button onClick={onClose}><X/></button></div>
                <div className="space-y-2">
                    {notifications.map(n => (
                        <div key={n.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="font-bold text-sm">{n.title}</p>
                            <p className="text-xs text-gray-500">{n.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function DossierStatusModal({ onClose, school }) {
    return (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white p-8 rounded-[2rem] max-w-sm text-center" onClick={e => e.stopPropagation()}>
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                <h2 className="text-2xl font-bold">Dossier Validé !</h2>
                <p className="text-gray-500 mt-2">Bienvenue à {school}.</p>
                <button onClick={onClose} className="mt-6 w-full bg-[#370669] text-white py-3 rounded-xl">Fermer</button>
            </div>
         </div>
    )
}

function ApplicationModal({ application, onClose }) {
    return (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-white p-8 rounded-[2rem] max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between mb-6">
                    <h2 className="text-2xl font-bold">{application.program}</h2>
                    <button onClick={onClose}><X/></button>
                </div>
                <p className="text-gray-500 mb-4">Statut: <span className="font-bold uppercase">{application.status}</span></p>
                {/* Contenu détaillé ici... */}
            </div>
         </div>
    )
}