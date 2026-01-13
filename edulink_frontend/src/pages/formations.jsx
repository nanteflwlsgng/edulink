import React, { useState, useMemo , useEffect} from "react";
import { Search, MapPin, Clock, X, ArrowRight , Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
// import { MOCK_DATA } from "../dataformation"; // Assure-toi que le chemin est bon
import Navbar from "../components/Navbar";
import StudentNavbar from "../components/StudentNavbar"; // IMPORT LE NOUVEAU NAVBAR
import { FormationsSidebar } from "../components/FormationsSidebar";
import { useAuth } from "../context/AuthContext"; // IMPORT AUTH
import Footer from "../components/Footer";
import api from "../services/api";

const API_BASE_URL = "http://localhost:5000"; // ✅ AJOUTER CECI

const STATIC_FILTERS = {
  category: ["Développement Web", "Marketing Digital", "Design", "Business", "Data Science", "Santé"],
  level: ["Licence", "Master", "Bachelor", "Certificat", "MBA"],
  country: ["France", "Maroc", "Canada", "Sénégal", "États-Unis", "En ligne"],
  city: ["Antananarivo", "Fianarantsoa", "Toamasina", "En ligne", "À distance"],
  duration: ["Courte (1-3 mois)", "Moyenne (6-12 mois)", "Longue (+1 an)"]
};

export default function Formations() {
  const { user } = useAuth(); // Récupère l'état utilisateur

  const [formations, setFormations] = useState([]); // Remplace MOCK_DATA
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

        // 1. Récupération des données brutes
        const backendData = response.data.data || [];         
        
        // 2. Transformation (Mapping)
        const formattedData = backendData.map(item => {
             
             // Logique pour transformer la durée (chiffre) en texte du filtre
             let durationLabel = "Non défini";
             if (item.duree) {
                 if (item.duree <= 3) durationLabel = "Courte (1-3 mois)";
                 else if (item.duree <= 12) durationLabel = "Moyenne (4-12 mois)";
                 else durationLabel = "Longue (+1 an)";
             }

             return {
              ...item,
              id: item.id_formation,
              title: item.titre,
              description: item.description,
              
              // ✅ Mapping École & Lieu
              school: item.ecole?.nom_etablissement || "École partenaire",
              // On utilise l'adresse de l'école comme ville, ou "En ligne" par défaut
              city: item.ecole?.adresse || "En ligne", 
              country: "Madagascar", // Valeur par défaut ou champ BDD si existant
              
              // ✅ Mapping Filtres (BDD -> Frontend)
              category: item.categorie || "Général", 
              level: item.niveau || "Non spécifié", 
              
              // ✅ C'est ici la clé pour l'image
              // Si image_url existe en BDD, on colle l'URL du serveur devant. Sinon image par défaut.
              image: item.image_url 
                 ? `${API_BASE_URL}/${item.image_url}` 
                 : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60"
          };
        });

        console.log("Données prêtes pour l'affichage:", formattedData);
        setFormations(formattedData);
      } catch (err) {
        console.error("Erreur chargement formations:", err);
        setError("Impossible de charger les formations.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);
const filteredData = useMemo(() => {
    return formations.filter((item) => {
      // 1. NORMALISATION (Gérer les données manquantes et traduire les clés)
      // On utilise les champs du BACK (item.titre) pour remplir les variables
      const title = item.titre || "";
      const schoolName = item.school || ""; // Suppose que Prisma inclut l'école (include: { ecole: true })
      
      // Adaptation des champs pour les filtres
      // Note: Votre modèle Prisma n'a pas de champ 'categorie', 'niveau' ou 'ville' visible. 
      // Assurez-vous qu'ils existent ou utilisez des valeurs par défaut.
      const category = item.categorie || "Général"; 
      const level = item.niveau || "Non spécifié";
      const country = item.ecole?.pays || "Madagascar";
      const city = item.city || "En ligne";
      const duration = item.duree ? String(item.duree) : "Non défini";
      
      // Image par défaut si pas d'image en BDD
      // item.image n'est pas dans votre modèle Prisma, on met une placeholder
      item.image = item.image || "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=60";

      // 2. LOGIQUE DE RECHERCHE
      const searchString = searchTerm.toLowerCase();
      const matchesSearch = 
        searchTerm === "" || 
        title.toLowerCase().includes(searchString) || 
        schoolName.toLowerCase().includes(searchString);

      // 3. LOGIQUE DE FILTRE (On utilise les variables locales définies ci-dessus)
      const matchesCategory = filters.category.length === 0 || filters.category.includes(category);
      const matchesLevel = filters.level.length === 0 || filters.level.includes(level);
      const matchesCountry = filters.country.length === 0 || filters.country.includes(country);
      const matchesCity = filters.city.length === 0 || filters.city.includes(city);
      const matchesDuration = filters.duration.length === 0 || filters.duration.includes(duration);

      // On injecte les valeurs calculées dans l'objet pour l'affichage HTML plus bas
      // (Car votre HTML utilise item.title, item.school, etc.)
      item.title = title;
      item.school = schoolName;
      item.category = category;
      item.level = level;
      item.country = country;
      item.city = city;
      item.duration = duration;

      return matchesSearch && matchesCategory && matchesLevel && matchesCountry && matchesCity && matchesDuration;
    });
  }, [searchTerm, filters, formations]);

  // Logique compteurs simplifiée pour l'exemple
  const getFacetCounts = (key) => {
    // 1. On prend la liste de choix STATIQUE définie tout en haut
    const options = STATIC_FILTERS[key] || [];

    // 2. Pour chaque option du menu, on compte les formations correspondantes
    return options.map((optionValue) => {
      // On compte combien de formations dans le state 'formations' ont cette valeur
      const count = formations.filter((f) => {
          // Sécurité : on s'assure que la valeur existe
          const formationValue = f[key] ? f[key].toString() : "";
          // Comparaison insensible à la casse (optionnel)
          return formationValue.toLowerCase() === optionValue.toLowerCase();
      }).length;

      return {
        value: optionValue, // Le texte affiché (ex: "Développement Web")
        count: count        // Le nombre trouvé (ex: 5)
      };
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
            {/* ETAT CHARGEMENT */}
            {loading && (
                <div className="flex flex-col items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 text-[#18B49C] animate-spin mb-4" />
                    <p className="text-gray-500">Chargement des formations...</p>
                </div>
            )}

            {/* ETAT ERREUR */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                    {error}
                </div>
            )}
             {/* LISTE */}
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
      <Footer/>
    </div>
  );
}