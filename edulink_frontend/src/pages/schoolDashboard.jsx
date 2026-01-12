import React, { useState, useEffect } from "react";
import {
    LayoutDashboard, BookOpen, Users, CreditCard, Settings, LogOut,
    Plus, Trash2, Eye, CheckCircle2, FileText,
    Building2, Globe, Mail, Phone, Download,
    DollarSign, Search, Calendar, Filter, ArrowUpRight, BadgeCheck, Bell, Clock, AlertTriangle, X, Sparkles, LayoutList, LayoutGrid
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormationModal from "../components/FormationModal";
import CandidatureModal from "../components/CandidatureModal";
import SelectionIAModal from "../components/SelectionIAModal";
import FloatingAssistant from "../components/FloatingAssistant";
import Toast from "../components/Toast";

import api from "../services/api";

// ✅ URL de base pour les images venant du backend
const API_BASE_URL = "http://localhost:5000";

export default function SchoolDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Navigation & Data
    const [activeTab, setActiveTab] = useState("overview");
    const [formations, setFormations] = useState([]);
    const [candidats, setCandidats] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({
        totalStudents: 0, pendingReview: 0, pendingMoney: 0, revenue: 0
    });

    // UI States
    const [toast, setToast] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFormation, setEditingFormation] = useState(null);
    const [isCandidatureModalOpen, setIsCandidatureModalOpen] = useState(false);
    const [selectedCandidat, setSelectedCandidat] = useState(null);
    const [isIAModalOpen, setIsIAModalOpen] = useState(false);

    // --- HELPERS UI ---
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4500);
    };

    const openConfirmation = (title, message, onConfirmAction) => {
        setConfirmModal({
            isOpen: true, title, message,
            onConfirm: () => { onConfirmAction(); setConfirmModal({ ...confirmModal, isOpen: false }); }
        });
    };
    const getStatusConfig = (status) => {
    switch (status) {
        case 'VALIDEE': 
            return { label: 'Validé', style: 'bg-green-50 text-green-600 border-green-100', icon: CheckCircle2 };
        case 'PAYE': 
            // C'est ici l'astuce : Si c'est PAYE techniquement, c'est "A Valider" administrativement
            return { label: 'À Valider', style: 'bg-orange-50 text-orange-600 border-orange-100', icon: Clock };
        case 'ECHEC': 
            return { label: 'Échec', style: 'bg-red-50 text-red-600 border-red-100', icon: AlertTriangle };
        default: 
            return { label: status, style: 'bg-gray-50 text-gray-600', icon: Clock };
    }
};

    // --- CHARGEMENT DES DONNÉES (Backend) ---
    const fetchFormations = async () => {
  try {
        const res = await api.get('/formations');
        
        if (res.data.success) {
            // ✅ CORRECTION ICI : Le service renvoie le tableau direct dans data
            // Pas de .formations
            const rawFormations = Array.isArray(res.data.data) ? res.data.data : [];

            const formationsFormattees = rawFormations.map(f => ({
                ...f, 
                id: f.id_formation, // INDISPENSABLE pour modifier/supprimer
                title: f.titre,
                level: f.niveau,
                students: f._count?.inscriptions || 0,
                status: f.statut,
                price: f.prix,
                // On s'assure que les sessions sont là pour les dates
                sessions: f.sessions || [], 
                image: f.image_url ? `${API_BASE_URL}/${f.image_url}` : null
            }));

            setFormations(formationsFormattees);
        }
    } catch (error) {
        console.error("Erreur chargement formations:", error);
    }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Stats
                const resStats = await api.get('/ecoles/dashboard/stats').catch(() => ({ data: { success: false } }));
                if (resStats.data?.success && resStats.data.data?.stats) {
                    setStats(resStats.data.data.stats);
                }

                // 2. Formations
                await fetchFormations();

                // 3. Candidatures
                // 3. Candidatures
                 const resCandidatures = await api.get('/ecoles/candidatures').catch(() => ({ data: { success: false } }));
                
                if (resCandidatures.data?.success && Array.isArray(resCandidatures.data.data)) {
                    // Le Backend a déjà formaté les données (nom, image, status...)
                    // On les stocke directement sans refaire de map complexe
                    setCandidats(resCandidatures.data.data);
                }


                    // On transforme les données brutes (Backend) en format affichage (Frontend)
                   // 3. Candidatures
              
                // 4. Finances
                const resFinance = await api.get('/paiements/ecoles/finances').catch(() => ({ data: { success: false } }));
                if (resFinance.data?.success && Array.isArray(resFinance.data.data)) {
                    setTransactions(resFinance.data.data);
                }

            } catch (error) {
                console.error("❌ Erreur chargement global", error);
            }
        };

        fetchData();
    }, []);

    // --- LOGIQUE METIER ---

    // 1. Gestion Formations (Create/Update)
  const handleSaveFormation = async (formDataReceived) => {
    try {
        // On configure le header pour être sûr que le fichier passe
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };

        if (editingFormation) {
            // Vérification de sécurité
            if (!editingFormation.id) {
                showToast("error", "Erreur: ID de formation manquant.");
                return;
            }

            // MODIFICATION (PUT)
            await api.put(`/formations/${editingFormation.id}`, formDataReceived, config);
            showToast("success", "Formation mise à jour avec succès !");
        
        } else {
            // CRÉATION (POST)
            await api.post('/formations', formDataReceived, config);
            showToast("success", "Formation créée avec succès !");
        }

        // Rafraîchir et fermer
        await fetchFormations();
        setIsModalOpen(false);
        setEditingFormation(null);

    } catch (error) {
        console.error("Erreur sauvegarde:", error);
        // Affiche le message précis du backend
        const msg = error.response?.data?.message || "Erreur lors de l'enregistrement.";
        showToast("error", msg);
    }
};

    // 2. Mapping pour modification
   const handleEditClick = (formationBackend) => {
    // 1. Récupération de la session (Dates)
    const currentSession = formationBackend.sessions && formationBackend.sessions.length > 0 
        ? formationBackend.sessions[0] 
        : {};

    // 2. Mapping Inverse (Backend Code -> Frontend Texte)
    const dureeMapReverse = {
        'ANS_1': '1 an', 'ANS_2': '2 ans', 'ANS_3': '3 ans',
        'ANS_4': '4 ans', 'ANS_5': '5 ans', 'MOIS_6': '6 mois'
    };

    // Helper majuscule
    const capitalize = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
    
    // Mode
    const modeLabel = formationBackend.mode === 'EN_LIGNE' ? 'En ligne' : 'Présentiel';

    // Gestion intelligente de l'URL image
    // Si l'URL contient déjà "http", on ne rajoute pas API_BASE_URL
    let imageUrl = null;
    if (formationBackend.image_url) {
        imageUrl = formationBackend.image_url.startsWith('http') 
            ? formationBackend.image_url 
            : `${API_BASE_URL}/${formationBackend.image_url}`;
    }

    // 3. Construction de l'objet pour le modal
    const dataForModal = {
        // ⚠️ CORRECTION ICI : On utilise .id (Frontend) ou .id_formation (Backend) en fallback
        id: formationBackend.id || formationBackend.id_formation,
        
        title: formationBackend.titre || formationBackend.title || "",
        
        category: capitalize(formationBackend.categorie || formationBackend.category) || "Informatique",
        level: capitalize(formationBackend.niveau || formationBackend.level) || "Licence",
        
        // On essaie de mapper le code (ANS_2), sinon on prend la valeur telle quelle
        duration: dureeMapReverse[formationBackend.duree] || formationBackend.duration || "",
        
        price: formationBackend.prix || formationBackend.price || "",
        description: formationBackend.description || "",
        
        // Dates depuis la session
        startDate: currentSession.date_debut ? currentSession.date_debut.split('T')[0] : "",
        endDate: currentSession.date_fin ? currentSession.date_fin.split('T')[0] : "",
        
        mode: modeLabel,
        quota: formationBackend.nbr_max_etudiant || "",
        conditions: formationBackend.conditions || [],
        
        // Image
        image: imageUrl,
        imagePreview: imageUrl
    };

    setEditingFormation(dataForModal);
    setIsModalOpen(true);
};

    // 3. Suppression Formation
   const handleDeleteFormation = (id_formation, e) => {
    e.stopPropagation();
    openConfirmation("Supprimer la formation ?", "Êtes-vous sûr ? Cette action est définitive.", async () => {
        try {
            await api.delete(`/formations/${id_formation}`);
            
            // Mise à jour de l'interface
            setFormations(formations.filter(f => f.id !== id_formation && f.id_formation !== id_formation));
            
            showToast("info", "Formation supprimée.");
        } catch (error) {
            console.error("Détail erreur suppression:", error); // Regarde la console du navigateur (F12) !
            
            // ✅ CORRECTION : On affiche le message du serveur, ou un message par défaut
            const serverMessage = error.response?.data?.message || "Erreur technique lors de la suppression.";
            showToast("error", serverMessage);
        }
    });
};

    // Dans SchoolDashboard.js

