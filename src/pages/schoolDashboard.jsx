import React, { useState } from "react";
import { 
  LayoutDashboard, BookOpen, Users, CreditCard, Settings, LogOut, 
  Plus, Trash2, Eye, CheckCircle2, FileText, 
  Building2, Globe, Mail, Phone, Download, 
  DollarSign, Search, Calendar, Filter, ArrowUpRight, BadgeCheck, Bell, Clock, AlertTriangle, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormationModal from "../components/FormationModal"; 
import CandidatureModal from "../components/CandidatureModal";
import Toast from "../components/Toast";

// ==========================================
// MOCK DATA
// ==========================================
const INITIAL_FORMATIONS = [
  { id: 1, title: "Master Développement Web", level: "Master", students: 12, status: "Publié", price: "4 500 000 Ar", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085" },
  { id: 2, title: "Licence Marketing Digital", level: "Licence", students: 5, status: "Brouillon", price: "3 200 000 Ar", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0" },
];

const MOCK_CANDIDATS = [
  { id: 101, name: "Jean Dupont", formation: "Master Web", date: "2026-01-08", status: "En attente", image: "https://i.pravatar.cc/150?u=101", email: "jean@test.com" },
  { id: 102, name: "Sarah Connor", formation: "Licence Marketing", date: "2026-01-05", status: "Admis", image: "https://i.pravatar.cc/150?u=102", email: "sarah@test.com" },
  { id: 104, name: "Alice Merveille", formation: "Master Web", date: "2026-01-01", status: "Inscrit", image: "https://i.pravatar.cc/150?u=104", cin: "101 234 567 890", matricule: "2025-WEB-001" },
  { id: 105, name: "John Doe", formation: "Licence Marketing", date: "2025-12-28", status: "Refusé", image: "https://i.pravatar.cc/150?u=105" },
  { id: 106, name: "Lucas Sky", formation: "Master Web", date: "2026-01-07", status: "Vu", image: "https://i.pravatar.cc/150?u=106" },
];

const MOCK_TRANSACTIONS = [
  { id: "TX-99821", studentId: 102, studentName: "Sarah Connor", amount: "900 000 Ar", date: "Aujourd'hui", type: "MVola", status: "En attente", formation: "Licence Marketing" },
  { id: "TX-77340", studentId: 104, studentName: "Alice Merveille", amount: "900 000 Ar", date: "02 Jan 2025", type: "Carte Bancaire", status: "Validé", formation: "Master Web" },
];

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function SchoolDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // Navigation & Data
  const [activeTab, setActiveTab] = useState("overview");
  const [formations, setFormations] = useState(INITIAL_FORMATIONS);
  const [candidats, setCandidats] = useState(MOCK_CANDIDATS);
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  // UI States (Toast & Confirmation)
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });

  // --- HELPERS UI ---
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4500);
  };

  const openConfirmation = (title, message, onConfirmAction) => {
    setConfirmModal({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
            onConfirmAction();
            setConfirmModal({ ...confirmModal, isOpen: false });
        }
    });
  };

  // --- LOGIQUE METIER ---

  const stats = {
    totalStudents: candidats.filter(c => c.status === 'Inscrit').length, 
    pendingReview: candidats.filter(c => ['En attente', 'Vu'].includes(c.status)).length,
    pendingMoney: transactions.filter(t => t.status === 'En attente').length,
    revenue: transactions.filter(t => t.status === 'Validé').length * 900000, 
  };

  // 1. Validation Paiement
  const handleValidateTransaction = (txId, studentId) => {
    openConfirmation(
        "Valider le paiement ?",
        "Cette action est irréversible. L'étudiant sera inscrit définitivement.",
        () => {
            setTransactions(transactions.map(t => t.id === txId ? { ...t, status: "Validé" } : t));
            setCandidats(candidats.map(c => c.id === studentId ? { ...c, status: "Inscrit", matricule: `2025-${Math.floor(Math.random()*1000)}` } : c));
            showToast("success", "Paiement validé ! L'étudiant est inscrit.");
        }
    );
  };

  // 2. Décision Candidature
  const handleCandidatureDecision = (id, decision) => {
    if (decision === 'Notifier') {
        showToast("info", "Rappel envoyé à l'étudiant avec succès.");
        setIsCandidatureModalOpen(false);
        return;
    }
    setCandidats(candidats.map(c => c.id === id ? { ...c, status: decision } : c));
    setIsCandidatureModalOpen(false);
    showToast(decision === 'Admis' ? 'success' : 'warning', `Dossier ${decision === 'Admis' ? 'accepté' : 'refusé'}.`);
  };

  // 3. Gestion Formations
  const handleSaveFormation = (data) => {
    if (editingFormation) {
      setFormations(formations.map(f => f.id === editingFormation.id ? { ...f, ...data } : f));
      showToast("success", "Formation mise à jour.");
    } else {
      setFormations([{ id: Date.now(), ...data, students: 0, status: data.status || "Publié" }, ...formations]);
      showToast("success", data.status === "Brouillon" ? "Brouillon sauvegardé." : "Formation publiée !");
    }
  };

  const handleDeleteFormation = (id, e) => {
    e.stopPropagation();
    openConfirmation(
        "Supprimer la formation ?",
        "Êtes-vous sûr ? Cette action retirera la formation du catalogue.",
        () => {
            setFormations(formations.filter(f => f.id !== id));
            showToast("info", "Formation supprimée.");
        }
    );
  };

  // --- MODALS STATES ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [isCandidatureModalOpen, setIsCandidatureModalOpen] = useState(false);
  const [selectedCandidat, setSelectedCandidat] = useState(null);

  const openCandidature = (candidat) => {
    if (candidat.status === "En attente") {
        const updated = candidats.map(c => c.id === candidat.id ? { ...c, status: "Vu" } : c);
        setCandidats(updated);
        setSelectedCandidat({ ...candidat, status: "Vu" });
    } else {
        setSelectedCandidat(candidat);
    }
    setIsCandidatureModalOpen(true);
  };

  // --- RENDER ---
  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <OverviewTab stats={stats} transactions={transactions} goToFinances={() => setActiveTab('finances')} />;
      case "formations": return <FormationsTab formations={formations} onCreate={() => {setEditingFormation(null); setIsModalOpen(true)}} onEdit={(f) => {setEditingFormation(f); setIsModalOpen(true)}} onDelete={handleDeleteFormation} />;
      case "candidatures": return <CandidaturesTab candidats={candidats} onOpen={openCandidature} />;
      case "finances": return <FinancesTab transactions={transactions} onValidate={handleValidateTransaction} />;
      case "students": return <StudentCardsTab candidats={candidats} />;
      case "settings": return <div className="p-10 text-gray-400">Paramètres</div>;
      default: return <OverviewTab stats={stats} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-poppins text-slate-800 overflow-hidden">
      
      {/* SIDEBAR (DESIGN RESTAURÉ : BLANC) */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between z-20 shadow-sm flex-shrink-0">
        <div>
          <div className="p-8 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#27b6d8] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#27b6d8]/20">E</div>
             <span className="font-bold text-lg text-slate-800 tracking-tight">EduManager</span>
          </div>
          <nav className="px-4 space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
            <SidebarItem icon={BookOpen} label="Mes Formations" active={activeTab === "formations"} onClick={() => setActiveTab("formations")} />
            <SidebarItem icon={Users} label="Candidatures" badge={stats.pendingReview} active={activeTab === "candidatures"} onClick={() => setActiveTab("candidatures")} />
            <SidebarItem icon={DollarSign} label="Finances" badge={stats.pendingMoney} active={activeTab === "finances"} onClick={() => setActiveTab("finances")} />
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
            <h2 className="text-xl font-bold text-slate-900 capitalize">{activeTab === 'overview' ? 'Vue d\'ensemble' : activeTab === 'students' ? 'Registre des étudiants' : activeTab}</h2>
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
      
      {/* Toast Notification */}
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
          <ConfirmationDialog 
              title={confirmModal.title} 
              message={confirmModal.message} 
              onConfirm={confirmModal.onConfirm} 
              onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })} 
          />
      )}

      {/* Feature Modals */}
      <FormationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSaveFormation} initialData={editingFormation} />
      <CandidatureModal 
        isOpen={isCandidatureModalOpen} 
        onClose={() => setIsCandidatureModalOpen(false)} 
        candidat={selectedCandidat} 
        onAction={handleCandidatureDecision} 
        customActions={['Vu', 'En attente'].includes(selectedCandidat?.status) ? 'decision' : 'notify'}
      />
    </div>
  );
}

