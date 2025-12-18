import React, { useState, useMemo, useRef } from "react";
import { Search, MapPin, Clock, X, ArrowRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { MOCK_DATA } from "../dataformation"; 
import Navbar from "../components/Navbar";
import { FormationsSidebar } from "../components/FormationsSidebar";

// Petit composant de design pour les checkboxes stylisées (Interne)
const StyledFilterItem = ({ label, count, isSelected, onClick }) => (
  <div 
    onClick={onClick}
    className="group flex items-center justify-between py-2 cursor-pointer transition-all"
  >
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-[#18B49C] border-[#18B49C]' : 'border-gray-200 group-hover:border-[#18B49C]'}`}>
        {isSelected && <span className="text-white text-[10px]">✕</span>}
      </div>
      <span className={`text-sm ${isSelected ? 'text-slate-900 font-bold' : 'text-gray-500 group-hover:text-slate-900'} transition-colors`}>
        {label}
      </span>
    </div>
    <span className="text-xs font-mono text-gray-300">{count}</span>
  </div>
);

export default function Formations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // États filtres
  const [filters, setFilters] = useState({
    category: [], level: [], country: [], city: [], duration: []
  });

  // --- Logique de filtrage (INCHANGÉE) ---
  const filteredData = useMemo(() => {
    return MOCK_DATA.filter((item) => {
      const matchesSearch = searchTerm === "" || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.school.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.category.length === 0 || filters.category.includes(item.category);
      const matchesLevel = filters.level.length === 0 || filters.level.includes(item.level);
      const matchesCountry = filters.country.length === 0 || filters.country.includes(item.country);
      const matchesCity = filters.city.length === 0 || filters.city.includes(item.city);
      const matchesDuration = filters.duration.length === 0 || filters.duration.includes(item.duration);

      return matchesSearch && matchesCategory && matchesLevel && matchesCountry && matchesCity && matchesDuration;
    });
  }, [searchTerm, filters]);

  // --- Calcul des compteurs (INCHANGÉ) ---
  const getFacetCounts = (key) => {
    const allValues = [...new Set(MOCK_DATA.map(item => item[key]))];
    return allValues.map(value => {
      const count = MOCK_DATA.filter(item => {
        const matchesValue = item[key] === value;
        const matchesSearch = searchTerm === "" || item.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = key === 'category' ? true : (filters.category.length === 0 || filters.category.includes(item.category));
        const matchesLevel = key === 'level' ? true : (filters.level.length === 0 || filters.level.includes(item.level));
        const matchesCountry = key === 'country' ? true : (filters.country.length === 0 || filters.country.includes(item.country));
        const matchesCity = key === 'city' ? true : (filters.city.length === 0 || filters.city.includes(item.city));
        
        const hierarchicalCheck = key === 'city' && filters.country.length > 0 ? filters.country.includes(item.country) : true;
        
        return matchesValue && matchesSearch && matchesCategory && matchesLevel && matchesCountry && matchesCity && hierarchicalCheck;
      }).length;
      return { value, count };
    });
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
        <Navbar/>
      
      {/* HEADER HERO (Centré & Joli) */}
      <div className="pt-32 pb-20 px-6 border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
          
          {/* Titre Centré */}
          <div>
            <span className="text-[#18B49C] font-bold uppercase tracking-widest text-xs mb-6 flex items-center justify-center gap-2">
               <span className="w-6 h-[2px] bg-[#18B49C]"></span> Catalogue 2025 <span className="w-6 h-[2px] bg-[#18B49C]"></span>
            </span>
            <h1 className="text-5xl md:text-7xl font-orange text-slate-900 leading-[0.9]">
              Explorez nos <br/>
              <span className="text-transparent font-orange bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">
                formations.
              </span>
            </h1>
          </div>
          
          {/* BARRE DE RECHERCHE FLOTTANTE CENTRÉE */}
          <div className="w-full max-w-2xl relative group z-30">
            <div className="relative flex items-center bg-white rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-2 transition-shadow duration-300 hover:shadow-[0_20px_40px_rgba(24,180,156,0.15)] ring-1 ring-transparent focus-within:ring-[#18B49C]/20">
                
                {/* Icône Loupe à gauche */}
                <div className="pl-4 pr-3 text-gray-300 group-focus-within:text-[#370669] transition-colors">
                    <Search className="w-6 h-6" />
                </div>

                <input 
                  type="text" 
                  placeholder="Ex: Master Marketing, Licence Droit..." 
                  className="w-full bg-transparent border-none py-3 text-base text-slate-900 placeholder-gray-400 focus:outline-none focus:ring-0"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />

                {/* Bouton d'action à droite */}
                <button className="bg-[#370669] text-white rounded-full p-3 hover:bg-[#28143e] transition-colors shadow-md shadow-[#18B49C]/20">
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
            
            {/* Suggestions (Centrées sous la barre) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-4 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden z-50 text-left">
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => setSearchTerm(s)} className="px-8 py-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 text-sm text-gray-600 transition-colors border-b border-gray-50 last:border-0">
                    <Search className="w-4 h-4 text-[#370669]" /> 
                    <span dangerouslySetInnerHTML={{ __html: s.replace(new RegExp(`(${searchTerm})`, 'gi'), '<strong class="text-slate-900">$1</strong>') }} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16 relative z-10">
        
        {/* --- SIDEBAR FILTRES --- */}
        <FormationsSidebar 
          filters={filters}
          counts={sidebarCounts}
          onFilterChange={handleFilterChange}
          onReset={() => { setFilters({ category: [], level: [], country: [], city: [], duration: [] }); setSearchTerm(""); }}
        />

        {/* --- RESULTATS --- */}
        <main className="flex-1 w-full">
          {/* Top Bar Résultats */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h2 className="text-sm font-medium text-gray-500">
              <span className="font-bold text-slate-900 text-lg mr-2">{filteredData.length}</span> formations trouvées
            </h2>
            
            {/* Badges Actifs Minimalistes */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, values]) => values.map(val => (
                <span key={val} className="inline-flex items-center gap-2 bg-[#370669] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  {val} <button onClick={() => handleFilterChange(key, val)} className="hover:text-[#27b6d8] transition-colors"><X className="w-3 h-3" /></button>
                </span>
              )))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {filteredData.map(formation => (
              <div key={formation.id} className="group relative bg-white rounded-[2rem] p-4 border border-transparent hover:border-gray-100 hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all duration-500 flex flex-col md:flex-row gap-8">
                
                {/* Image */}
                <div className="w-full md:w-64 h-56 md:h-auto rounded-[1.5rem] overflow-hidden relative flex-shrink-0">
                  <img src={formation.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                  {/* Badge Niveau Flottant */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                      {formation.level}
                  </div>
                </div>
                
                {/* Contenu */}
                <div className="flex-1 py-2 pr-2 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                        <span className="text-[#18B49C] text-xs font-bold uppercase tracking-wider mb-2 block">{formation.category}</span>
                        <span className="text-gray-500 text-xs">{formation.school}</span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-3  transition-colors font-poppins leading-tight">
                        {formation.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-4 mt-4 text-xs font-medium text-gray-500">
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                          <MapPin className="w-3.5 h-3.5 text-[#27b6d8]" /> {formation.city}, {formation.country}
                      </div>
                      <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-[#27b6d8]" /> {formation.duration}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                  <Link to={`/formations/${formation.id}`} className="bg-[#f3f0fa] text-[#370669] hover:bg-[#683cc7] hover:text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300">
                      Voir le programme
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredData.length === 0 && (
              <div className="text-center py-24 bg-gray-50 rounded-[2rem]">
                <p className="text-gray-400 font-poppins text-lg mb-4">Aucune formation ne correspond à vos critères.</p>
                <button onClick={() => setFilters({ category: [], level: [], country: [], city: [], duration: [] })} className="text-[#370669] font-bold text-sm border-b border-[#370669] pb-0.5 hover:opacity-80">
                    Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}