const handleValidateTransaction = (paymentId) => {
    openConfirmation(
        "Valider le dossier ?", 
        "En validant, vous confirmez la réception des fonds et l'inscription définitive de l'étudiant.", 
        async () => {
            try {
                // Appel de notre nouvelle route backend
                await api.put(`/paiements/${paymentId}/valider`);

                // Mise à jour locale (Optimistic UI)
                setTransactions(prev => prev.map(t => 
                    t.id === paymentId 
                    ? { ...t, status: 'VALIDEE' } // On passe localement à VALIDEE
                    : t
                ));
                
                // On met aussi à jour la liste des étudiants si besoin
                // ... code mise à jour candidats ...

                showToast("success", "Dossier validé avec succès !");
            } catch (error) {
                console.error(error);
                showToast("error", "Erreur lors de la validation.");
            }
        }
    );
};

    const openCandidature = (candidat) => {
        // Si c'était "En attente", on pourrait appeler l'API pour passer en "Vu"
        setSelectedCandidat(candidat);
        setIsCandidatureModalOpen(true);
    };

   // SchoolDashboard.js

    const handleCandidatureDecision = async (id, decision) => {
        // id : C'est l'id_inscription
        // decision : C'est "Admis" ou "Refusé" (venant des boutons du modal)

        try {
            // On utilise PATCH car votre route est définie avec router.patch
            // L'URL doit correspondre à : /ecoles/candidatures/:id/status
            // Le body doit contenir { decision: "Admis" } ou { decision: "Refusé" }
            const response = await api.patch(`/ecoles/candidatures/${id}/status`, { 
                decision: decision 
            });

            if (response.data.success) {
                // Mise à jour locale de l'état (Optimistic UI) pour éviter de recharger la page
                setCandidats(candidats.map(c => 
                    c.id === id ? { ...c, status: decision } : c
                ));
                
                // Fermer le modal
                setIsCandidatureModalOpen(false);
                
                // Afficher le toast
                showToast(
                    decision === 'Admis' ? 'success' : 'info', 
                    `Statut mis à jour : ${decision}`
                );
            }

        } catch (error) {
            console.error("Erreur mise à jour statut:", error);
            const message = error.response?.data?.message || "Impossible de mettre à jour le statut.";
            showToast("error", message);
        }
    };

    const handleApplyIASelection = (rankedResults, quota) => {
        // Simulation mise à jour locale
        const updatedCandidats = [...candidats];
        rankedResults.forEach((rankedCandidat, index) => {
            const mainIndex = updatedCandidats.findIndex(c => c.id === rankedCandidat.id);
            if (mainIndex !== -1) {
                updatedCandidats[mainIndex] = {
                    ...updatedCandidats[mainIndex],
                    status: index < quota ? 'Admis' : 'Refusé',
                    aiScore: rankedCandidat.score,
                    aiRank: index + 1
                };
            }
        });
        setCandidats(updatedCandidats);
        showToast("success", "Sélection IA appliquée avec succès !");
        setIsIAModalOpen(false);
    };

    // --- RENDER ---
    const renderContent = () => {
        switch (activeTab) {
            case "overview": return <OverviewTab stats={stats} transactions={transactions} goToFinances={() => setActiveTab('finances')} />;
            case "formations": return <FormationsTab formations={formations} onCreate={() => { setEditingFormation(null); setIsModalOpen(true); }} onEdit={handleEditClick} onDelete={handleDeleteFormation} />;
            case "candidatures": return <CandidaturesTab candidats={candidats} onOpen={openCandidature} onOpenIA={() => setIsIAModalOpen(true)} />;
            case "finances": return <FinancesTab transactions={transactions} onValidate={handleValidateTransaction} />;
            case "students": return <StudentCardsTab candidats={candidats} />;
            case "settings": return <div className="p-10 text-gray-400">Paramètres (À venir)</div>;
            default: return <OverviewTab stats={stats} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#f8f9fc] font-poppins text-slate-800 overflow-hidden">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between z-20 shadow-sm flex-shrink-0">
                <div>
                    <div className="p-8 flex items-center gap-3">
                        <img src="/icons8-éducation-64 1.png" alt="Logo" className="h-10 w-10" />
                        <span className="font-bold text-lg text-[#370669] tracking-tight">EduLink</span>
                    </div>
                    {/* <img src="/icons8-éducation-64 1.png" alt="Logo" className="h-10 w-10" />
        <span className="text-lg font-bold text-[#370669]">EduLink</span> */}
                    <nav className="px-4 space-y-1">
                        <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
                        <SidebarItem icon={BookOpen} label="Mes Formations" active={activeTab === "formations"} onClick={() => setActiveTab("formations")} />
                        <SidebarItem icon={Users} label="Candidatures" badge={stats?.pendingReview || 0} active={activeTab === "candidatures"} onClick={() => setActiveTab("candidatures")} />
                        <SidebarItem icon={DollarSign} label="Finances" badge={stats?.pendingMoney || 0} active={activeTab === "finances"} onClick={() => setActiveTab("finances")} />
                        <SidebarItem icon={BadgeCheck} label="Étudiants Inscrits" active={activeTab === "students"} onClick={() => setActiveTab("students")} />
                        <SidebarItem icon={Settings} label="Paramètres" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-50">
                    <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"><LogOut className="w-4 h-4" /> Déconnexion</button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab === 'overview' ? 'Vue d\'ensemble' : activeTab === 'students' ? 'Registre des étudiants' : activeTab}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-slate-900">{user?.schoolName || "Mon Etablissement"}</div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Administrateur</div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-gray-200"><img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover" /></div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {renderContent()}
                </div>
            </main>

            {/* --- OVERLAYS --- */}
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
            {confirmModal.isOpen && <ConfirmationDialog title={confirmModal.title} message={confirmModal.message} onConfirm={confirmModal.onConfirm} onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} />}
            <FloatingAssistant isVisible={activeTab === 'candidatures'} onClick={() => setIsIAModalOpen(true)} />

            <FormationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveFormation} initialData={editingFormation} />
            <CandidatureModal isOpen={isCandidatureModalOpen} onClose={() => setIsCandidatureModalOpen(false)} candidat={selectedCandidat} onAction={handleCandidatureDecision} customActions={['Vu', 'En attente'].includes(selectedCandidat?.status) ? 'decision' : 'notify'} />
            <SelectionIAModal isOpen={isIAModalOpen} onClose={() => setIsIAModalOpen(false)} candidats={candidats} formations={formations} onApplySelection={handleApplyIASelection} />
        </div>
    );
}// Dans PaymentPage.js

