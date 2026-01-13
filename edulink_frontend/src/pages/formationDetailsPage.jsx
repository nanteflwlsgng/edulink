import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  MapPin, Clock, Calendar, Globe, Monitor, 
  School, Mail, Phone, CheckCircle, HelpCircle, 
  ArrowLeft, Share2, Heart, Star, TrendingUp, AlertCircle,
  ArrowRight, MessageSquare, Send, User, Lock,Hourglass, ReceiptText, Loader2
} from "lucide-react";

// --- IMPORTS ---
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar"; 
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";
import api from "../services/api";

const API_BASE_URL = "http://localhost:5000";

// --- SOUS-COMPOSANTS UI (Inchangés) ---
const RatingBar = ({ star, percentage, count }) => (
  <div className="flex items-center gap-3 text-xs mb-1.5 animate-fadeIn">
    <span className="w-8 font-bold text-gray-500 flex items-center gap-1">
        {star} <Star className="w-3 h-3 text-gray-300" />
    </span>
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full bg-[#ffb400] rounded-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}></div>
    </div>
    <span className="w-8 text-right text-gray-400">{count}</span>
  </div>
);

const ReviewCard = ({ name, date, rating, comment, avatarColor }) => (
  <div className="border-b border-gray-50 py-6 last:border-0 last:pb-0">
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-full ${avatarColor || 'bg-gray-200'} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
        {name.charAt(0)}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h5 className="font-bold text-slate-900 text-sm">{name}</h5>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{date}</span>
          </div>
          <div className="flex text-[#ffb400] gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3" fill={i < rating ? "currentColor" : "none"} stroke="currentColor" />
            ))}
          </div>
        </div>
        <p className="mt-2 text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-xl rounded-tl-none">
          {comment}
        </p>
      </div>
    </div>
  </div>
);

const DetailItem = ({ icon: Icon, label, value, isLink }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all">
        <div className="p-2 bg-white rounded-full text-[#370669] shadow-sm"><Icon className="w-4 h-4"/></div>
        <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] text-gray-400 uppercase font-bold">{label}</span>
            {isLink ? (
                <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-sm font-medium truncate hover:text-[#18B49C] hover:underline cursor-pointer">
                    {value}
                </a>
            ) : (
                <span className="text-sm font-medium truncate text-slate-700">{value}</span>
            )}
        </div>
    </div>
);

