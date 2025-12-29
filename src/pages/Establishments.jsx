import React, { useState, useMemo } from "react";
import { Search, MapPin, Users, Building2, X, ArrowRight, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StudentNavbar from "../components/StudentNavbar"; // IMPORT NAVBAR ÉTUDIANT
import { useAuth } from "../context/AuthContext"; // IMPORT AUTH
import Footer from "../components/Footer";

// --- MOCK DATA (Données simlées pour les écoles) ---
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
    tags: ["Recherche", "Patrimoine"]
  },
  {
    id: 2,
    name: "HEC Paris",
    type: "Grande École",
    city: "Jouy-en-Josas",
    country: "France",
    students: "4,500",
    image: "https://images.unsplash.com/photo-1523050853023-8c2d275438b3?auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/HEC_Paris_logo.svg/2560px-HEC_Paris_logo.svg.png",
    tags: ["Business", "International"]
  },
  {
    id: 3,
    name: "ENI Fianarantsoa",
    type: "École d'Ingénieur",
    city: "Fianarantsoa",
    country: "Madagascar",
    students: "2,000",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/fr/archive/e/e4/20190127192629%21Logo_ENI.png",
    tags: ["Informatique", "Innovation"]
  },
  {
    id: 4,
    name: "UCM",
    type: "Université Privée",
    city: "Antananarivo",
    country: "Madagascar",
    students: "3,500",
    image: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Logo_UCM.png/600px-Logo_UCM.png",
    tags: ["Sciences Sociales", "Management"]
  },
  {
    id: 5,
    name: "Polytechnique Montréal",
    type: "École d'Ingénieur",
    city: "Montréal",
    country: "Canada",
    students: "9,000",
    image: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&q=80",
    logo: "https://upload.wikimedia.org/wikipedia/fr/thumb/6/6e/Polytechnique_Montr%C3%A9al_logo.svg/1200px-Polytechnique_Montr%C3%A9al_logo.svg.png",
    tags: ["Génie", "Recherche"]
  },
];