const handlePay = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
        // --- 1. SÉCURISATION DU MONTANT ---
        let amount = 0;
        if (appData && appData.price) {
            // Si c'est une chaine "100 000 Ar", on garde que les chiffres
            if (typeof appData.price === 'string') {
                amount = parseFloat(appData.price.replace(/[^0-9.]/g, ''));
            } else {
                amount = parseFloat(appData.price);
            }
        }

        // Vérification critique
        if (isNaN(amount) || amount <= 0) {
            alert("Erreur : Le montant est invalide.");
            setIsProcessing(false);
            return;
        }

        // --- 2. SÉCURISATION DE L'ID ---
        const inscriptionId = parseInt(id);
        if (isNaN(inscriptionId)) {
            alert("Erreur : ID d'inscription introuvable.");
            setIsProcessing(false);
            return;
        }

        const isMobile = ['mvola', 'orange', 'airtel'].includes(method);
        
        // --- 3. PRÉPARATION DES DÉTAILS ---
        let paymentDetails = {};

        if (isMobile) {
            // Validation simple du téléphone
            if (!phone || phone.length < 5) {
                alert("Veuillez entrer un numéro de téléphone valide.");
                setIsProcessing(false);
                return;
            }

            paymentDetails = {
                telephone: phone.replace(/\s/g, ''), // On enlève les espaces
                operator: method.toUpperCase()
            };
        } else {
            paymentDetails = {
                nomCarte: cardName,
                numeroCarte: cardNumber,
                expiration: cardExpiry,
                cvc: cardCvc, 
                currency: "MGA"
            };
        }

        const payload = {
            id_inscription: inscriptionId,
            mode_paiement: "UNIQUE",
            methode_paiement: isMobile ? 'MOBILE_MONEY' : 'CARTE',
            raison_paiement: "INSCRIPTION",
            montant_total: amount, // On envoie le montant nettoyé
            details: paymentDetails 
        };

        console.log("Envoi au serveur :", payload); // AFFICHEZ CECI DANS LA CONSOLE POUR VÉRIFIER

        const response = await api.post("/paiements", payload);

        if (response.data.success) {
            setPaymentId(response.data.data?.paiement?.id_paiement); 
            setIsSuccess(true);
            window.scrollTo(0, 0);
        }

    } catch (error) {
        console.error("Erreur paiement:", error);
        // Affiche l'erreur renvoyée par le backend (ex: "Solde insuffisant")
        const serverMessage = error.response?.data?.message || "Erreur lors du paiement.";
        alert("Échec : " + serverMessage);
    } finally {
        setIsProcessing(false);
    }
};