// --- PAGE PRINCIPALE ---
export default function FormationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // États locaux
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFavorite, setIsFavorite] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // ✅ RECUPERATION DONNEES REELLES (API)
  useEffect(() => {
    const fetchFormation = async () => {
      try {
        setLoading(true);
        // On récupère une formation par son ID (assurez-vous que cette route existe au backend)
        // Sinon, on peut filtrer depuis la liste globale, mais la route dédiée est mieux.
        // Exemple backend : router.get('/:id', ...)
        
        // Comme nous n'avons pas encore vu la route 'getOne', on suppose que vous filtrez côté client ou que la route existe.
        // Si la route /formations/:id n'existe pas, il faut la créer au Backend.
        // Pour l'instant, je vais chercher TOUTES les formations et filtrer (méthode de secours).
        
        const response = await api.get(`/formations/${id}`); 
        // const allFormations = response.data.data || [];
        const found = response.data.data;

        if (!found) {
            setError("Formation introuvable");
            setLoading(false);
            return;
        }

        // MAPPING DES DONNÉES (Mélange API + Statique pour ce que vous voulez garder statique)
        const mappedData = {
            id: found.id_formation,
            title: found.titre,
            description: found.description,
            price: `${found.prix} Ar`,
            duration: `${found.duree} mois`,
            category: found.categorie || "Général",
            level: found.niveau || "Non spécifié",
            
            // --- Données ÉTABLISSEMENT (Dynamiques depuis la BDD) ---
            school: found.ecole?.nom_etablissement || found.ecole?.nom || "École partenaire",
            schoolDescription: found.ecole?.description || "Aucune description disponible pour cet établissement.",
            schoolEmail: found.ecole?.email || "Non renseigné", // Si email dans le modèle
            schoolPhone: found.ecole?.telephone || "Non renseigné",
            schoolWebsite: found.ecole?.site_web || "Non renseigné",
            creationDate: found.ecole?.date_fondation 
                ? new Date(found.ecole.date_fondation).getFullYear() 
                : "Non renseigné",
            city: found.ecole?.adresse || "En ligne",
            country: "Madagascar", // Statique ou depuis BDD si champ pays existe
            
            // Image École (Couverture établissement ou logo si pas de couverture)
            schoolImage: found.ecole?.photo_etablissement 
                ? `${API_BASE_URL}/${found.ecole.photo_etablissement}`
                : "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",

            // --- Données STATIQUES (Laissées comme demandé) ---
            updatedAt: "Mis à jour il y a 2 jours",
            language: found.langue || "Français & Anglais",
            startDate: found.date_debut ? new Date(found.date_debut).toLocaleDateString() : "À définir",
            mode: found.mode || "Hybride",
            type: "Sélection de dossier",
            end_date: found.date_fin ? new Date(found.date_fin).toLocaleDateString() : "À définir",
            insertionRate: "94%", 
            paymentType: "/ an",
            conditions: found.conditions || ["Baccalauréat", "Dossier", "Entretien"], // On prend celles de la BDD si dispos
            reviews: {
                average: 4.8,
                total: 128,
                distribution: [
                    { star: 5, percentage: 75, count: 96 },
                    { star: 4, percentage: 15, count: 19 },
                    { star: 3, percentage: 8, count: 10 },
                    { star: 2, percentage: 2, count: 3 },
                    { star: 1, percentage: 0, count: 0 },
                ],
                items: [
                    { id: 1, name: "Lucas M.", date: "Il y a 2 jours", rating: 5, comment: "Excellent cursus.", avatarColor: "bg-blue-500" },
                    { id: 2, name: "Sarah K.", date: "Il y a 1 semaine", rating: 4, comment: "Contenu dense.", avatarColor: "bg-purple-500" }
                ]
            }
        };

        setFormation(mappedData);
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError("Erreur chargement");
        setLoading(false);
      }
    };

    fetchFormation();
  }, [id]);

  // --- LOGIQUES D'INTERACTION ---

  const handleApply = () => {
    if (user) {
        navigate(`/candidature/${id}`);
    } else {
        navigate("/compte", { state: { from: `/candidature/${id}` } });
    }
};

  const handleFavorite = () => {
    if (user) {
        setIsFavorite(!isFavorite);
    } else {
        navigate("/compte", { state: { from: `/formations/${id}` } });
    }
  };

  const handleSubmitReview = () => {
    alert("Avis publié !");
    setShowReviewForm(false);
    setReviewText("");
  };

  // --- RENDER ---
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#18B49C]"/></div>;
  if (error || !formation) return <div className="min-h-screen flex items-center justify-center text-slate-500">{error || "Formation introuvable."}</div>;

  return (
    <div className="min-h-screen text-slate-800 font-poppins selection:bg-[#18B49C] selection:text-white">
      
      {user ? <StudentNavbar /> : <Navbar />}

      {/* Fil d'ariane / Retour */}
      <div className="pt-28 pb-6 px-6 max-w-7xl mx-auto">
        <Link to="/formations" className="group inline-flex items-center gap-2 text-gray-500 hover:text-[#370669] transition-colors mb-4 text-sm font-medium">
          <div className="p-1 rounded-full bg-white group-hover:bg-[#370669] group-hover:text-white transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Retour au catalogue
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* === GAUCHE (Contenu) === */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* --- HERO SECTION --- */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#18B49C]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex gap-3">
                    <span className="bg-[#18B49C] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{formation.category}</span>
                    <span className="bg-[#f0fdfa] text-[#18B49C] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#18B49C]/20">{formation.level}</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#370669] bg-[#370669]/5 px-3 py-1.5 rounded-lg">
                        <TrendingUp className="w-4 h-4" />
                        <span>{formation.insertionRate} d'insertion</span>
                    </div>

                    <button 
                        onClick={handleFavorite}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-300 border ${
                            isFavorite 
                            ? 'bg-red-50 border-red-100 text-red-500 shadow-inner' 
                            : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400'
                        }`}
                        title={user ? "Sauvegarder ce cours" : "Connectez-vous pour sauvegarder"}
                    >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                        <span className="text-xs font-bold hidden sm:inline">{isFavorite ? 'Sauvegardé' : 'Sauvegarder'}</span>
                    </button>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-[1.1]">
                {formation.title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-gray-100 pt-6 mt-6">
                <div className="flex items-center gap-4 group/school cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl group-hover/school:scale-105 transition-transform">🏫</div>
                  <div>
                    {/* NOM DYNAMIQUE DE L'ECOLE */}
                    <h3 className="font-bold text-slate-900 text-lg group-hover/school:text-[#370669] transition-colors">{formation.school}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 text-[#18B49C]" /> {formation.city}, {formation.country}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-[#fffbf0] px-4 py-2 rounded-xl border border-[#ffe08a]">
                    <div className="flex text-[#ffb400]"><Star className="w-4 h-4 fill-current" /><span className="text-slate-900 font-bold ml-1">{formation.reviews.average}</span></div>
                    <span className="text-xs text-gray-400">({formation.reviews.total} avis)</span>
                </div>
              </div>
            </div>
          </div>

          {/* --- DETAILS (Statique sauf dates) --- */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 bg-[#18B49C] rounded-full"></div>
              <h3 className="text-xl font-bold text-slate-900">Détails du programme</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Clock, label: "Durée", value: formation.duration, color: "text-purple-600", bg: "bg-purple-50" },
                { icon: Globe, label: "Langues", value: formation.language, color: "text-blue-600", bg: "bg-blue-50" },
                { icon: Calendar, label: "Rentrée", value: formation.startDate, color: "text-teal-600", bg: "bg-teal-50" },
                { icon: Monitor, label: "Format", value: formation.mode, color: "text-orange-600", bg: "bg-orange-50" },
                { icon: ReceiptText, label: "Admission", value: formation.type, color: "text-green-600", bg: "bg-green-50" },
                { icon: Hourglass, label: "date limite de depot de dossier", value: formation.end_date, color: "text-red-600", bg: "bg-red-50" },
              ].map((item, index) => (
                  <div key={index} className="flex items-center gap-5 p-5 rounded-2xl border border-gray-50 bg-[#fafbfc] hover:bg-white hover:shadow-lg transition-all duration-300">
                      <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}><item.icon className="w-6 h-6" /></div>
                      <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{item.label}</p>
                          <p className="font-bold text-slate-800 text-sm">{item.value}</p>
                      </div>
                  </div>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-gray-100">
                <h4 className="font-bold text-base mb-3 text-slate-900">Description :</h4>
                <p className="text-gray-600 leading-relaxed text-sm">{formation.description}</p>
            </div>
          </div>

          {/* --- AVIS (Statique) --- */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100">
             <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-1 h-6 bg-[#ffb400] rounded-full"></div>
                   <h3 className="text-xl font-bold text-slate-900">Avis étudiants</h3>
                </div>
                {user && (
                    <button 
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="text-xs font-bold text-[#370669] bg-[#370669]/5 px-4 py-2 rounded-lg hover:bg-[#370669] hover:text-white transition-all flex items-center gap-2"
                    >
                        <MessageSquare className="w-3.5 h-3.5" /> {showReviewForm ? 'Annuler' : 'Rédiger un avis'}
                    </button>
                )}
             </div>

             <div className="flex flex-col md:flex-row gap-10 mb-8 border-b border-gray-100 pb-8">
                <div className="text-center md:text-left min-w-[120px]">
                    <div className="text-5xl font-extrabold text-slate-900">{formation.reviews.average}</div>
                    <div className="flex justify-center md:justify-start text-[#ffb400] my-2">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current"/>)}
                    </div>
                    <p className="text-xs text-gray-400">{formation.reviews.total} avis vérifiés</p>
                </div>
                <div className="flex-1">
                    {formation.reviews.distribution.map((d, i) => <RatingBar key={i} {...d} />)}
                </div>
             </div>

             <div className="space-y-2">
                {formation.reviews.items.map((review) => <ReviewCard key={review.id} {...review} />)}
             </div>
          </div>

          {/* --- INFO ECOLE (✅ DYNAMIQUE MAINTENANT) --- */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-[#18B49C] rounded-full"></div>
                <h3 className="text-xl font-bold text-slate-900">À propos de l'établissement</h3>
            </div>
            <div className="w-full h-64 md:h-80 rounded-[1.5rem] overflow-hidden mb-8 relative group">
                <img src={formation.schoolImage} alt={formation.school} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="font-bold text-2xl">{formation.school}</h4>
                    <p className="text-sm opacity-90">{formation.city}, {formation.country}</p>
                </div>
            </div>
            <div className="flex flex-col gap-8">
                <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                    {/* Description de l'école */}
                    <p className="border-l-4 border-gray-100 pl-4 italic font-sans text-base">"{formation.schoolDescription}"</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                    {/* Contacts de l'école */}
                    <DetailItem icon={Mail} label="Service Admission" value={formation.schoolEmail} />
                    <DetailItem icon={Phone} label="Téléphone" value={formation.schoolPhone} />
                    <DetailItem icon={School} label="Fondation" value={formation.creationDate} />
                    <DetailItem icon={Globe} label="Site Web" value={formation.schoolWebsite} isLink />
                </div>
            </div>
          </div>

        </div>

        {/* === DROITE (Sticky) === */}
        <div className="lg:col-span-1">
            <div className="sticky top-28 flex flex-col gap-6">
                
                <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(55,6,105,0.08)] border border-[#370669]/10 z-20">
                    
                    {user ? (
                        <div className="flex items-center justify-center gap-2 bg-green-50 text-green-700 text-[10px] font-bold py-2 rounded-lg mb-4 border border-green-100">
                            <User className="w-3 h-3" /> Connecté en tant que {user.firstName}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 bg-red-50 text-red-500 text-[10px] font-bold py-2 rounded-lg mb-4 border border-red-100 animate-pulse">
                            <AlertCircle className="w-3 h-3" /> Places limitées pour 2025
                        </div>
                    )}

                    <div className="text-center mb-6 border-b border-gray-100 pb-6">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Investissement</span>
                        <div className="flex items-center justify-center gap-1 mt-1 text-[#370669]">
                            <span className="text-3xl font-extrabold font-poppins">{formation.price}</span>
                            <span className="text-sm font-medium text-gray-400 translate-y-1">{formation.paymentType}</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 mb-2">Pré-requis :</h4>
                        <ul className="space-y-3">
                            {formation.conditions.map((cond, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-[#18B49C] flex-shrink-0 mt-0.5" />
                                    <span className="leading-tight">{cond}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={handleApply}
                            className="w-full bg-[#370669] text-white py-4 rounded-xl font-bold text-sm hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-[#370669]/20"
                        >
                            {"Je postule maintenant"} 
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#370669] to-[#250346] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#18B49C] rounded-full blur-[60px] opacity-30"></div>
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-10 h-10 rounded-full border-2 border-[#370669] bg-[#18B49C] flex items-center justify-center text-xs font-bold mb-4">?</div>
                        <h3 className="font-bold text-lg mb-1">Une question ?</h3>
                        <p className="text-white/80 text-xs mb-6 leading-relaxed px-2">
                            {user ? "Discutez avec un ancien élève." : "Nos conseillers sont disponibles."}
                        </p>
                        <button className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-3 rounded-xl font-bold text-sm hover:bg-white hover:text-[#370669] transition-all flex items-center justify-center gap-2">
                            <HelpCircle className="w-4 h-4" /> Discuter
                        </button>
                    </div>
                </div>

            </div>
        </div>

      </div>
      <Footer/>
    </div>
  );
}