// --- COMPOSANT SIDEBAR LOCAL (Pour adapter les filtres aux Écoles) ---
const EstablishmentsSidebar = ({ filters, counts, onFilterChange, onReset }) => {
  const sections = [
    { key: "type", label: "Type d'établissement" },
    { key: "country", label: "Pays" },
    { key: "city", label: "Ville" },
  ];

  return (
    <aside className="w-full lg:w-72 space-y-8 flex-shrink-0">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900">Filtres</h3>
        <button onClick={onReset} className="text-xs text-[#18B49C] font-bold hover:underline">Réinitialiser</button>
      </div>
      
      {sections.map((section) => (
        <div key={section.key} className="border-b border-gray-100 pb-6 last:border-0">
          <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{section.label}</h4>
          <div className="space-y-3">
            {counts[section.key].map((item) => (
              <label key={item.value} className="flex items-center group cursor-pointer">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-md checked:bg-[#370669] checked:border-[#370669] transition-all"
                    checked={filters[section.key]?.includes(item.value)}
                    onChange={() => onFilterChange(section.key, item.value)}
                  />
                  <svg className="absolute w-3 h-3 text-white left-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5.917L5.724 10.5L16 1.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="ml-3 text-sm text-gray-600 group-hover:text-[#370669] transition-colors flex-1">{item.value}</span>
                <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{item.count}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Carte Appel à l'action pour les écoles */}
      <div className="p-6 bg-[#370669] rounded-2xl text-white relative overflow-hidden group mt-6">
        <div className="relative z-10">
           <Trophy className="w-6 h-6 mb-3 text-[#27b6d8]" />
           <h4 className="font-bold text-sm mb-2">Vous êtes un établissement ?</h4>
           <p className="text-[10px] text-white/70 leading-relaxed mb-4">Rejoignez notre réseau et boostez votre visibilité.</p>
           <Link to="/compte" className="inline-block text-[10px] font-bold uppercase tracking-widest bg-white text-[#370669] px-4 py-2 rounded-full hover:scale-105 transition-transform">
               Enregistrer mon école
           </Link>
        </div>
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
     </div>
    </aside>
  );
};

export default function Establishments() {
  const { user } = useAuth(); // Récupère l'état utilisateur
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // États des filtres adaptés aux écoles
  const [filters, setFilters] = useState({
    type: [], country: [], city: []
  });

  // Logique de filtrage
  const filteredData = useMemo(() => {
    return SCHOOL_DATA.filter((item) => {
      const matchesSearch = searchTerm === "" || item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filters.type.length === 0 || filters.type.includes(item.type);
      const matchesCountry = filters.country.length === 0 || filters.country.includes(item.country);
      const matchesCity = filters.city.length === 0 || filters.city.includes(item.city);
      
      return matchesSearch && matchesType && matchesCountry && matchesCity;
    });
  }, [searchTerm, filters]);

  // Logique compteurs pour la sidebar
  const getFacetCounts = (key) => {
    const allValues = [...new Set(SCHOOL_DATA.map(item => item[key]))];
    return allValues.map(value => ({ value, count: SCHOOL_DATA.filter(i => i[key] === value).length }));
  };

  const sidebarCounts = {
    type: getFacetCounts('type'),
    country: getFacetCounts('country'),
    city: getFacetCounts('city'),
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      // Si on change de pays, on pourrait réinitialiser la ville (optionnel)
      if (type === 'country') return { ...prev, country: updated, city: [] };
      return { ...prev, [type]: updated };
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.length > 1) {
      const uniqueNames = [...new Set(SCHOOL_DATA.map(d => d.name))];
      const matches = uniqueNames.filter(t => t.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else { setShowSuggestions(false); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-poppins selection:bg-[#370669] selection:text-white">
        
      {/* --- AFFICHAGE CONDITIONNEL NAVBAR --- */}
      {user ? <StudentNavbar /> : <Navbar />}
      
      {/* HEADER HERO */}
      <div className="pt-32 pb-20 px-6 border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
          <div>
            <span className="text-[#370669] font-bold uppercase tracking-widest text-xs mb-6 flex items-center justify-center gap-2">
               <span className="w-6 h-[2px] bg-[#370669]"></span> Réseau Partenaire 2025 <span className="w-6 h-[2px] bg-[#370669]"></span>
            </span>
            <h1 className="text-5xl md:text-7xl font-orange text-slate-900 leading-[0.9]">
              Trouvez votre <br/>
              <span className="text-transparent font-orange bg-clip-text bg-gradient-to-r from-[#370669] to-[#683cc7]">Campus.</span>
            </h1>
          </div>
          
          <div className="w-full max-w-2xl relative group z-30">
            <div className="relative flex items-center bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-2 hover:shadow-md transition-shadow ring-1 ring-transparent focus-within:ring-[#370669]/20">
                <div className="pl-4 pr-3 text-gray-300 group-focus-within:text-[#370669] transition-colors"><Search className="w-6 h-6" /></div>
                <input type="text" placeholder="Ex: HEC Paris, Fianarantsoa..." className="w-full bg-transparent border-none py-3 text-base text-slate-900 placeholder-gray-400 focus:outline-none" value={searchTerm} onChange={handleSearchChange} onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} />
                <button className="bg-[#370669] text-white rounded-full p-3 hover:bg-[#28143e] transition-colors"><ArrowRight className="w-5 h-5" /></button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-3xl shadow-xl border border-gray-50 overflow-hidden z-50 text-left">
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => setSearchTerm(s)} className="px-8 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 text-sm text-gray-600 border-b border-gray-50 last:border-0"><Building2 className="w-4 h-4 text-[#370669]" /> {s}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16 relative z-10">
        
        {/* SIDEBAR ÉTABLISSEMENTS */}
        <EstablishmentsSidebar 
            filters={filters} 
            counts={sidebarCounts} 
            onFilterChange={handleFilterChange} 
            onReset={() => { setFilters({ type: [], country: [], city: [] }); setSearchTerm(""); }} 
        />

        <main className="flex-1 w-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-sm font-medium text-gray-500"><span className="font-bold text-slate-900 text-lg mr-2">{filteredData.length}</span> écoles trouvées</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, values]) => values.map(val => (
                <span key={val} className="inline-flex items-center gap-2 bg-[#370669] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">{val} <button onClick={() => handleFilterChange(key, val)}><X className="w-3 h-3" /></button></span>
              )))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {filteredData.map(school => (
              <div key={school.id} className="group relative bg-white rounded-[2rem] p-4 border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-8">
                {/* Image Section */}
                <div className="w-full md:w-64 h-56 md:h-auto rounded-[1.5rem] overflow-hidden relative flex-shrink-0">
                  <img src={school.image} alt={school.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm flex items-center gap-1">
                     <Users className="w-3 h-3" /> {school.students}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="flex-1 py-2 pr-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                        <span className="text-[#370669] text-xs font-bold uppercase tracking-wider mb-2 block">{school.type}</span>
                        {/* Tags */}
                        <div className="flex gap-2">
                           {school.tags.map(tag => (
                               <span key={tag} className="bg-gray-50 text-gray-500 text-[10px] px-2 py-0.5 rounded-md border border-gray-100">{tag}</span>
                           ))}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 mt-1">
                        <div className="w-10 h-10 p-1 bg-white border border-gray-100 rounded-lg shadow-sm">
                            <img src={school.logo} alt="logo" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{school.name}</h3>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-gray-500">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full"><MapPin className="w-3.5 h-3.5 text-[#27b6d8]" /> {school.city}, {school.country}</div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full"><Building2 className="w-3.5 h-3.5 text-[#27b6d8]" /> Campus Principal</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Link to={`/etablissements/${school.id}`} className="bg-[#f3f0fa] text-[#370669] hover:bg-[#370669] hover:text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300 flex items-center gap-2">
                        Découvrir le campus <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer/>
    </div>
  );
}