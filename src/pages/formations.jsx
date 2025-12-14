import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, MapPin, BookOpen, Clock, X } from "lucide-react";
import { Link } from "react-router-dom";
// Imports des composants et données
import { MOCK_DATA } from "../dataformation"; 
import { FormationsSidebar } from "../components/FormationsSidebar";
import Navbar from "../components/Navbar";

export default function Formations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // États filtres
  const [filters, setFilters] = useState({
    category: [], level: [], country: [], city: [], duration: []
  });

  // --- Logique de filtrage ---
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

  // --- Calcul des compteurs dynamiques (Facettes) ---
  const getFacetCounts = (key) => {
    const allValues = [...new Set(MOCK_DATA.map(item => item[key]))];
    return allValues.map(value => {
      const count = MOCK_DATA.filter(item => {
        const matchesValue = item[key] === value;
        const matchesSearch = searchTerm === "" || item.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Logique "ET" entre les groupes, "OU" dans le même groupe
        const matchesCategory = key === 'category' ? true : (filters.category.length === 0 || filters.category.includes(item.category));
        const matchesLevel = key === 'level' ? true : (filters.level.length === 0 || filters.level.includes(item.level));
        const matchesCountry = key === 'country' ? true : (filters.country.length === 0 || filters.country.includes(item.country));
        const matchesCity = key === 'city' ? true : (filters.city.length === 0 || filters.city.includes(item.city));
        
        // Logique hiérarchique : Si Pays sélectionné, Ville doit correspondre au pays
        const hierarchicalCheck = key === 'city' && filters.country.length > 0 ? filters.country.includes(item.country) : true;
        
        return matchesValue && matchesSearch && matchesCategory && matchesLevel && matchesCountry && matchesCity && hierarchicalCheck;
      }).length;
      return { value, count };
    });
  };

  // Préparation des props pour le Sidebar
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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-poppins">
        <Navbar/>
      {/* Header Search Hero */}
      <div className="bg-[#370669] text-white py-16 px-6 text-center shadow-lg relative z-20">
        <h1 className="text-3xl md:text-5xl font-bold mb-6">Explorez nos formations</h1>
        
        {/* Barre de recherche centrale */}
        <div className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Que voulez-vous apprendre aujourd'hui ?" 
            className="w-full py-4 pl-12 text-sm pr-4 rounded-full text-gray-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-[#683cc7]/50 transition-all"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          
          {/* Suggestions Auto */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full text-sm bg-white text-left rounded-xl shadow-xl overflow-hidden text-gray-800 z-50 animate-in fade-in slide-in-from-top-2">
              {suggestions.map((s, i) => (
                <div key={i} onClick={() => setSearchTerm(s)} className="px-5 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0">
                  <Search className="w-4 h-4 text-gray-400" /> {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8 items-start">
        
        {/* --- APPEL DU COMPOSANT SIDEBAR --- */}
        <FormationsSidebar 
          filters={filters}
          counts={sidebarCounts}
          onFilterChange={handleFilterChange}
          onReset={() => { setFilters({ category: [], level: [], country: [], city: [], duration: [] }); setSearchTerm(""); }}
        />

        {/* --- RESULTATS --- */}
        <main className="flex-1 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              Résultats <span className="text-sm font-normal text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200">{filteredData.length}</span>
            </h2>
            
            {/* Badges de filtres actifs */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, values]) => values.map(val => (
                <span key={val} className="inline-flex items-center gap-1.5 bg-white text-[#683cc7] text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-100 shadow-sm">
                  {val} <button onClick={() => handleFilterChange(key, val)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                </span>
              )))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredData.map(formation => (
              <div key={formation.id} className="bg-white p-5 rounded-2xl border border-gray-100 hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row gap-6 group">
                <div className="w-full md:w-56 h-48 md:h-auto rounded-xl overflow-hidden relative flex-shrink-0">
                  <img src={formation.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-[#370669] shadow-sm">{formation.level}</div>
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#370669] mb-1 group-hover:text-[#683cc7] transition-colors">{formation.title}</h3>
                    <p className="text-gray-500 font-medium">{formation.school}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#683cc7]" /> {formation.city}, {formation.country}</div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#683cc7]" /> {formation.duration}</div>
                      <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-[#683cc7]" /> {formation.category}</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Link to={`/formations/${formation.id}`} className="bg-[#f3f0fa] text-[#683cc7] hover:bg-[#683cc7] hover:text-white px-6 py-2 rounded-full font-bold text-sm transition-all duration-300">
                      Voir le programme
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredData.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">Aucune formation trouvée pour ces critères.</p>
                <button onClick={() => setFilters({ category: [], level: [], country: [], city: [], duration: [] })} className="text-[#683cc7] font-bold mt-2 hover:underline">Réinitialiser tout</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}