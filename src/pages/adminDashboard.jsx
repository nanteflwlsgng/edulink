import React, { useState } from "react";
import { 
  LayoutDashboard, Building2, Users, Wallet, ShieldAlert, 
  Search, CheckCircle, XCircle, LogOut, 
  TrendingUp, AlertTriangle, Eye, Globe, MapPin, 
  Mail, Phone, Lock, Filter, LayoutGrid, LayoutList,
  MoreVertical, Ban, GraduationCap, Calendar, Clock, 
  ArrowUpRight, Check, X 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

// IMPORTANT : Assure-toi que le chemin est correct vers le composant créé précédemment
import SchoolInspectionModal from "../components/SchoolInspectionModal";

// ==========================================
// MOCK DATA
// ==========================================

const GRAPH_DATA = [
  { name: 'Jan', students: 400, schools: 24 },
  { name: 'Fév', students: 800, schools: 28 },
  { name: 'Mar', students: 1200, schools: 35 },
  { name: 'Avr', students: 1800, schools: 42 },
  { name: 'Mai', students: 2400, schools: 55 },
  { name: 'Juin', students: 3200, schools: 68 },
];

const MOCK_SCHOOLS = [
  { 
    id_ecole: 1, 
    nom: "Institut Supérieur de Technologie", 
    status: "pending", 
    adresse: "Ampasampito, Antananarivo", 
    email: "direction@ist-tana.mg", 
    telephone: "+261 34 00 000 00",
    date_creation: "2026-01-08T10:00:00Z",
    description: "L'IST est un établissement public d'enseignement supérieur technique. Nous formons des techniciens supérieurs et des ingénieurs opérationnels.",
    logo: "https://images.unsplash.com/photo-1592280771800-bcf9de24e2e2?auto=format&fit=crop&q=80",
    site_web: "www.ist-tana.mg",
    id_utilisateur: 45
  },
  { 
    id_ecole: 2, 
    nom: "Digital Campus Mada", 
    status: "approved", 
    adresse: "Zone Galaxy, Andraharo", 
    email: "admission@dcm.mg", 
    telephone: "+261 32 11 222 33", 
    date_creation: "2025-11-15T14:30:00Z",
    description: "L'école des métiers du web et du multimédia. Pédagogie par projet et immersion en entreprise.",
    logo: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80",
    site_web: "www.digitalcampus.mg",
    id_utilisateur: 52
  },
  { 
    id_ecole: 3, 
    nom: "Fake University", 
    status: "rejected", 
    adresse: "Inconnue", 
    email: "scam@fake.com", 
    telephone: "+00 00 00 00", 
    date_creation: "2026-01-01T09:00:00Z", 
    description: "Pas de description fournie.", 
    logo: null, 
    site_web: "www.virus.com", 
    id_utilisateur: 99 
  }
];

const MOCK_USERS = [
  { id: 1, type: 'student', name: "Jean Rabe", email: "jean@student.mg", status: 'Active', details: { school: "IST Tana", formation: "Génie Civil" }, image: "https://i.pravatar.cc/150?u=1" },
  { id: 2, type: 'school', name: "Admin DCM", email: "admin@dcm.mg", status: 'Active', details: { school: "Digital Campus", role: "Directeur" }, image: null },
  { id: 3, type: 'student', name: "Sarah Connor", email: "sarah@skynet.com", status: 'Suspended', details: { school: "Digital Campus", formation: "Web Dev" }, image: "https://i.pravatar.cc/150?u=3" },
];

const TRANSACTIONS = [
  { id: "TX-991", from: "Jean Rabe", to: "Université ACEEM", amount: "900 000 Ar", fee: "45 000 Ar", date: "2026-01-10", type: "Inscription" },
  { id: "TX-992", from: "Paul Smith", to: "Digital Campus", amount: "4 500 000 Ar", fee: "225 000 Ar", date: "2026-01-09", type: "Frais de scolarité" },
];

// ==========================================
// COMPOSANT PRINCIPAL (ADMIN DASHBOARD)
// ==========================================
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard"); 
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [users, setUsers] = useState(MOCK_USERS);
  const navigate = useNavigate();
  const { logout } = useAuth(); 

  // Gestion des Modals
  const [inspectModal, setInspectModal] = useState(null); 
  const [userModal, setUserModal] = useState(null); 

  // --- ACTIONS ---
  
  // Met à jour le statut de l'école (Persistance : ne supprime pas l'école de la liste)
  const handleUpdateSchoolStatus = (id, newStatus) => {
    setSchools(schools.map(s => s.id_ecole === id ? { ...s, status: newStatus } : s));
    
    // Met à jour l'objet dans le modal ouvert pour voir le changement immédiatement
    if(inspectModal && inspectModal.id_ecole === id) {
        setInspectModal(prev => ({...prev, status: newStatus}));
    }
  };

  // Active/Suspend un utilisateur
  const handleToggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    
    if (userModal && userModal.id === id) {
        setUserModal(prev => ({ ...prev, status: prev.status === 'Active' ? 'Suspended' : 'Active' }));
    }
  };

  // Rendu du contenu principal
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <DashboardHome schools={schools} users={users} />;
      case "validation": return <ValidationTab schools={schools} onInspect={setInspectModal} />;
      case "moderation": return <ModerationTab users={users} onInspect={setUserModal} />;
      case "finance": return <FinanceTab transactions={TRANSACTIONS} />;
      default: return <DashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f8f9fc] font-poppins text-slate-800 overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between z-20 shadow-sm flex-shrink-0">
        <div>
          <div className="p-8 flex items-center gap-3">
             <div className="w-10 h-10 bg-[#370669] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#370669]/20">A</div>
             <span className="font-bold text-lg text-slate-800 tracking-tight">AdminPanel</span>
          </div>
          <nav className="px-4 space-y-1">
            <SidebarItem icon={LayoutDashboard} label="Tableau de bord" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
            <SidebarItem icon={Building2} label="Établissements" badge={schools.filter(s => s.status === 'pending').length} active={activeTab === "validation"} onClick={() => setActiveTab("validation")} />
            <SidebarItem icon={Users} label="Utilisateurs" active={activeTab === "moderation"} onClick={() => setActiveTab("moderation")} />
            <SidebarItem icon={Wallet} label="Finances" active={activeTab === "finance"} onClick={() => setActiveTab("finance")} />
          </nav>
        </div>
        <div className="p-4 border-t border-gray-50">
           <button onClick={() => {logout(); navigate('/')}} className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold">
             <LogOut className="w-4 h-4" /> Déconnexion
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab === 'dashboard' ? 'Vue d\'ensemble' : activeTab === 'validation' ? 'Gestion des Établissements' : activeTab}</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Super Administrateur</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#370669]/20 transition-all">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderContent()}
        </div>
      </main>

      {/* --- MODALS --- */}
      
      {/* Modal Inspection Ecole (Composant Externe) */}
      {inspectModal && (
        <SchoolInspectionModal 
          school={inspectModal} 
          onClose={() => setInspectModal(null)} 
          onStatusChange={handleUpdateSchoolStatus}
        />
      )}

      {/* Modal Détail Utilisateur (Composant Interne) */}
      {userModal && (
        <UserDetailModal 
          user={userModal} 
          onClose={() => setUserModal(null)}
          onToggleStatus={() => handleToggleUserStatus(userModal.id)}
        />
      )}
    </div>
  );
}

