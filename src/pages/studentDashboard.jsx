import React from "react";
import { Link } from "react-router-dom";
import StudentNavbar from "../components/StudentNavbar";
import { useAuth } from "../context/AuthContext";
import { 
  FileText, Heart, Send, Bell, Search, 
  MapPin, ChevronRight, AlertCircle, CheckCircle2 
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();

  // Données simulées pour l'exemple
  const applications = [
    { id: 1, school: "HETIC", program: "Mastère Big Data", status: "sent", date: "Il y a 2j" },
    { id: 2, school: "ESG Luxe", program: "Bachelor Marketing", status: "viewed", date: "Il y a 1 sem" },
    { id: 3, school: "Sorbonne", program: "Licence Droit", status: "accepted", date: "Il y a 1 mois" },
  ];

  const favorites = [
    { id: 101, title: "Ingénieur Logiciel", school: "Polytech" },
    { id: 102, title: "MBA Finance", school: "HEC Paris" },
  ];

  return (
    <div className="min-h-screen font-poppins selection:bg-[#18B49C] selection:text-white">
      <StudentNavbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* === HEADER === */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2">
              Ravi de vous revoir, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">{user?.firstName || "Étudiant"}</span>.
            </h1>
            <p className="text-gray-500 text-base md:text-lg">Votre avenir se dessine ici. Suivez vos démarches.</p>
          </div>
          
          <Link to="/formations" className="group bg-[#370669] text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-[#370669]/20 hover:scale-105 transition-all flex items-center gap-3">
             <Search className="w-5 h-5" />
             <span>Explorer les formations</span>
          </Link>
        </div>

        {/* === STATS GRID (Axé Candidature) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard 
            icon={<Send />} 
            label="Candidatures" 
            value={applications.length} 
            subtext="Envoyées cette année"
            color="#370669" 
          />
          <StatCard 
            icon={<Heart />} 
            label="Formations suivies" 
            value={favorites.length} 
            subtext="Dans vos favoris"
            color="#ec4899" 
          />
          <StatCard 
            icon={<FileText />} 
            label="Mon Dossier" 
            value="85%" 
            subtext="Documents manquants"
            color="#f59e0b" 
            isWarning
          />
          <StatCard 
            icon={<Bell />} 
            label="Notifications" 
            value="2" 
            subtext="Nouveaux messages"
            color="#27b6d8" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* === COLONNE GAUCHE : SUIVI CANDIDATURES === */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tableau des candidatures */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#18B49C]" /> Suivi des candidatures
                </h2>
                <button className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-[#370669] transition-colors">Tout voir</button>
              </div>

              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm border border-gray-50 font-bold text-[#370669]">
                            {app.school.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#370669] transition-colors">{app.program}</h3>
                            <p className="text-xs text-gray-500 font-medium">{app.school} • <span className="text-gray-400">{app.date}</span></p>
                        </div>
                    </div>
                    
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Favoris Rapides */}
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" /> Vos coups de cœur
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map(fav => (
                        <div key={fav.id} className="p-4 rounded-xl border border-gray-100 hover:border-[#370669]/20 hover:bg-[#fcfaff] transition-colors flex justify-between items-center group cursor-pointer">
                            <div>
                                <h4 className="font-bold text-sm text-slate-900">{fav.title}</h4>
                                <p className="text-xs text-gray-500">{fav.school}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#370669] transition-colors" />
                        </div>
                    ))}
                    <Link to="/formations" className="p-4 rounded-xl border border-dashed border-gray-200 hover:border-[#18B49C] hover:bg-[#f0fdf9] transition-all flex items-center justify-center gap-2 text-gray-400 hover:text-[#18B49C] group">
                        <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">Trouver une autre école</span>
                    </Link>
                </div>
            </div>

          </div>

          {/* === SIDEBAR PROFIL & DOSSIER === */}
          <div className="flex flex-col gap-6">
            
            {/* Carte Profil Mini */}
            <div className="relative bg-[#370669] text-white rounded-[2rem] p-8 overflow-hidden text-center">
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold mb-4 backdrop-blur-md border border-white/20 shadow-xl">
                        {user?.firstName?.charAt(0) || "E"}
                    </div>
                    <h3 className="text-xl font-bold mb-1">{user?.firstName} {user?.lastName}</h3>
                    <p className="text-white/60 text-sm mb-6 flex items-center gap-2 justify-center">
                        <MapPin size={12} /> {user?.city || "Madagascar"}
                    </p>
                    
                    <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-xs font-bold uppercase tracking-wider">
                        Modifier mon profil
                    </button>
                </div>
                {/* Décoration */}
                <div className="absolute top-[-50%] right-[-50%] w-64 h-64 bg-[#18B49C] rounded-full blur-[80px] opacity-30"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-40 h-40 bg-[#27b6d8] rounded-full blur-[50px] opacity-20"></div>
            </div>

            {/* Checklist Dossier */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#f59e0b]" /> État du dossier
                </h3>
                <div className="space-y-3">
                    <CheckItem label="Informations personnelles" done={true} />
                    <CheckItem label="CV importé" done={true} />
                    <CheckItem label="Relevés de notes" done={false} />
                    <CheckItem label="Lettre de motivation" done={false} />
                </div>
                <button className="w-full mt-6 py-3 rounded-xl bg-[#fffbf0] text-[#d97706] hover:bg-[#fff7e0] transition-colors text-xs font-bold uppercase tracking-wider">
                    Compléter mon dossier
                </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

// --- SOUS COMPOSANTS ---

function StatCard({ icon, label, value, subtext, color, isWarning }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gray-50 rounded-bl-full -mr-4 -mt-4 transition-colors group-hover:bg-gray-100"></div>
      
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg mb-4 transform group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: color }}>
            {React.cloneElement(icon, { size: 20 })}
        </div>
        <div className="flex justify-between items-end">
            <div>
                <p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p>
                <p className="text-sm font-bold text-slate-700">{label}</p>
                <p className={`text-[10px] mt-1 font-medium ${isWarning ? 'text-orange-500' : 'text-gray-400'}`}>{subtext}</p>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
    const config = {
        sent: { color: "bg-blue-50 text-blue-600 border-blue-100", label: "Envoyée", icon: Send },
        viewed: { color: "bg-orange-50 text-orange-600 border-orange-100", label: "Vue par l'école", icon: CheckCircle2 },
        accepted: { color: "bg-green-50 text-green-600 border-green-100", label: "Admissible", icon: CheckCircle2 },
        rejected: { color: "bg-red-50 text-red-600 border-red-100", label: "Refusée", icon: AlertCircle },
    };
    
    const current = config[status] || config.sent;
    const Icon = current.icon;

    return (
        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${current.color}`}>
            <Icon size={12} /> {current.label}
        </span>
    );
}

function CheckItem({ label, done }) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className={done ? "text-gray-500 line-through decoration-gray-300" : "text-slate-700 font-medium"}>{label}</span>
            {done ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-200"></div>
            )}
        </div>
    );
}