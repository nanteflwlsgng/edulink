import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, MapPin, Users, Globe, Building2, ArrowRight, X, GraduationCap, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import Navbar from "../components/Navbar";

// --- MOCK DATA SPECIFIQUE (À mettre dans un fichier séparé plus tard) ---
const SCHOOL_DATA = [
  {
    id: 1,
    name: "Sorbonne Université",
    type: "Université Publique",
    city: "Paris",
    country: "France",
    students: "55,000",
    image: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/b/b3/Logo_Sorbonne_Universit%C3%A9.svg/1200px-Logo_Sorbonne_Universit%C3%A9.svg.png",
    tags: ["Recherche", "Patrimoine"],
    services: ["Bibliothèque", "Logement", "Sport"]
  },
  {
    id: 2,
    name: "HEC Paris",
    type: "Grande École Privée",
    city: "Jouy-en-Josas",
    country: "France",
    students: "4,500",
    image: "https://images.unsplash.com/photo-1523050853023-8c2d275438b3?auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/HEC_Paris_logo.svg/2560px-HEC_Paris_logo.svg.png",
    tags: ["Business", "International"],
    services: ["Campus", "Incubateur", "International"]
  },
  // Ajoutez d'autres données ici...
];

export default function Establishments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const containerRef = useRef(null);

  // Animation d'entrée
  useEffect(() => {
    gsap.fromTo(".school-card", 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "expo.out" }
    );
  }, [filterType, searchTerm]);

  const filteredSchools = useMemo(() => {
    return SCHOOL_DATA.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            school.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "Tous" || school.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, filterType]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-poppins selection:bg-[#370669] selection:text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#370669]/5 text-[#370669] text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            Réseau Partenaire 2025
          </span>
          <h1 className="text-6xl md:text-8xl font-orange text-slate-900 leading-[0.8] mb-8">
            Trouvez votre <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#370669] to-[#683cc7]">Campus.</span>
          </h1>

          {/* Barre de recherche Minimaliste */}
          <div className="max-w-2xl mx-auto relative group mt-12">
            <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-2 shadow-xl shadow-gray-200/40 focus-within:ring-2 ring-[#370669]/10 transition-all">
              <Search className="ml-4 text-gray-300 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Rechercher une école, une ville..." 
                className="w-full p-4 outline-none text-slate-700 bg-transparent"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* --- FILTRES LATÉRAUX (Architecture Side) --- */}
        <aside className="w-full lg:w-72 space-y-10">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Type d'établissement</h3>
            <div className="flex flex-col gap-3">
              {["Tous", "Université Publique", "Grande École Privée", "Centre de Formation"].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`text-left px-4 py-3 rounded-xl text-sm transition-all ${filterType === type ? 'bg-[#370669] text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-100'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="p-8 bg-[#370669] rounded-[2rem] text-white relative overflow-hidden group">
             <div className="relative z-10">
                <Trophy className="w-8 h-8 mb-4 text-[#27b6d8]" />
                <h4 className="font-bold mb-2">Vous êtes un établissement ?</h4>
                <p className="text-xs text-white/70 leading-relaxed mb-6">Rejoignez notre réseau et boostez votre visibilité auprès des étudiants.</p>
                <Link to="/compte" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-white text-[#370669] px-6 py-3 rounded-full hover:scale-105 transition-transform">
                    Enregistrer mon école
                </Link>
             </div>
             <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>
        </aside>

        {/* --- GRILLE DES ÉCOLES --- */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-10">
            <p className="text-sm text-gray-400 font-medium">
              <span className="text-slate-900 font-bold">{filteredSchools.length}</span> Établissements trouvés
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={containerRef}>
            {filteredSchools.map((school) => (
              <div 
                key={school.id} 
                className="school-card group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500"
              >
                {/* Image & Logo */}
                <div className="relative h-64 overflow-hidden">
                  <img src={school.image} alt={school.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Logo Overlay */}
                  <div className="absolute bottom-6 left-6 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-xl">
                      <img src={school.logo} alt="logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-xl">{school.name}</h3>
                        <p className="text-white/80 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {school.city}, {school.country}
                        </p>
                    </div>
                  </div>
                </div>

                {/* Détails */}
                <div className="p-8">
                  <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-500">
                        <Users className="w-3.5 h-3.5" /> {school.students} étudiants
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full text-xs font-medium text-gray-500">
                        <Building2 className="w-3.5 h-3.5" /> {school.type}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {school.tags.map(tag => (
                      <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-[#370669] px-2 py-1 border border-[#370669]/20 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div className="flex -space-x-2">
                        {/* Simulation de petits badges de services */}
                        {school.services.map((s, i) => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">
                                {s[0]}
                            </div>
                        ))}
                    </div>
                    <Link to={`/etablissements/${school.id}`} className="flex items-center gap-2 text-sm font-bold text-[#370669] hover:gap-4 transition-all">
                        Découvrir le campus <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}