// ==========================================
// 2. CANDIDATURES (TRI, RECHERCHE, FILTRE)
// ==========================================

// Fonction utilitaire Date Relative
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
    if (diffDays < 30) return "Il y a +2 semaines";
    return "Il y a +1 mois";
};

function CandidaturesTab({ candidats, onOpen }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("Tous"); // 'Tous', 'À traiter', 'Admis', 'Refusé'

    // LOGIQUE DE TRI ET FILTRAGE
    const processedCandidats = candidats
        .filter(c => c.status !== 'Inscrit') // On exclut les inscrits définitifs
        .filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  c.formation.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (filterStatus === "Tous") return matchesSearch;
            if (filterStatus === "À traiter") return matchesSearch && ['En attente', 'Vu'].includes(c.status);
            return matchesSearch && c.status === filterStatus;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // Tri Descendant (Plus récent en premier)

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header avec Recherche et Filtres */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">Demandes d'admission</h3>
                
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#370669] w-full sm:w-64 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                        {["Tous", "À traiter", "Admis", "Refusé"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    filterStatus === status 
                                    ? 'bg-[#370669] text-white shadow-sm' 
                                    : 'text-gray-500 hover:bg-gray-50'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grille Candidats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedCandidats.length > 0 ? (
                    processedCandidats.map(c => (
                        <div key={c.id} onClick={() => onOpen(c)} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
                            
                            {/* Time Badge */}
                            <div className="absolute top-0 left-0 bg-gray-50 px-3 py-1.5 rounded-br-2xl border-b border-r border-gray-100">
                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {getRelativeTime(c.date)}
                                </span>
                            </div>

                            {/* Status Badge (Vu/Nouveau) */}
                            {(c.status === 'Vu' || c.status === 'En attente') && (
                                <div className="absolute top-4 right-4 bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-blue-100">
                                    <Eye className="w-3 h-3" /> {c.status === 'Vu' ? 'Vu' : 'Nouveau'}
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-6 mt-4">
                                <img src={c.image} alt="" className="w-14 h-14 rounded-2xl object-cover shadow-sm" />
                                <div>
                                    <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{c.name}</h4>
                                    <p className="text-xs text-gray-500">{c.formation}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-bold text-gray-400">Reçu le {c.date}</span>
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                    c.status === 'Admis' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                    c.status === 'Refusé' ? 'bg-red-50 text-red-600 border-red-100' : 
                                    'bg-gray-50 text-gray-600 border-gray-200'
                                }`}>
                                    {c.status === 'Admis' ? 'Admissible' : c.status === 'Refusé' ? 'Archivé' : 'À Traiter'}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Search className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">Aucun dossier ne correspond à votre recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ==========================================
// 3. AUTRES TABS & HELPERS
// ==========================================

// Fonction utilitaire expiration
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
                <button onClick={onCreate} className="bg-[#27b6d8] text-white px-5 py-3 rounded-xl text-sm font-bold flex gap-2 hover:shadow-lg transition-all"><Plus className="w-4 h-4"/> Créer</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {formations.map(f => {
                    const expired = isExpired(f.endDate);
                    return (
                        <div key={f.id} onClick={() => onEdit(f)} className={`group bg-white p-4 rounded-2xl border ${expired ? 'border-red-100 bg-red-50/10' : 'border-gray-100'} shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-6 relative overflow-hidden`}>
                            {expired && <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-wider">Expiré</div>}
                            <div className={`w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 relative ${expired ? 'grayscale opacity-70' : ''}`}>
                                {f.image ? <img src={typeof f.image === 'string' ? f.image : URL.createObjectURL(f.image)} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" /> : <BookOpen className="w-8 h-8 text-gray-300 m-auto"/>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center pr-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-[#27b6d8] uppercase tracking-wider">{f.level}</span>
                                            {expired && <span className="bg-red-100 text-red-600 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Expiré</span>}
                                        </div>
                                        <h4 className={`text-lg font-bold mb-1 ${expired ? 'text-gray-500 line-through' : 'text-slate-900'}`}>{f.title}</h4>
                                        <p className="text-sm text-gray-500">{f.students} étudiants inscrits</p>
                                    </div>
                                    <div className="text-right flex items-center gap-6">
                                        <div>
                                            <span className="block font-bold text-slate-900">{f.price}</span>
                                            {!expired && <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 ${f.status === 'Publié' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{f.status}</span>}
                                        </div>
                                        {expired && <button onClick={(e) => onDelete(f.id, e)} className="p-3 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100" title="Supprimer la formation"><Trash2 className="w-5 h-5" /></button>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function StudentCardsTab({ candidats }) {
    const enrolled = candidats.filter(c => c.status === 'Inscrit');
    const [filterName, setFilterName] = useState("");
    const [selected, setSelected] = useState(enrolled[0] || null);
    const [visibleCount, setVisibleCount] = useState(5);

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
                            <div className="text-center mb-4"><p className="text-gray-500 text-sm">Inscrit le {selected.date}</p></div>
                            <div className="w-full aspect-[1.6] bg-gradient-to-br from-[#370669] to-[#5b2299] rounded-2xl shadow-2xl relative overflow-hidden text-white p-6 flex flex-col justify-between mb-8 transform transition-transform hover:scale-[1.02] duration-500">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="flex justify-between items-start z-10">
                                    <div className="flex items-center gap-3"><div className="p-2 bg-white/20 rounded-lg backdrop-blur-md"><Building2 className="w-5 h-5 text-white" /></div><div><span className="font-bold text-sm tracking-wide block">EduManager School</span><span className="text-[10px] text-white/70 uppercase tracking-widest">Carte Étudiant 2025</span></div></div>
                                    <img src={selected.image} className="w-16 h-16 rounded-xl border-2 border-white/30 object-cover bg-white" alt="" />
                                </div>
                                <div className="z-10">
                                    <h2 className="text-2xl font-bold leading-tight mb-1">{selected.name}</h2>
                                    <p className="text-xs text-white/70 uppercase tracking-wider mb-4">Niveau {selected.formation}</p>
                                    <div className="grid grid-cols-2 gap-4 text-[10px] text-white/80"><div><span className="block opacity-50 uppercase">Matricule</span><span className="font-mono text-sm">{selected.matricule}</span></div><div><span className="block opacity-50 uppercase">CIN / ID</span><span className="font-mono text-sm">{selected.cin}</span></div></div>
                                </div>
                            </div>
                        </div>
                    ) : <div className="text-center text-gray-400"><Users className="w-16 h-16 mx-auto mb-4 opacity-10" /><p>Sélectionnez un étudiant.</p></div>}
                </div>
            </div>
        </div>
    );
}

function OverviewTab({ stats, transactions, goToFinances }) {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Inscrits Définitifs" value={stats.totalStudents} icon={BadgeCheck} color="#18B49C" trend="+12%" />
                <StatCard title="Dossiers à traiter" value={stats.pendingReview} icon={FileText} color="#f59e0b" trend="Urgent" />
                <StatCard title="Paiements en attente" value={stats.pendingMoney} icon={DollarSign} color="#370669" trend="Action" />
                <StatCard title="Chiffre d'affaires" value={`${(stats.revenue/1000000).toFixed(1)} M Ar`} icon={ArrowUpRight} color="#27b6d8" trend="+5%" />
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

function FinancesTab({ transactions, onValidate }) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900">Paiements</h3>
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100"><tr><th className="px-8 py-5">Réf</th><th className="px-8 py-5">Candidat</th><th className="px-8 py-5">Montant</th><th className="px-8 py-5">Statut</th><th className="px-8 py-5 text-right">Action</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-gray-50/50"><td className="px-8 py-5 text-xs font-mono text-gray-500">#{tx.id}</td><td className="px-8 py-5"><div className="font-bold text-sm text-slate-900">{tx.studentName}</div><div className="text-[10px] text-gray-400">{tx.formation}</div></td><td className="px-8 py-5 font-bold text-slate-800">{tx.amount}</td><td className="px-8 py-5"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${tx.status === 'Validé' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>{tx.status}</span></td><td className="px-8 py-5 text-right">{tx.status === 'En attente' && <button onClick={() => onValidate(tx.id, tx.studentId)} className="bg-[#27b6d8] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1fa0bc] shadow-md transition-all">Confirmer</button>}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- NEW COMPONENT: CONFIRMATION DIALOG (HAUT DE GAMME) ---
function ConfirmationDialog({ title, message, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-scaleIn text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-full blur-[60px] opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8" />
                </div>
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
    return <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all"><div className="flex justify-between items-start mb-4"><div className="p-3 rounded-2xl bg-gray-50 text-white" style={{backgroundColor: color}}><Icon className="w-5 h-5" /></div>{trend && <span className="text-[10px] font-bold bg-gray-50 px-2 py-1 rounded-full text-slate-600">{trend}</span>}</div><h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3><p className="text-xs text-gray-500 font-medium">{title}</p></div>;
}