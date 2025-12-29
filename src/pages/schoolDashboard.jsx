import React, { useState } from "react";
import { 
  LayoutDashboard, BookOpen, Users, CreditCard, Settings, LogOut, 
  Plus, Trash2, CheckCircle, XCircle, FileText, 
  Building2, Globe, Mail, Phone, AlertCircle, Download, 
  DollarSign, MapPin, Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FormationModal from "../components/FormationModal"; 

// ==========================================
// MOCK DATA (Données simulées)
// ==========================================
const MOCK_STATS = {
  totalStudents: 1240,
  pendingApplications: 45,
  revenue: "125.000 €",
  growth: "+12%"
};

const INITIAL_FORMATIONS = [
  { 
    id: 1, 
    title: "Master Développement Web", 
    level: "Master", 
    students: 120, 
    status: "Publié", 
    price: "4 500 000 Ar", 
    category: "Informatique",
    duration: "2 ans",
    mode: "Présentiel",
    city: "Antananarivo",
    country: "Madagascar",
    conditions: ["Bac+3 Informatique", "Entretien"],
    description: "Formation avancée pour devenir architecte logiciel."
  },
  { 
    id: 2, 
    title: "Licence Marketing Digital", 
    level: "Licence", 
    students: 85, 
    status: "Brouillon", 
    price: "3 200 000 Ar", 
    category: "Marketing",
    duration: "3 ans",
    mode: "Hybride",
    city: "Antananarivo",
    country: "Madagascar",
    conditions: ["Baccalauréat"],
    description: "Les fondamentaux du marketing à l'ère du numérique."
  },
];

const MOCK_CANDIDATS = [
  { id: 101, name: "Jean Dupont", formation: "Master Web", date: "05 Jan 2025", status: "En attente", image: "https://i.pravatar.cc/150?u=101" },
  { id: 102, name: "Sarah Connor", formation: "Licence Marketing", date: "04 Jan 2025", status: "Admis", image: "https://i.pravatar.cc/150?u=102" },
  { id: 103, name: "John Doe", formation: "Master Web", date: "06 Jan 2025", status: "Refusé", image: "https://i.pravatar.cc/150?u=103" },
];

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================
export default function SchoolDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  // États de navigation et données
  const [activeTab, setActiveTab] = useState("overview");
  const [formations, setFormations] = useState(INITIAL_FORMATIONS);
  const [candidats, setCandidats] = useState(MOCK_CANDIDATS);
  
  // États pour le Modal (Création / Édition)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);

  // --- LOGIQUE FORMATIONS (CRUD) ---

  // 1. Ouvrir Modal pour CRÉATION
  const openCreateModal = () => {
    setEditingFormation(null); // Pas de données initiales
    setIsModalOpen(true);
  };

  // 2. Ouvrir Modal pour ÉDITION (Clic sur une ligne)
  const openEditModal = (formation) => {
    setEditingFormation(formation); // On passe les données existantes
    setIsModalOpen(true);
  };

  // 3. Sauvegarder (Gère Création ET Modification)
  const handleSaveFormation = (formData) => {
    if (editingFormation) {
      // Mode UPDATE : On remplace l'élément existant
      const updatedFormations = formations.map(f => 
        f.id === editingFormation.id ? { ...f, ...formData } : f
      );
      setFormations(updatedFormations);
    } else {
      // Mode CREATE : On ajoute au début
      const newFormation = {
        id: Date.now(),
        ...formData,
        students: 0,
        status: "Publié",
      };
      setFormations([newFormation, ...formations]);
    }
  };

  // 4. Supprimer une formation
  const handleDeleteFormation = (id, e) => {
    e.stopPropagation(); // Empêche le clic sur la ligne (qui ouvrirait l'édition)
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
      setFormations(formations.filter(f => f.id !== id));
    }
  };

  // --- LOGIQUE AUTRES TABS ---
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateUser({ 
        schoolName: e.target.schoolName.value,
        email: e.target.email.value,
        website: e.target.website.value 
    });
    alert("Profil mis à jour !");
  };

  // Rendu du contenu principal
  const renderContent = () => {
    switch (activeTab) {
      case "overview": 
        return <OverviewTab formations={formations} stats={MOCK_STATS} />;
      case "formations": 
        return <FormationsTab 
                  formations={formations} 
                  onOpenCreate={openCreateModal}
                  onEditRow={openEditModal}
                  onDelete={handleDeleteFormation}
               />;
      case "candidatures": 
        return <CandidaturesTab candidats={candidats} setCandidats={setCandidats} />;
      case "students": 
        return <StudentCardsTab candidats={candidats} />;
      case "settings": 
        return <SettingsTab user={user} onSave={handleProfileUpdate} />;
      default: 
        return <OverviewTab formations={formations} stats={MOCK_STATS} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-poppins text-slate-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between z-20 shadow-sm flex-shrink-0">
        <div>
          <div className="p-8 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#27b6d8] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#27b6d8]/20">
                E
             </div>
             <span className="font-bold text-lg text-slate-800 tracking-tight">EduManager</span>
          </div>

          <nav className="px-4 space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} />
            <SidebarItem icon={BookOpen} label="Mes Formations" active={activeTab === "formations"} onClick={() => setActiveTab("formations")} />
            <SidebarItem icon={Users} label="Candidatures" badge={candidats.filter(c=>c.status==='En attente').length} active={activeTab === "candidatures"} onClick={() => setActiveTab("candidatures")} />
            <SidebarItem icon={CreditCard} label="Cartes Étudiants" active={activeTab === "students"} onClick={() => setActiveTab("students")} />
            <SidebarItem icon={Settings} label="Paramètres école" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-50">
           <button onClick={() => { logout(); navigate('/'); }} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold">
              <LogOut className="w-4 h-4" /> Déconnexion
           </button>
        </div>
      </aside>

      {/* MAIN LAYOUT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab === 'overview' ? 'Vue d\'ensemble' : activeTab}</h2>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <div className="text-sm font-bold text-slate-900">{user?.schoolName || "Mon Etablissement"}</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Administrateur</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-gray-200">
                    <img src="https://images.unsplash.com/photo-1523050853023-8c2d275438b3?auto=format&fit=crop&q=80" alt="Profile" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {renderContent()}
        </div>
      </main>

      {/* MODAL GLOBAL (Hors du main pour le z-index) */}
      <FormationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSaveFormation} 
        initialData={editingFormation}
      />
    </div>
  );
}