// ==========================================
// TABS COMPONENTS (RESTORED ORIGINAL DESIGN)
// ==========================================

// --- CANDIDATURES ---
function CandidaturesTab({ candidats, onOpen, onOpenIA }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("Tous");
    const [viewMode, setViewMode] = useState("grid");

    const processedCandidats = candidats
        .filter(c => c.status !== 'Inscrit') // On ne montre pas les inscrits ici
        .filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.formation.toLowerCase().includes(searchTerm.toLowerCase());
            if (filterStatus === "Tous") return matchesSearch;
            if (filterStatus === "À traiter") return matchesSearch && ['En attente', 'Vu'].includes(c.status);
            return matchesSearch && c.status === filterStatus;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-900">Demandes d'admission</h3>
                    <button onClick={onOpenIA} className="bg-gradient-to-r from-[#370669] to-[#5b2299] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform"><Sparkles className="w-3.5 h-3.5 text-[#27b6d8]" /> Assistant IA</button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="bg-white p-1 rounded-xl border border-gray-200 flex">
                        <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#370669] text-white shadow-sm' : 'text-gray-400 hover:text-[#370669]'}`}><LayoutGrid className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#370669] text-white shadow-sm' : 'text-gray-400 hover:text-[#370669]'}`}><LayoutList className="w-4 h-4" /></button>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#370669] w-full sm:w-64 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    </div>
                    <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                        {["Tous", "À traiter", "Admis", "Refusé"].map((status) => (
                            <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === status ? 'bg-[#370669] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>{status}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedCandidats.map(c => (
                        <div key={c.id} onClick={() => onOpen(c)} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
                            <div className="absolute top-0 left-0 bg-gray-50 px-3 py-1.5 rounded-br-2xl border-b border-r border-gray-100"><span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {getRelativeTime(c.date)}</span></div>
                            {(c.status === 'Vu' || c.status === 'En attente') && <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-blue-100"><Eye className="w-3 h-3" /> {c.status === 'Vu' ? 'Vu' : 'Nouveau'}</div>}
                            <div className="flex items-center gap-4 mb-6 mt-4">
                                <img src={c.image} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                <div><h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{c.name}</h4><p className="text-xs text-gray-500">{c.formation}</p></div>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                {c.aiScore ? <span className="text-[10px] font-bold text-[#18B49C] bg-[#18B49C]/10 px-2 py-1 rounded-md">Score IA: {c.aiScore}</span> : <span className="text-[10px] font-bold text-gray-400">Reçu le {getRelativeTime(c.date)}</span>}
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${c.status === 'Admis' ? 'bg-purple-50 text-purple-600 border-purple-100' : c.status === 'Refusé' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>{c.status === 'Admis' ? 'Admissible' : c.status === 'Refusé' ? 'Archivé' : 'À Traiter'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                            <tr><th className="px-6 py-4">Candidat</th><th className="px-6 py-4">Formation</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-center">Rang IA</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4 text-right">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {processedCandidats.map(c => (
                                <tr key={c.id} onClick={() => onOpen(c)} className="hover:bg-gray-50 cursor-pointer group">
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={c.image} alt="" className="w-10 h-10 rounded-full object-cover" /><span className="font-bold text-slate-900 text-sm">{c.name}</span></div></td>
                                    <td className="px-6 py-4 text-xs text-gray-500 font-medium">{c.formation}</td>
                                    <td className="px-6 py-4 text-xs text-gray-400">{getRelativeTime(c.date)}</td>
                                    <td className="px-6 py-4 text-center">{c.aiRank ? <span className="inline-block w-6 h-6 rounded-full bg-[#18B49C]/10 text-[#18B49C] text-xs font-bold leading-6">{c.aiRank}</span> : <span className="text-gray-300">-</span>}</td>
                                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${c.status === 'Admis' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{c.status}</span></td>
                                    <td className="px-6 py-4 text-right"><button className="text-gray-300 hover:text-[#370669] transition-colors"><ArrowUpRight className="w-4 h-4" /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

// --- FORMATIONS ---
const isExpired = (endDateStr) => {
    if (!endDateStr) return false;
    const end = new Date(endDateStr);
    const today = new Date();
    end.setHours(23, 59, 59, 999);
    return today > end;
};

function FormationsTab({ formations, onCreate, onEdit, onDelete }) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Catalogue des formations</h3>
                <button onClick={onCreate} className="bg-gradient-to-r from-[#370669] to-[#5b2299] text-white px-5 py-3 rounded-xl text-sm font-bold flex gap-2 hover:shadow-lg transition-all"><Plus className="w-4 h-4" /> Créer</button>
            </div>

            {formations.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100">
                    <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">Aucune formation créée pour le moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {formations.map(f => {
                        const expired = isExpired(f.date_fin);
                        const imageUrl = f.image_url ? `${API_BASE_URL}/${f.image_url}` : null;

                        return (
                            <div key={f.id_formation} onClick={() => onEdit(f)} className={`group bg-white p-4 rounded-2xl border ${expired ? 'border-red-100 bg-red-50/10' : 'border-gray-100'} shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-6 relative overflow-hidden`}>
                                {expired && <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider">Expiré</div>}

                                <div className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative ${expired ? 'grayscale opacity-70' : ''}`}>
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={f.titre} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                                            <BookOpen className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex justify-between items-center pr-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-[#27b6d8] uppercase tracking-wider">{f.niveau || "Formation"}</span>
                                                {f.nbr_max_etudiant && (
                                                    <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 flex items-center gap-1">
                                                        <Users className="w-3 h-3" /> {f.nbr_max_etudiant} places
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className={`text-lg font-bold mb-1 ${expired ? 'text-gray-500 line-through' : 'text-slate-900'}`}>{f.titre}</h4>
                                            <p className="text-sm text-gray-500">{f._count?.inscriptions || 0} étudiants inscrits</p>
                                        </div>
                                        <div className="text-right flex items-center gap-6">
                                            <div>
                                                <span className="block font-bold text-slate-900">{f.prix ? new Intl.NumberFormat('fr-FR').format(f.prix) + " Ar" : "Gratuit"}</span>
                                                {!expired && <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${f.statut === 'ACTIF' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{f.statut === 'ACTIF' ? 'Publié' : 'Brouillon'}</span>}
                                            </div>
                                            <button onClick={(e) => onDelete(f.id_formation, e)} className="p-3 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// --- OVERVIEW ---
function OverviewTab({ stats, transactions, goToFinances }) {
    const safeStats = stats || { totalStudents: 0, pendingReview: 0, pendingMoney: 0, revenue: 0 };
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Inscrits Définitifs" value={safeStats.totalStudents} icon={BadgeCheck} color="#18B49C" trend="+12%" />
                <StatCard title="Dossiers à traiter" value={safeStats.pendingReview} icon={FileText} color="#f59e0b" trend="Urgent" />
                <StatCard title="Paiements en attente" value={safeStats.pendingMoney} icon={DollarSign} color="#370669" trend="Action" />
                <StatCard title="Chiffre d'affaires" value={`${((safeStats.revenue || 0) / 1000000).toFixed(1)} M Ar`} icon={ArrowUpRight} color="#27b6d8" trend="+5%" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[300px]">
                    <div className="flex justify-between items-center mb-8"><div><h3 className="font-bold text-slate-900 text-lg">Évolution</h3><p className="text-xs text-gray-400">Année 2024-2025</p></div></div>
                    <div className="flex items-end justify-between h-48 w-full gap-4 px-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 65].map((h, i) => (
                            <div key={i} className="w-full bg-gray-50 rounded-t-lg relative group h-full flex items-end"><div style={{ height: `${h}%` }} className="w-full bg-[#27b6d8] rounded-t-lg opacity-80 group-hover:opacity-100 transition-all duration-500 relative"></div></div>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6 relative z-10"><h3 className="font-bold text-slate-900">Activité Financière</h3><button onClick={goToFinances} className="text-xs text-[#27b6d8] font-bold hover:underline">Voir tout</button></div>
                    <div className="space-y-4 relative z-10">
                        {transactions.filter(t => t.status === 'En attente').length === 0 ? <div className="text-center py-10 text-gray-400 text-sm">Aucune transaction en attente.</div> : transactions.filter(t => t.status === 'En attente').map(t => (
                            <div key={t.id} onClick={goToFinances} className="p-4 bg-orange-50 hover:bg-orange-100 rounded-2xl border border-orange-100 cursor-pointer transition-colors group">
                                <p className="text-sm font-bold text-slate-900">{t.studentName} a payé</p>
                                <div className="flex justify-between items-center"><p className="text-xs text-gray-500">{t.formation}</p><span className="font-bold text-slate-900">{t.amount}</span></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- STUDENT CARDS ---
function StudentCardsTab({ candidats }) {
    // On considère comme "Inscrits" ceux qui sont inscrits ou admis (selon votre logique métier)
    const enrolled = candidats.filter(c => c.status === 'Inscrit' || c.status === 'Inscrit');
    const [filterName, setFilterName] = useState("");
    const [selected, setSelected] = useState(null);
    const [visibleCount, setVisibleCount] = useState(5);

    // Initialisation du premier sélectionné si la liste change
    useEffect(() => {
        if (enrolled.length > 0 && !selected) setSelected(enrolled[0]);
    }, [candidats]);

    const filteredEnrolled = enrolled.filter(s => s.name.toLowerCase().includes(filterName.toLowerCase()) || s.formation.toLowerCase().includes(filterName.toLowerCase()));
    const visibleStudents = filteredEnrolled.slice(0, visibleCount);

    return (
        <div className="flex flex-col gap-6 h-[calc(100vh-150px)] animate-fadeIn">
            <div className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-shrink-0">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
                    <input type="text" placeholder="Rechercher par nom, formation..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none text-sm outline-none focus:ring-2 focus:ring-[#370669]/20" value={filterName} onChange={(e) => setFilterName(e.target.value)} />
                </div>
                <button className="bg-white border border-gray-200 px-6 rounded-xl font-bold text-sm text-slate-700 hover:bg-gray-50 flex items-center gap-2"><Filter className="w-4 h-4" /> Date</button>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
                <div className="w-full lg:w-1/3 bg-white rounded-[2rem] border border-gray-100 p-6 flex flex-col shadow-sm">
                    <div className="mb-4 flex-shrink-0 flex justify-between items-center"><span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{filteredEnrolled.length} Étudiants</span></div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                        {visibleStudents.map(s => (
                            <div key={s.id} onClick={() => setSelected(s)} className={`p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border ${selected?.id === s.id ? 'bg-[#27b6d8] border-[#27b6d8] text-white shadow-lg' : 'bg-white border-gray-100 hover:border-[#27b6d8]/30 hover:bg-gray-50'}`}>
                                <img src={s.image} className="w-10 h-10 rounded-full bg-white/20" alt="" />
                                <div><div className={`font-bold text-sm ${selected?.id === s.id ? 'text-white' : 'text-slate-900'}`}>{s.name}</div><div className={`text-xs ${selected?.id === s.id ? 'text-white/70' : 'text-gray-500'}`}>{s.formation}</div></div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center gap-4 flex-shrink-0">
                        {visibleCount < filteredEnrolled.length && <button onClick={() => setVisibleCount(p => p + 5)} className="text-xs font-bold text-[#27b6d8] hover:underline">Voir plus</button>}
                        {visibleCount > 5 && <button onClick={() => setVisibleCount(5)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Voir moins</button>}
                    </div>
                </div>
                <div className="flex-1 bg-white rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center p-8 shadow-sm relative overflow-hidden">
                    {selected ? (
                        <div className="animate-scaleIn w-full max-w-md">
                            <div className="text-center mb-4"><p className="text-gray-500 text-sm">Inscrit le {getRelativeTime(selected.date)}</p></div>
                            <div className="w-full aspect-[1.6] bg-gradient-to-br from-[#370669] to-[#5b2299] rounded-2xl shadow-2xl relative overflow-hidden text-white p-6 flex flex-col justify-between mb-8 transform transition-transform hover:scale-[1.02] duration-500">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-3"><div className="p-2 bg-white/20 rounded-lg backdrop-blur-md"><Building2 className="w-5 h-5 text-white" /></div><div><span className="font-bold text-sm tracking-wide block">EduManager School</span><span className="text-[10px] text-white/70 uppercase tracking-widest">Carte Étudiant 2025</span></div></div>
                                    <img src={selected.image} className="w-16 h-16 rounded-xl border-2 border-white/30 object-cover bg-white" alt="" />
                                </div>
                                <div className="z-10">
                                    <h2 className="text-2xl font-bold leading-tight mb-1">{selected.name}</h2>
                                    <p className="text-xs text-white/70 uppercase tracking-wider mb-4">Niveau {selected.formation}</p>
                                    <div className="grid grid-cols-2 gap-4 text-[10px] text-white/80"><div><span className="block opacity-50 uppercase">Matricule</span><span className="font-mono text-sm">{selected.matricule || "EN COURS"}</span></div><div><span className="block opacity-50 uppercase">CIN / ID</span><span className="font-mono text-sm">{selected.cin || "N/A"}</span></div></div>
                                </div>
                            </div>
                        </div>
                    ) : <div className="text-center text-gray-400"><Users className="w-16 h-16 mx-auto mb-4 opacity-10" /><p>Sélectionnez un étudiant.</p></div>}
                </div>
            </div>
        </div>
    );
}

// --- FINANCES ---
function FinancesTab({ transactions, onValidate }) {
    
    // Petite fonction pour gérer l'affichage (Couleur + Texte)
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'VALIDEE':
                return { label: 'Validé', className: 'bg-green-50 text-green-600 border border-green-100' };
            case 'PAYE':
                // C'est ici le changement important : PAYE = Action requise
                return { label: 'À Valider', className: 'bg-orange-50 text-orange-600 border border-orange-100' };
            case 'ECHEC':
                return { label: 'Échec', className: 'bg-red-50 text-red-600 border border-red-100' };
            default:
                return { label: status, className: 'bg-gray-50 text-gray-600 border border-gray-100' };
        }
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900">Paiements Recus</h3>
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="px-8 py-5">Réf</th>
                            <th className="px-8 py-5">Candidat</th>
                            <th className="px-8 py-5">Montant</th>
                            <th className="px-8 py-5">Statut</th>
                            <th className="px-8 py-5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map(tx => {
                            // On récupère la config d'affichage pour cette ligne
                            const statusConfig = getStatusDisplay(tx.status);

                            return (
                                <tr key={tx.id} className="hover:bg-gray-50/50">
                                    <td className="px-8 py-5 text-xs font-mono text-gray-500">#{tx.ref || tx.id}</td>
                                    
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-sm text-slate-900">{tx.studentName}</div>
                                        <div className="text-[10px] text-gray-400">{tx.formation}</div>
                                    </td>
                                    
                                    <td className="px-8 py-5 font-bold text-slate-800">{tx.amount}</td>
                                    
                                    {/* COLONNE STATUT MODIFIÉE */}
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${statusConfig.className}`}>
                                            {statusConfig.label}
                                        </span>
                                    </td>
                                    
                                    {/* COLONNE ACTION MODIFIÉE */}
                                    <td className="px-8 py-5 text-right">
                                        {/* On affiche le bouton SI le statut est 'PAYE' (donc à valider) */}
                                        {tx.status === 'PAYE' && (
                                            <button 
                                                onClick={() => onValidate(tx.id, tx.inscriptionId)} 
                                                className="bg-[#27b6d8] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1fa0bc] shadow-md transition-all"
                                            >
                                                Confirmer
                                            </button>
                                        )}
                                        {tx.status === 'VALIDEE' && (
                                            <span className="text-xs text-green-600 font-bold flex items-center justify-end gap-1">
                                                Ok
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
// --- UTILS ---
const getRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 14) return "Il y a 1 semaine";
    return "Il y a +2 semaines";
};

// --- DIALOGS & HELPERS ---
function ConfirmationDialog({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-scaleIn text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-[60px] opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertTriangle className="w-8 h-8" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">{message}</p>
                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 bg-gray-50 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">Annuler</button>
                    <button onClick={onConfirm} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">Confirmer</button>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, active, onClick, badge }) {
    return <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${active ? 'bg-[#27b6d8] text-white shadow-md shadow-[#27b6d8]/25' : 'text-gray-500 hover:bg-gray-50 hover:text-[#27b6d8]'}`}><div className="flex items-center gap-3"><Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} /> {label}</div>{badge > 0 && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{badge}</span>}</button>;
}
function StatCard({ title, value, icon: Icon, color, trend }) {
    return <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all"><div className="flex justify-between items-start mb-4"><div className="p-3 rounded-2xl bg-gray-50 text-white" style={{ backgroundColor: color }}><Icon className="w-5 h-5" /></div>{trend && <span className="text-[10px] font-bold bg-gray-50 px-2 py-1 rounded-full text-slate-600">{trend}</span>}</div><h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3><p className="text-xs text-gray-500 font-medium">{title}</p></div>;
}