// ==========================================
// ONGLETS (CONTENU)
// ==========================================

function DashboardHome({ schools, users }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Étudiants Total" value={users.filter(u => u.type === 'student').length * 120} icon={Users} color="#27b6d8" trend="+12%" />
        <StatCard title="Établissements" value={schools.filter(s => s.status === 'approved').length} icon={Building2} color="#18B49C" trend="Actifs" />
        <StatCard title="Commissions" value="12.5 M Ar" icon={Wallet} color="#370669" trend="Revenus" />
        <StatCard title="En Attente" value={schools.filter(s => s.status === 'pending').length} icon={AlertTriangle} color="#f59e0b" trend="Urgent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[300px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 text-lg">Croissance Plateforme</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={GRAPH_DATA}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#370669" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#370669" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSchools" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27b6d8" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#27b6d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="students" stroke="#370669" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                <Area type="monotone" dataKey="schools" stroke="#27b6d8" strokeWidth={3} fillOpacity={1} fill="url(#colorSchools)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#370669] p-8 rounded-[2rem] text-white flex flex-col justify-between shadow-xl shadow-[#370669]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none"></div>
          <div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Sécurité</h3>
            <p className="text-white/70 text-sm mb-6">2 tentatives de connexion suspectes détectées aujourd'hui.</p>
          </div>
          <button className="w-full bg-white text-[#370669] py-3 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors z-10">
            Voir les logs
          </button>
        </div>
      </div>
    </div>
  );
}