// ==========================================
// SOUS-COMPOSANTS (TABS)
// ==========================================

// 1. VUE D'ENSEMBLE
function OverviewTab({ formations, stats }) {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="bg-[#370669] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-[#370669]/10">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl font-bold mb-4">Bienvenue sur votre espace ! 👋</h1>
                    <p className="text-white/80 mb-6 leading-relaxed">
                        Gérez vos formations, suivez les candidatures et administrez votre établissement depuis ce tableau de bord centralisé.
                    </p>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#27b6d8]/20 to-transparent"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#27b6d8] rounded-full blur-[100px] opacity-30"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Étudiants Inscrits" value={stats.totalStudents} icon={Users} trend="+5%" color="#370669" />
                <StatCard title="Candidatures" value={stats.pendingApplications} icon={FileText} trend="+12 this week" color="#f59e0b" />
                <StatCard title="Formations Actives" value={formations.length} icon={BookOpen} color="#27b6d8" />
                <StatCard title="Revenus (Est.)" value={stats.revenue} icon={DollarSign} trend={stats.growth} color="#10b981" />
            </div>
        </div>
    );
}

// 2. FORMATIONS (Tableau Cliquable)
function FormationsTab({ formations, onOpenCreate, onEditRow, onDelete }) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Catalogue des formations</h3>
                    <p className="text-sm text-gray-500">Cliquez sur une ligne pour modifier.</p>
                </div>
                <button 
                    onClick={onOpenCreate}
                    className="bg-[#27b6d8] hover:bg-[#219ebd] text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors shadow-lg shadow-[#27b6d8]/30"
                >
                    <Plus className="w-4 h-4" /> Nouvelle Formation
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                            <th className="px-6 py-4 font-bold">Formation</th>
                            <th className="px-6 py-4 font-bold">Niveau</th>
                            <th className="px-6 py-4 font-bold">Prix</th>
                            <th className="px-6 py-4 font-bold">Statut</th>
                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {formations.map((formation) => (
                            <tr 
                                key={formation.id} 
                                onClick={() => onEditRow(formation)} // CLIC LIGNE -> EDIT
                                className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                            >
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800">{formation.title}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{formation.level}</td>
                                <td className="px-6 py-4 text-sm font-medium text-[#27b6d8]">{formation.price}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${formation.status === 'Publié' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {formation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={(e) => onDelete(formation.id, e)} // STOP PROPAGATION -> DELETE
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                                        title="Supprimer la formation"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {formations.length === 0 && (
                     <div className="p-10 text-center text-gray-400">Aucune formation publiée.</div>
                )}
            </div>
        </div>
    );
}

// 3. CANDIDATURES
function CandidaturesTab({ candidats, setCandidats }) {
    const handleAction = (id, newStatus) => {
        setCandidats(candidats.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Gestion des candidatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidats.map(c => (
                    <div key={c.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                        {/* Status Bar */}
                        <div className={`absolute left-0 top-0 w-1.5 h-full ${c.status === 'Admis' ? 'bg-green-500' : c.status === 'Refusé' ? 'bg-red-500' : 'bg-orange-400'}`}></div>
                        
                        <div className="flex items-center gap-3 mb-4 pl-3">
                            <img src={c.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                            <div>
                                <h4 className="font-bold text-slate-900">{c.name}</h4>
                                <p className="text-xs text-gray-500">{c.formation}</p>
                            </div>
                        </div>

                        <div className="pl-3 mb-4 flex items-center justify-between">
                             <span className="text-[10px] font-bold text-gray-400">{c.date}</span>
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                                 c.status === 'Admis' ? 'bg-green-50 text-green-700' : 
                                 c.status === 'Refusé' ? 'bg-red-50 text-red-700' : 
                                 'bg-orange-50 text-orange-700'
                             }`}>
                                {c.status}
                             </span>
                        </div>

                        {c.status === 'En attente' && (
                            <div className="flex gap-2 pl-3 pt-2 border-t border-gray-50">
                                <button onClick={() => handleAction(c.id, 'Admis')} className="flex-1 bg-[#370669] text-white py-2 rounded-xl text-xs font-bold hover:bg-[#2a0552] transition-colors">Accepter</button>
                                <button onClick={() => handleAction(c.id, 'Refusé')} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 transition-colors">Refuser</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// 4. CARTES ÉTUDIANT
function StudentCardsTab({ candidats }) {
    const admittedStudents = candidats.filter(c => c.status === 'Admis');
    const [selectedStudent, setSelectedStudent] = useState(admittedStudents[0] || null);

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-200px)]">
            {/* List */}
            <div className="w-full lg:w-1/3 bg-white rounded-3xl border border-gray-100 p-6 overflow-y-auto">
                <h3 className="font-bold mb-4 text-slate-900">Étudiants Admis</h3>
                <div className="space-y-2">
                    {admittedStudents.map(student => (
                        <div key={student.id} onClick={() => setSelectedStudent(student)}
                            className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${selectedStudent?.id === student.id ? 'bg-[#27b6d8]/10 border border-[#27b6d8] shadow-sm' : 'hover:bg-gray-50 border border-transparent'}`}>
                            <img src={student.image} className="w-10 h-10 rounded-full" alt="" />
                            <div>
                                <div className="font-bold text-sm text-slate-900">{student.name}</div>
                                <div className="text-xs text-gray-500">{student.formation}</div>
                            </div>
                        </div>
                    ))}
                    {admittedStudents.length === 0 && <p className="text-xs text-gray-400 italic">Aucun étudiant admis pour le moment.</p>}
                </div>
            </div>

            {/* Preview */}
            <div className="flex-1 bg-gray-50 rounded-3xl border border-gray-200 flex flex-col items-center justify-center p-8 relative">
                {selectedStudent ? (
                    <>
                        <div className="w-[350px] h-[220px] bg-gradient-to-br from-[#370669] to-[#5b2299] rounded-2xl shadow-2xl relative overflow-hidden text-white p-6 flex flex-col justify-between transform transition-transform hover:scale-105 duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            
                            <div className="flex justify-between items-start z-10">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-white" />
                                    <span className="font-bold text-sm tracking-wide">EduManager</span>
                                </div>
                                <div className="text-[10px] bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">2025-2026</div>
                            </div>

                            <div className="flex items-center gap-4 z-10 mt-2">
                                <div className="w-20 h-20 rounded-xl bg-white p-1 shadow-lg">
                                    <img src={selectedStudent.image} className="w-full h-full object-cover rounded-lg" alt="" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold leading-tight">{selectedStudent.name}</h2>
                                    <p className="text-[10px] text-white/70 uppercase tracking-wider mb-1">Étudiant</p>
                                    <div className="text-[10px] font-medium bg-[#27b6d8] px-2 py-1 rounded inline-block shadow-sm">
                                        {selectedStudent.formation}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end z-10">
                                <div className="text-[8px] text-white/50">ID: {selectedStudent.id}849302</div>
                                <div className="w-12 h-6 bg-white/90 rounded flex items-center justify-center">
                                    <div className="w-8 h-3 border-t-2 border-b-2 border-black/80"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <button className="bg-[#370669] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-[#2a0552] flex gap-2 transition-colors">
                                <Download className="w-4 h-4" /> Télécharger PDF
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center text-gray-400">
                        <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>Sélectionnez un étudiant pour voir sa carte.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// 5. PARAMÈTRES
function SettingsTab({ user, onSave }) {
    return (
        <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Profil de l'établissement</h3>
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8">
                <form onSubmit={onSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Nom de l'établissement" name="schoolName" defaultValue={user?.schoolName || ""} placeholder="Ex: HEC Paris" icon={Building2} />
                        <InputGroup label="Site Web" name="website" defaultValue={user?.website || ""} placeholder="https://..." icon={Globe} />
                        <InputGroup label="Email de contact" name="email" defaultValue={user?.email || ""} placeholder="contact@ecole.com" icon={Mail} />
                        <InputGroup label="Téléphone" name="phone" placeholder="+261 ..." icon={Phone} />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description publique</label>
                        <textarea className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#27b6d8] focus:ring-2 focus:ring-[#27b6d8]/20 outline-none text-sm min-h-[120px]" placeholder="Présentez votre école..."></textarea>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-[#27b6d8] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#27b6d8]/30 hover:scale-[1.02] transition-transform">Enregistrer les modifications</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ==========================================
// HELPERS UI
// ==========================================
function SidebarItem({ icon: Icon, label, active, onClick, badge }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${active ? 'bg-[#27b6d8] text-white shadow-md shadow-[#27b6d8]/25' : 'text-gray-500 hover:bg-gray-50 hover:text-[#27b6d8]'}`}>
            <div className="flex items-center gap-3"><Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} /> {label}</div>
            {badge > 0 && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{badge}</span>}
        </button>
    );
}

function StatCard({ title, value, icon: Icon, trend, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-gray-50"><Icon className="w-5 h-5" style={{ color }} /></div>
                {trend && <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-1 rounded-full">{trend}</span>}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{value}</h3>
            <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
    );
}

function InputGroup({ label, placeholder, defaultValue, icon: Icon, name }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">{label}</label>
            <div className="relative">
                <input name={name} type="text" defaultValue={defaultValue} placeholder={placeholder} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#27b6d8] focus:ring-2 focus:ring-[#27b6d8]/20 outline-none text-sm text-slate-800 transition-all" />
                <Icon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            </div>
        </div>
    );
}