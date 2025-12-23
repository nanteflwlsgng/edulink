import React from "react";
import StudentNavbar from "../components/StudentNavbar";
import { useAuth } from "../context/AuthContext";
import { Clock, CheckCircle, TrendingUp, Calendar, MapPin } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#fdfdfd] font-poppins selection:bg-[#18B49C] selection:text-white">
      <StudentNavbar />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        
        {/* Header de bienvenue */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              Bonjour, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">{user?.name?.split(' ')[0]}</span>.
            </h1>
            <p className="text-gray-500 text-lg">Prêt à continuer votre apprentissage aujourd'hui ?</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-full border border-gray-100 shadow-sm flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-sm font-bold text-slate-700">Compte Actif</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Clock />} label="Heures d'étude" value="12h" color="#370669" />
          <StatCard icon={<CheckCircle />} label="Cours complétés" value="3" color="#18B49C" />
          <StatCard icon={<TrendingUp />} label="Progression" value="+24%" color="#27b6d8" />
          <StatCard icon={<Calendar />} label="Prochain cours" value="Demain" color="#f59e0b" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          
          {/* Main Content: Mes Candidatures / Cours */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900">Mes Candidatures</h2>
                <button className="text-xs font-bold uppercase tracking-wider text-[#18B49C] hover:text-[#370669] transition-colors">Voir tout</button>
              </div>

              {/* Fake Data List */}
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="group flex items-center p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-white flex items-center justify-center text-2xl shadow-sm mr-5 group-hover:scale-110 transition-transform">
                      🎓
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 group-hover:text-[#370669] transition-colors">Master Digital Marketing</h3>
                      <p className="text-sm text-gray-500">Université Paris Dauphine</p>
                    </div>
                    <span className="px-4 py-1.5 bg-[#f0fdf9] text-[#18B49C] text-xs font-bold rounded-full uppercase tracking-wide">
                      En attente
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Profil */}
          <div className="relative bg-[#370669] text-white rounded-[2rem] p-8 overflow-hidden flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-2xl font-bold mb-6 backdrop-blur-sm border border-white/20">
                    {user?.name?.charAt(0)}
                </div>
                <h3 className="text-2xl font-bold mb-1">{user?.name}</h3>
                <p className="text-white/60 mb-8 flex items-center gap-2 text-sm">
                    <MapPin size={14} /> {user?.city || "Localisation non définie"}
                </p>

                <div className="space-y-4 border-t border-white/10 pt-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Email</span>
                        <span className="font-medium truncate ml-4">{user?.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-white/50">Membre depuis</span>
                        <span className="font-medium">2025</span>
                    </div>
                </div>
            </div>

            {/* Décoration d'arrière plan */}
            <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-[#18B49C] rounded-full blur-[90px] opacity-40"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-[#27b6d8] rounded-full blur-[60px] opacity-30"></div>
          </div>

        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:translate-y-[-5px] transition-transform duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md" style={{ backgroundColor: color }}>
            {React.cloneElement(icon, { size: 18 })}
        </div>
        {/* Petit graph fake */}
        <div className="flex items-end gap-1 h-8 opacity-20">
            <div className="w-1 bg-slate-900 h-full rounded-full"></div>
            <div className="w-1 bg-slate-900 h-1/2 rounded-full"></div>
            <div className="w-1 bg-slate-900 h-3/4 rounded-full"></div>
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}