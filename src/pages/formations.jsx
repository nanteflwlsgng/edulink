import React, { useState, useMemo } from "react";
import { Search, MapPin, Clock, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_DATA } from "../dataformation"; // Assure-toi que le chemin est bon
import Navbar from "../components/Navbar";
import StudentNavbar from "../components/StudentNavbar"; // IMPORT LE NOUVEAU NAVBAR
import { FormationsSidebar } from "../components/FormationsSidebar";
import { useAuth } from "../context/AuthContext"; // IMPORT AUTH

export default function Formations() {
  const { user } = useAuth(); // Récupère l'état utilisateur
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const [filters, setFilters] = useState({
    category: [], level: [], country: [], city: [], duration: []
  });

  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const matchesSearch = searchTerm === "" || item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.school.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filters.category.length === 0 || filters.category.includes(item.category);
      const matchesLevel = filters.level.length === 0 || filters.level.includes(item.level);
      const matchesCountry = filters.country.length === 0 || filters.country.includes(item.country);
      const matchesCity = filters.city.length === 0 || filters.city.includes(item.city);
      const matchesDuration = filters.duration.length === 0 || filters.duration.includes(item.duration);
      return matchesSearch && matchesCategory && matchesLevel && matchesCountry && matchesCity && matchesDuration;
    });
  }, [searchTerm, filters]);

  // Logique compteurs simplifiée pour l'exemple
  const getFacetCounts = (key) => {
    const allValues = [...new Set(MOCK_DATA.map(item => item[key]))];
    return allValues.map(value => ({ value, count: MOCK_DATA.filter(i => i[key] === value).length }));
  };

  const sidebarCounts = {
    category: getFacetCounts('category'),
    level: getFacetCounts('level'),
    country: getFacetCounts('country'),
    city: getFacetCounts('city'),
    duration: getFacetCounts('duration'),
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      const current = prev[type];
      const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      if (type === 'country') return { ...prev, country: updated, city: [] };
      return { ...prev, [type]: updated };
    });
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.length > 1) {
      const uniqueTitles = [...new Set(MOCK_DATA.map(d => d.title))];
      const matches = uniqueTitles.filter(t => t.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else { setShowSuggestions(false); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-poppins selection:bg-[#18B49C] selection:text-white">
        
      {/* --- AFFICHAGE CONDITIONNEL NAVBAR --- */}
      {user ? <StudentNavbar /> : <Navbar />}
      
      {/* HEADER HERO */}
      <div className="pt-32 pb-20 px-6 border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
          <div>
            <span className="text-[#18B49C] font-bold uppercase tracking-widest text-xs mb-6 flex items-center justify-center gap-2">
               <span className="w-6 h-[2px] bg-[#18B49C]"></span> Catalogue 2025 <span className="w-6 h-[2px] bg-[#18B49C]"></span>
            </span>
            <h1 className="text-5xl md:text-7xl font-orange text-slate-900 leading-[0.9]">
              Explorez nos <br/>
              <span className="text-transparent font-orange bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">formations.</span>
            </h1>
          </div>
          
          <div className="w-full max-w-2xl relative group z-30">
            <div className="relative flex items-center bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-2 hover:shadow-md transition-shadow ring-1 ring-transparent focus-within:ring-[#18B49C]/20">
                <div className="pl-4 pr-3 text-gray-300 group-focus-within:text-[#370669] transition-colors"><Search className="w-6 h-6" /></div>
                <input type="text" placeholder="Ex: Master Marketing..." className="w-full bg-transparent border-none py-3 text-base text-slate-900 placeholder-gray-400 focus:outline-none" value={searchTerm} onChange={handleSearchChange} onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)} onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} />
                <button className="bg-[#370669] text-white rounded-full p-3 hover:bg-[#28143e] transition-colors"><ArrowRight className="w-5 h-5" /></button>
            </div>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-3xl shadow-xl border border-gray-50 overflow-hidden z-50 text-left">
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => setSearchTerm(s)} className="px-8 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 text-sm text-gray-600 border-b border-gray-50 last:border-0"><Search className="w-4 h-4 text-[#370669]" /> {s}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16 relative z-10">
        <FormationsSidebar filters={filters} counts={sidebarCounts} onFilterChange={handleFilterChange} onReset={() => { setFilters({ category: [], level: [], country: [], city: [], duration: [] }); setSearchTerm(""); }} />

        <main className="flex-1 w-full">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-sm font-medium text-gray-500"><span className="font-bold text-slate-900 text-lg mr-2">{filteredData.length}</span> formations trouvées</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, values]) => values.map(val => (
                <span key={val} className="inline-flex items-center gap-2 bg-[#370669] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">{val} <button onClick={() => handleFilterChange(key, val)}><X className="w-3 h-3" /></button></span>
              )))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {filteredData.map(formation => (
              <div key={formation.id} className="group relative bg-white rounded-[2rem] p-4 border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-500 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-64 h-56 md:h-auto rounded-[1.5rem] overflow-hidden relative flex-shrink-0">
                  <img src={formation.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">{formation.level}</div>
                </div>
                <div className="flex-1 py-2 pr-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                        <span className="text-[#18B49C] text-xs font-bold uppercase tracking-wider mb-2 block">{formation.category}</span>
                        <span className="text-gray-500 text-xs">{formation.school}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3 leading-tight">{formation.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-gray-500">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full"><MapPin className="w-3.5 h-3.5 text-[#27b6d8]" /> {formation.city}, {formation.country}</div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full"><Clock className="w-3.5 h-3.5 text-[#27b6d8]" /> {formation.duration}</div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Link to={`/formations/${formation.id}`} className="bg-[#f3f0fa] text-[#370669] hover:bg-[#683cc7] hover:text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300">Voir le programme</Link>
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