import React, { useState, useMemo, useEffect } from "react";
import { Search, MapPin, Clock, X, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import StudentNavbar from "../components/StudentNavbar";
import { FormationsSidebar } from "../components/FormationsSidebar";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import api from "../services/api";

// ==========================================
// 1. DÉFINITION UNIQUE DES DONNÉES (Source de vérité)
// ==========================================

const CATEGORIES = {
  INFORMATIQUE: "Informatique & Tech",
  MARKETING: "Marketing Digital",
  COMMERCE: "Commerce & Vente",
  SCIENCE: "Sciences",
  POLITIQUE: "Science Politique",
  TECHNOLOGIE: "Technologie",
  ELECTRONIQUE: "Électronique",
  AUTRE: "Autre"
};

const LEVELS = {
  BAC: "Niveau Bac",
  CERTIFICAT: "Certificat Pro",
  LICENCE: "Licence",
  MASTER: "Master",
  DOCTORAT: "Doctorat",
  PROFESSEUR: "Professeur"
};

const DURATIONS = {
  MOIS_3: "3 Mois",
  MOIS_6: "6 Mois",
  AN_1: "1 An",
  ANS_2: "2 Ans",
  ANS_3: "3 Ans",
  ANS_5: "5 Ans"
};

const CONTINENTS = {
  AFRIQUE: "Afrique",
  EUROPE: "Europe",
  AMERIQUE: "Amérique",
  ASIE: "Asie",
  OCEANIE: "Océanie"
};

// ==========================================
// 2. GÉNÉRATION AUTOMATIQUE (Ne pas toucher)
// ==========================================

// Fusionne tout pour la traduction facile (Back -> Front)
const ALL_LABELS = {
  ...CATEGORIES,
  ...LEVELS,
  ...DURATIONS,
  ...CONTINENTS
};

// Génère les options pour la Sidebar automatiquement
const STATIC_FILTERS = {
  category: Object.values(CATEGORIES), // Donne ["Informatique & Tech", "Marketing Digital"...]
  level: Object.values(LEVELS),
  duration: Object.values(DURATIONS),
  country: Object.values(CONTINENTS), // On filtre par Continent
  city: ["Londres", "Boston", "Paris", "New York","Tokyo","Berlin","Melbourne","Toronto","San Francisco","Zurich"] // Les villes restent manuelles ou dynamiques
};

// ==========================================
// 3. COMPOSANT REACT
// ==========================================

export default function Formations() {
  const { user } = useAuth();
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [filters, setFilters] = useState({
    category: [], level: [], country: [], city: [], duration: []
  });

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/formations");
        const backendData = response.data.data || [];

        // Transformation (Mapping)
        const formattedData = backendData.map(item => ({
          id: item.id_formation,
          title: item.titre,
          description: item.description,

          // Relation Ecole
          school: item.ecole?.nom || "École partenaire",

          // Géographie
          city: item.ville || item.ecole?.ville || "En ligne",
          country: item.pays || "International", // Le pays (ex: Sénégal)
          
          // On ajoute le continent traduit pour le filtrage
          continentLabel: ALL_LABELS[item.continent] || "International",

          // --- MAPPING DES ENUMS ---
          // On utilise ALL_LABELS qui contient tout
          category: ALL_LABELS[item.categorie] || item.categorie,
          level: ALL_LABELS[item.niveau] || item.niveau,
          duration: ALL_LABELS[item.duree_standard] || "Non défini",

          image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
        }));

        console.log("Données formatées:", formattedData);
        setFormations(formattedData);
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError("Impossible de charger les formations.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const filteredData = useMemo(() => {
    return formations.filter((item) => {
      const title = item.title || "";
      const schoolName = item.school || "";

      // Filtres
      const category = item.category || "Autre";
      const level = item.level || "Non spécifié";
      const city = item.city || "En ligne";
      const duration = item.duration || "Non défini";
      
      // LOGIQUE SPÉCIALE POUR LE PAYS/CONTINENT
      // Le filtre s'appelle 'country' mais contient des Continents (Afrique)
      // On vérifie si le continent de la formation correspond OU si le pays correspond
      const region = item.continentLabel || ""; 
      const pays = item.country || "";

      const matchesSearch =
        searchTerm === "" ||
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schoolName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filters.category.length === 0 || filters.category.includes(category);
      const matchesLevel = filters.level.length === 0 || filters.level.includes(level);
      
      // Si on filtre "Afrique", on garde les formations dont le continent est "Afrique"
      const matchesCountry = filters.country.length === 0 || filters.country.includes(region) || filters.country.includes(pays);
      
      const matchesCity = filters.city.length === 0 || filters.city.includes(city);
      const matchesDuration = filters.duration.length === 0 || filters.duration.includes(duration);

      return matchesSearch && matchesCategory && matchesLevel && matchesCountry && matchesCity && matchesDuration;
    });
  }, [searchTerm, filters, formations]);

  // Logique compteurs (Liée à STATIC_FILTERS qui est lié aux Mappings)
  const getFacetCounts = (key) => {
    const options = STATIC_FILTERS[key] || [];

    return options.map((optionValue) => {
      const count = formations.filter((f) => {
        let valueToCheck = f[key] ? f[key].toString() : "";

        // Cas particulier : Si on filtre 'country', on compare souvent avec le continentLabel
        if (key === 'country') {
            // Si optionValue est "Afrique", on regarde f.continentLabel
            if (f.continentLabel === optionValue) return true;
        }

        return valueToCheck.toLowerCase() === optionValue.toLowerCase();
      }).length;

      return { value: optionValue, count: count };
    });
  };

  const sidebarCounts = useMemo(() => ({
    category: getFacetCounts('category'),
    level: getFacetCounts('level'),
    country: getFacetCounts('country'),
    city: getFacetCounts('city'),
    duration: getFacetCounts('duration'),
  }), [formations]);

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
      const uniqueTitles = [...new Set(formations.map(d => d.title))];
      const matches = uniqueTitles.filter(t => t.toLowerCase().includes(val.toLowerCase())).slice(0, 5);
      setSuggestions(matches);
      setShowSuggestions(true);
    } else { setShowSuggestions(false); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-poppins selection:bg-[#18B49C] selection:text-white">

      {user ? <StudentNavbar /> : <Navbar />}

      {/* HEADER HERO */}
      <div className="pt-32 pb-20 px-6 border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-10">
          <div>
            <span className="text-[#18B49C] font-bold uppercase tracking-widest text-xs mb-6 flex items-center justify-center gap-2">
              <span className="w-6 h-[2px] bg-[#18B49C]"></span> Catalogue 2025 <span className="w-6 h-[2px] bg-[#18B49C]"></span>
            </span>
            <h1 className="text-5xl md:text-7xl font-orange text-slate-900 leading-[0.9]">
              Explorez nos <br />
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
          {loading && (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-10 h-10 text-[#18B49C] animate-spin mb-4" />
              <p className="text-gray-500">Chargement des formations...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
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
                        <Link to={`/formations/${formation.id}`} className="bg-[#f3f0fa] text-[#370669] hover:bg-[#370669] hover:text-white px-6 py-2 rounded-lg font-bold text-sm transition-all duration-300">Voir le programme</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}