function ValidationTab({ schools, onInspect }) {
  const [viewMode, setViewMode] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchools = schools.filter(s => {
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchSearch = s.nom.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-900">Demandes d'adhésion</h3>
        
        <div className="flex flex-col sm:flex-row gap-3 items-center">
            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
            <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#370669] w-full sm:w-64 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                {["all", "pending", "approved", "rejected"].map((st) => (
                    <button key={st} onClick={() => setFilterStatus(st)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${filterStatus === st ? 'bg-[#370669] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}>
                        {st === 'all' ? 'Tous' : st === 'pending' ? 'En attente' : st === 'approved' ? 'Validés' : 'Refusés'}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map(school => (
            <div key={school.id_ecole} onClick={() => onInspect(school)} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="absolute top-0 left-0 bg-gray-50 px-3 py-1.5 rounded-br-2xl border-b border-r border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(school.date_creation).toLocaleDateString()}
                </span>
              </div>
              
              {school.status === 'pending' && (
                <div className="absolute top-4 right-4 bg-orange-50 text-orange-600 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-orange-100">
                    <AlertTriangle className="w-3 h-3" /> À traiter
                </div>
              )}

              <div className="flex items-center gap-4 mb-6 mt-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                    {school.logo ? <img src={school.logo} alt="" className="w-full h-full object-cover"/> : <Building2 className="w-6 h-6 text-gray-300"/>}
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1">{school.nom}</h4>
                    <p className="text-xs text-gray-500">{school.email}</p>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3"/> {school.adresse.split(',')[0]}</span>
                <StatusBadge status={school.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
           <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                 <tr><th className="px-6 py-4">Établissement</th><th className="px-6 py-4">Contact</th><th className="px-6 py-4">Date Création</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {filteredSchools.map(s => (
                   <tr key={s.id_ecole} onClick={() => onInspect(s)} className="hover:bg-gray-50 cursor-pointer group">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="font-bold text-slate-900 text-sm">{s.nom}</span></div></td>
                      <td className="px-6 py-4 text-xs text-gray-500">{s.email}</td>
                      <td className="px-6 py-4 text-xs text-gray-400">{new Date(s.date_creation).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
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

function ModerationTab({ users, onInspect }) {
    const [viewMode, setViewMode] = useState("list");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");

    const filteredUsers = users.filter(u => {
        const matchType = filterType === 'all' || u.type === filterType;
        const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchType && matchSearch;
    });

    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 w-fit">
                {['all', 'student', 'school'].map(t => (
                    <button key={t} onClick={() => setFilterType(t)} className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filterType === t ? 'bg-[#370669] text-white shadow-sm' : 'text-gray-500 hover:text-[#370669]'}`}>
                        {t === 'all' ? 'Tous' : t === 'student' ? 'Étudiants' : 'Admins Écoles'}
                    </button>
                ))}
            </div>
            <div className="flex gap-3">
                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input type="text" placeholder="Rechercher..." className="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#370669] w-full sm:w-64 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
        </div>

        {viewMode === 'list' ? (
            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase text-gray-400 font-semibold">
                        <tr><th className="px-6 py-4">Utilisateur</th><th className="px-6 py-4">Rôle</th><th className="px-6 py-4">Affiliation</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4 text-right">Détails</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredUsers.map(u => (
                            <tr key={u.id} onClick={() => onInspect(u)} className="hover:bg-gray-50 cursor-pointer group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${u.type === 'school' ? 'bg-[#27b6d8]' : 'bg-[#18B49C]'}`}>{u.name.charAt(0)}</div>
                                        <div><div className="font-bold text-slate-900 text-sm">{u.name}</div><div className="text-xs text-gray-400">{u.email}</div></div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.type === 'school' ? 'text-[#27b6d8] bg-[#27b6d8]/10' : 'text-[#18B49C] bg-[#18B49C]/10'}`}>{u.type === 'school' ? 'Établissement' : 'Étudiant'}</span></td>
                                <td className="px-6 py-4"><div className="text-xs font-medium text-slate-700">{u.details?.school}</div><div className="text-[10px] text-gray-400">{u.details?.formation || u.details?.role}</div></td>
                                <td className="px-6 py-4">{u.status === 'Active' ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle className="w-3 h-3"/> Actif</span> : <span className="flex items-center gap-1 text-red-500 text-xs font-bold"><Ban className="w-3 h-3"/> Suspendu</span>}</td>
                                <td className="px-6 py-4 text-right"><MoreVertical className="w-4 h-4 text-gray-300 ml-auto group-hover:text-[#370669]" /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(u => (
                    <div key={u.id} onClick={() => onInspect(u)} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col items-center text-center relative overflow-hidden">
                        <div className={`absolute top-0 w-full h-2 ${u.type === 'school' ? 'bg-[#27b6d8]' : 'bg-[#18B49C]'}`}></div>
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4 ${u.type === 'school' ? 'bg-[#27b6d8]' : 'bg-[#18B49C]'}`}>
                            {u.image ? <img src={u.image} alt="" className="w-full h-full object-cover rounded-full"/> : u.name.charAt(0)}
                        </div>
                        <h3 className="font-bold text-slate-900 mb-1">{u.name}</h3>
                        <p className="text-xs text-gray-400 mb-4">{u.email}</p>
                        <div className="w-full bg-gray-50 p-3 rounded-xl mb-4">
                            <p className="text-xs font-bold text-slate-700 truncate">{u.details?.school}</p>
                            <p className="text-[10px] text-gray-500">{u.details?.formation || u.details?.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    );
}

function FinanceTab({ transactions }) {
    return (
        <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-slate-900">Historique des transactions</h3>
            <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100"><tr><th className="px-8 py-5">ID</th><th className="px-8 py-5">De</th><th className="px-8 py-5">Vers</th><th className="px-8 py-5">Montant</th><th className="px-8 py-5 text-[#370669]">Commission</th><th className="px-8 py-5 text-right">Date</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-gray-50/50"><td className="px-8 py-5 text-xs font-mono text-gray-500">#{tx.id}</td><td className="px-8 py-5 font-bold text-slate-800">{tx.from}</td><td className="px-8 py-5 text-gray-600">{tx.to}</td><td className="px-8 py-5 font-bold text-slate-900">{tx.amount}</td><td className="px-8 py-5 font-bold text-[#370669] bg-[#370669]/5">{tx.fee}</td><td className="px-8 py-5 text-right text-gray-400 text-xs">{tx.date}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ==========================================
// INTERNAL HELPERS & MODALS
// ==========================================

function UserDetailModal({ user, onClose, onToggleStatus }) {
    const isStudent = user.type === 'student';
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn relative flex flex-col">
                <div className={`h-36 w-full ${isStudent ? 'bg-gradient-to-br from-[#18B49C] to-[#159f8a]' : 'bg-gradient-to-br from-[#27b6d8] to-[#1fa0bc]'} relative`}>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-white rounded-full transition-colors"><X className="w-5 h-5"/></button>
                </div>

                <div className="px-8 pb-8 flex-1 -mt-16">
                    <div className="flex justify-center mb-4">
                        <div className="w-32 h-32 rounded-full bg-white p-1.5 shadow-xl">
                            <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt="" className="w-full h-full rounded-full object-cover" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h2>
                        <p className="text-gray-500 text-sm font-medium">{user.email}</p>
                        <div className="flex justify-center gap-2 mt-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${isStudent ? 'bg-teal-50 text-teal-600' : 'bg-cyan-50 text-cyan-600'}`}>{isStudent ? 'Étudiant' : 'Admin Établissement'}</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{user.status === 'Active' ? 'Actif' : 'Suspendu'}</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 space-y-5 border border-gray-100">
                        <InfoRow icon={Building2} label="Établissement" value={user.details?.school} />
                        <InfoRow icon={isStudent ? GraduationCap : Users} label={isStudent ? "Formation" : "Rôle"} value={user.details?.formation || user.details?.role} />
                    </div>

                    <button onClick={onToggleStatus} className={`w-full mt-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md ${user.status === 'Active' ? 'bg-white border border-red-200 text-red-600 hover:bg-red-50' : 'bg-[#18B49C] text-white hover:bg-[#159f8a]'}`}>
                        {user.status === 'Active' ? <><Ban className="w-4 h-4"/> Suspendre l'utilisateur</> : <><Check className="w-4 h-4"/> Réactiver le compte</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl text-white shadow-sm transition-transform group-hover:scale-110" style={{backgroundColor: color}}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <h3 className="text-3xl font-bold text-slate-900 mb-1">{value}</h3>
      <p className="text-xs font-medium text-gray-400">{title}</p>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick, badge }) {
    return <button onClick={onClick} className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 text-sm font-medium ${active ? 'bg-[#370669] text-white shadow-md shadow-[#370669]/25' : 'text-gray-500 hover:bg-gray-50 hover:text-[#370669]'}`}><div className="flex items-center gap-3"><Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} /> {label}</div>{badge > 0 && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{badge}</span>}</button>;
}

function ViewToggle({ viewMode, setViewMode }) {
    return (
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#370669] text-white shadow-sm' : 'text-gray-400 hover:text-[#370669]'}`}>
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#370669] text-white shadow-sm' : 'text-gray-400 hover:text-[#370669]'}`}>
                <LayoutList className="w-4 h-4" />
            </button>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value, isLink }) {
    return (
        <div className="flex items-start gap-3 group">
           <div className="p-2.5 bg-gray-100 rounded-xl text-gray-400 group-hover:text-[#370669] group-hover:bg-[#370669]/5 transition-colors"><Icon className="w-4 h-4" /></div>
           <div className="flex-1 overflow-hidden">
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
             {isLink ? (
                <a href={`https://${value}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-[#370669] hover:underline truncate block">{value}</a>
             ) : (
                <p className="text-sm font-semibold text-slate-800 truncate">{value || "Non renseigné"}</p>
             )}
           </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = { pending: "bg-orange-50 text-orange-600 border border-orange-100", approved: "bg-green-50 text-green-600 border border-green-100", rejected: "bg-red-50 text-red-600 border border-red-100" };
    const labels = { pending: "En attente", approved: "Validé", rejected: "Refusé" };
    return <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${styles[status]}`}>{labels[status]}</span>;
}