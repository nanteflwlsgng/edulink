import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Clock, Calendar, Globe, Monitor,
  School, Mail, Phone, CheckCircle, HelpCircle,
  ArrowLeft, Share2, Heart, Star, TrendingUp, AlertCircle,
  ArrowRight, MessageSquare, Send, User, Lock, Hourglass, ReceiptText
} from "lucide-react";

// --- IMPORTS ---
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import StudentNavbar from "../components/StudentNavbar";
import Footer from "../components/Footer";

// --- UTILITAIRES ---
const formatDate = (dateString) => {
  if (!dateString) return "Date à définir";
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
};

const formatPrice = (price) => {
  if (!price) return "Gratuit";
  return new Intl.NumberFormat('fr-MG', { style: 'currency', currency: 'MGA' }).format(price);
};


// --- SOUS-COMPOSANTS UI ---
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
    <div className="p-2 bg-white rounded-full text-[#370669] shadow-sm"><Icon className="w-4 h-4" /></div>
    <div className="flex flex-col overflow-hidden">
      <span className="text-[10px] text-gray-400 uppercase font-bold">{label}</span>
      {isLink ? (
        <a href={value && value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-sm font-medium truncate hover:text-[#18B49C] hover:underline cursor-pointer">
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

  console.log("Objet USER complet :", user);
  // 1. DÉCLARATION DES ÉTATS (Essentiel pour éviter ReferenceError)
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // --- NOUVEAUX ÉTATS POUR LES AVIS ---
  const [reviewsList, setReviewsList] = useState([]); // Liste des avis
  const [reviewsStats, setReviewsStats] = useState(null); // Stats (moyenne, distribution)
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [hasAlreadyReviewed, setHasAlreadyReviewed] = useState(false); // <--- NOUVEAU


  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // 2. FONCTION DE TRANSFORMATION (Backend -> Frontend)
  const transformData = (apiData) => {
    if (!apiData) return null;

    const nextSession = apiData.sessions && apiData.sessions.length > 0 ? apiData.sessions[0] : null;

    return {
      id: apiData.id_formation,
      schoolId: apiData.ecole?.id_ecole,
      title: apiData.titre,
      description: apiData.description || "Aucune description disponible.",
      price: formatPrice(apiData.prix),
      paymentType: "/ total",
      category: apiData.categorie || "Formation",
      level: apiData.niveau || "Non spécifié",
      mode: apiData.mode || "Non spécifié",
      duration: apiData.duree ? apiData.duree.replace('_', ' ') : "Non spécifié",
      city: apiData.ville || (apiData.ecole?.ville) || "Ville inconnue",
      country: apiData.continent || (apiData.ecole?.pays) || "Pays inconnu",
       language: apiData.langue || "Français", 
      type: apiData.type_admission || "Dossier",

      // Info École
      school: apiData.ecole?.nom || "École partenaire",
      schoolDescription: apiData.ecole?.description || "L'école n'a pas fourni de description.",
      schoolEmail: apiData.ecole?.email || "N/A",
      schoolPhone: apiData.ecole?.telephone || "N/A",
      schoolWebsite: apiData.ecole?.site_web || "#",
      creationDate: apiData.ecole?.date_creation ? new Date(apiData.ecole.date_creation).getFullYear().toString() : "N/A",
      schoolImage: apiData.ecole?.image || "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",

      // Dates
      startDate: nextSession ? formatDate(nextSession.date_debut) : "À venir",
      end_date: nextSession ? formatDate(nextSession.date_fin_inscription) : "À venir",

      // Champs statiques (à enrichir plus tard)
      updatedAt: "Mis à jour récemment",
      language: "Français",
      type: "Dossier",
      insertionRate: "N/A",
      conditions: ["Baccalauréat requis"],

      reviews: {
        average: 4.5,
        total: 10,
        distribution: [
          { star: 5, percentage: 80, count: 8 },
          { star: 4, percentage: 20, count: 2 },
          { star: 3, percentage: 0, count: 0 },
          { star: 2, percentage: 0, count: 0 },
          { star: 1, percentage: 0, count: 0 },
        ],
        items: []
      }
    };
  };
  // --- A. CHARGEMENT DE LA FORMATION ---
  useEffect(() => {
    const fetchFormation = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/formations/${id}`);

        if (!response.ok) {
          throw new Error("Impossible de récupérer la formation.");
        }

        const json = await response.json();

        if (json.success) {
          setFormation(transformData(json.data));
        } else {
          setError(json.message);
        }

      } catch (err) {
        console.error(err);
        setError("Erreur de connexion au serveur.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFormation();
  }, [id]);
  useEffect(() => {
    const fetchReviews = async () => {
      if (!formation || !formation.schoolId) return;

      try {
        setLoadingReviews(true);
        const response = await fetch(`http://localhost:5000/api/avis/ecoles/${formation.schoolId}`);
        const json = await response.json();

        if (json.success) {
          setReviewsList(json.data.avis);
          setReviewsStats(json.data.statistiques);
        }
        if (user) {
                    const userId = user.id_utilisateur || user.id || user._id;
                    // On cherche si un avis appartient à l'utilisateur connecté
                    const existingReview = json.data.avis.find(
                        (avis) => avis.utilisateur.id_utilisateur === userId
                    );
                    setHasAlreadyReviewed(!!existingReview); // Met true si trouvé, false sinon
                }
            
      } catch (err) {
        console.error("Erreur chargement avis:", err);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [formation]);

  // --- B. VÉRIFICATION INITIALE DU FAVORI (Séparé pour ne pas bloquer) ---
  // --- B. VÉRIFICATION INITIALE DU FAVORI (CORRIGÉ) ---
  useEffect(() => {
    const checkFavorite = async () => {
      if (!user || !id) return;

      try {
        const userId = user.id_utilisateur || user.id || user._id;

        // On utilise fetch ici aussi
        const response = await fetch(`http://localhost:5000/api/favoris/${userId}`);
        const json = await response.json();

        if (response.ok && json.success) {
          // On vérifie si l'ID de la page actuelle est dans la liste reçue
          // Adaptez 'fav.formation.id_formation' selon la structure exacte de votre JSON backend
          const estFavori = json.data.some(fav =>
            (fav.id_formation || fav.formation?.id_formation) === parseInt(id)
          );
          setIsFavorite(estFavori);
        }
      } catch (error) {
        console.warn("Info: Impossible de vérifier les favoris", error.message);
      }
    };

    checkFavorite();
  }, [user, id]);

  // --- C. ACTION DU BOUTON (Débloqué) ---
  // --- C. ACTION DU BOUTON (CORRIGÉ) ---
  const handleFavorite = async () => {
    // 1. Redirection si pas connecté
    if (!user) {
      navigate('/compte');
      return;
    }

    // 2. Empêche le spam de clic
    if (loadingFav) return;

    try {
      setLoadingFav(true);

      // VÉRIFICATION DE L'ID UTILISATEUR
      // On s'assure de prendre le bon champ selon votre base de données
      const userId = user.id_utilisateur || user.id || user._id;

      console.log("Envoi favoris avec :", { userId, formationId: id }); // Pour le débogage

      // REMPLACEMENT DE 'api.post' PAR 'fetch'
      const response = await fetch('http://localhost:5000/api/favoris/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Si vous avez besoin d'un token, décommentez la ligne suivante :
          // 'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({
          id_etudiant: userId,
          id_formation: parseInt(id)
        })
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setIsFavorite(json.isFavorite); // Assurez-vous que le backend renvoie true/false ici
      } else {
        console.error("Erreur serveur :", json.message);
      }

    } catch (error) {
      console.error("Erreur lors du clic favoris:", error);
    } finally {
      setLoadingFav(false);
    }
  };

  // DANS FormationDetailsPage.jsx

  const handleSubmitReview = async () => {
    console.log("--- DÉBUT ENVOI AVIS ---");

    // 1. Vérifications de base
    if (!user) {
      alert("Vous devez être connecté.");
      return;
    }
    if (userRating === 0) {
      alert("Veuillez choisir une note (cliquez sur les étoiles).");
      return;
    }
    if (!reviewText.trim()) {
      alert("Veuillez écrire un commentaire.");
      return;
    }

    // 2. Préparation des données (Conversion en Entiers IMPORTANTE)
    // On sécurise l'ID utilisateur comme pour les favoris
    const userId = parseInt(user.id_utilisateur || user.id || user._id);
    const schoolId = parseInt(formation.schoolId);

    // DEBUG : Regardez votre console (F12) si ça ne marche pas
    console.log("Données préparées :", {
      id_utilisateur: userId,
      id_ecole: schoolId,
      note: userRating,
      commentaire: reviewText
    });

    if (!schoolId || isNaN(schoolId)) {
      alert("Erreur technique : ID de l'école introuvable. Vérifiez transformData.");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await fetch('http://localhost:5000/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_utilisateur: userId,
          id_ecole: schoolId,
          note: userRating,
          commentaire: reviewText
        })
      });

      const json = await response.json();
      console.log("Réponse Serveur :", json);

      if (response.ok && json.success) {
        alert("Avis publié avec succès !");
        // Reset du formulaire
        setShowReviewForm(false);
        setReviewText("");
        setUserRating(0);

        // Recharger la page pour voir l'avis
        window.location.reload();
      } else {
        alert("Erreur lors de l'enregistrement : " + (json.message || "Erreur inconnue"));
      }
    } catch (err) {
      console.error("Erreur Fetch :", err);
      alert("Impossible de contacter le serveur.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // --- LOGIQUES D'INTERACTION ---
  // console.log("État de l'utilisateur :", user);
  const handleApply = () => {
    console.log("--- DEBUG START ---");
    console.log("User est connecté :", user);

    if (user) {
      console.log("CONDITION VRAIE : Je lance la navigation vers /candidature/" + id);
      navigate("/candidature/" + id);
    } else {
      console.log("CONDITION FAUSSE : Je redirige vers le login");
      navigate("/compte");
    }
  };

  // const handleFavorite = () => {
  //   if (user) setIsFavorite(!isFavorite);
  //   else navigate("/compte", { state: { from: `/formations/${id}` } });
  // };

  // const handleSubmitReview = () => {
  //   alert("Fonctionnalité d'avis à venir !");
  //   setShowReviewForm(false);
  // };

  // 4. RENDU CONDITIONNEL (CRUCIAL : Si loading, on ne charge pas le JSX en bas)
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-[#18B49C] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Chargement...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-xl font-bold text-red-500 mb-2">Erreur</h2>
      <p className="text-slate-500">{error}</p>
      <Link to="/formations" className="mt-4 text-[#18B49C] underline">Retour</Link>
    </div>
  );

  // Sécurité ultime : si loading est faux mais formation est null
  if (!formation) return <div className="min-h-screen flex items-center justify-center">Formation introuvable.</div>;

  // --- LE JSX PRINCIPAL ---
  // Ici, la variable 'formation' est garantie d'exister grâce aux 'if' au-dessus.
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

          {/* HERO */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex gap-3">
                  <span className="bg-[#18B49C] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{formation.category}</span>
                  <span className="bg-[#f0fdfa] text-[#18B49C] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#18B49C]/20">{formation.level}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleFavorite}
                    disabled={loadingFav} // Désactive le bouton pendant la requête
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all duration-300 border ${isFavorite
                      ? 'bg-red-50 text-red-500 border-red-100' // Style Activé
                      : 'bg-white text-gray-400 border-gray-200 hover:border-red-200 hover:text-red-400' // Style Désactivé
                      } ${loadingFav ? 'opacity-70 cursor-wait' : ''}`}
                  >
                    {/* Le cœur pulse si ça charge, sinon il est rempli ou vide */}
                    <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current' : ''} ${loadingFav ? 'animate-pulse' : ''}`} />

                    <span className="text-xs font-bold hidden sm:inline">
                      {isFavorite ? 'Sauvegardé' : 'Sauvegarder'}
                    </span>
                  </button>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-[1.1]">
                {formation.title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-gray-100 pt-6 mt-6">
                <div className="flex items-center gap-4 group/school cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl">🏫</div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{formation.school}</h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 text-[#18B49C]" /> {formation.city}, {formation.country}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILS */}
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
                { icon: Hourglass, label: "Date limite", value: formation.end_date, color: "text-red-600", bg: "bg-red-50" },
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
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{formation.description}</p>
            </div>
          </div>

          {/* INFO ECOLE */}
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-[#18B49C] rounded-full"></div>
              <h3 className="text-xl font-bold text-slate-900">À propos de l'établissement</h3>
            </div>

            <div className="flex flex-col gap-8">
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                <p className="border-l-4 border-gray-100 pl-4 italic font-sans text-base">"{formation.schoolDescription}"</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
                <DetailItem icon={Mail} label="Email" value={formation.schoolEmail} />
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
                  <AlertCircle className="w-3 h-3" /> Inscriptions ouvertes
                </div>
              )}

              <div className="text-center mb-6 border-b border-gray-100 pb-6">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Prix de la formation</span>
                <div className="flex items-center justify-center gap-1 mt-1 text-[#370669]">
                  <span className="text-xl md:text-2xl font-extrabold font-poppins">{formation.price}</span>
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

                <div className="grid grid-cols-2 gap-2">
                  <button className="col-span-2 bg-gray-50 text-slate-600 py-3 rounded-xl font-semibold text-xs hover:bg-gray-100 hover:text-[#370669] transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-3.5 h-3.5" /> Partager
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
        {/* --- SECTION AVIS DYNAMIQUE --- */}
        <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100 mt-8">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-[#18B49C] rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-900">
              Avis sur l'établissement ({reviewsStats?.totalAvis || 0})
            </h3>
          </div>

          {loadingReviews ? (
            <p className="text-gray-500">Chargement des avis...</p>
          ) : (
            <>
              {/* RÉSUMÉ DES NOTES (Statistiques) */}
              {reviewsStats && (
                <div className="flex flex-col md:flex-row gap-8 mb-10 items-center bg-gray-50 p-6 rounded-2xl">
                  {/* Moyenne Globale */}
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-slate-900 mb-2">
                      {reviewsStats.noteMoyenne}
                    </div>
                    <div className="flex justify-center text-[#ffb400] mb-2 gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5"
                          fill={star <= Math.round(reviewsStats.noteMoyenne) ? "currentColor" : "none"}
                          stroke="currentColor" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Note Moyenne</p>
                  </div>

                  {/* Barres de progression */}
                  <div className="flex-1 w-full max-w-md">
                    {[5, 4, 3, 2, 1].map((star) => {
                      // Calcul du pourcentage pour chaque étoile
                      const count = reviewsStats.distributionNotes[star] || 0;
                      const total = reviewsStats.totalAvis || 1; // éviter division par 0
                      const percentage = (count / total) * 100;

                      return (
                        <RatingBar
                          key={star}
                          star={star}
                          percentage={percentage}
                          count={count}
                        />
                      );
                    })}
                  </div>
                </div>
              )}{/* === DÉBUT DU FORMULAIRE === */}
<div className="mt-8 mb-10 border-t border-gray-100 pt-8">
  {user ? (
    // NIVEAU 1 : Utilisateur Connecté
    hasAlreadyReviewed ? (
      // CAS A : Déjà noté -> Message "Merci"
      <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-800 animate-fadeIn">
        <div className="bg-green-100 p-2 rounded-full">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-bold text-sm">Merci !</p>
          <p className="text-xs">Vous avez déjà partagé votre avis sur cet établissement.</p>
        </div>
      </div>
    ) : (
      // CAS B : Pas encore noté -> On vérifie si le formulaire est ouvert
      !showReviewForm ? (
        // Sous-cas B1 : Formulaire fermé -> Bouton "Rédiger"
        <button
          onClick={() => setShowReviewForm(true)}
          className="text-[#370669] font-bold text-sm border-b-2 border-[#370669]/20 hover:border-[#370669] transition-all pb-0.5"
        >
          + Rédiger un avis
        </button>
      ) : (
        // Sous-cas B2 : Formulaire ouvert -> Afficher le formulaire
        <div className="bg-gray-50 p-6 rounded-2xl animate-fadeIn border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h5 className="font-bold text-slate-800">Votre note</h5>
            <button
              onClick={() => setShowReviewForm(false)}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Annuler
            </button>
          </div>

          {/* --- ÉTOILES CLIQUABLES --- */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setUserRating(star)}
                className="transition-transform hover:scale-110 focus:outline-none group"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= userRating
                      ? "text-[#ffb400] fill-[#ffb400]"
                      : "text-gray-300 group-hover:text-[#ffb400]/50"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Zone de texte */}
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Votre commentaire</label>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Partagez votre expérience (qualité des cours, ambiance, profs...)"
            className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#18B49C] focus:border-transparent outline-none text-sm min-h-[100px] mb-4 bg-white"
          />

          {/* Bouton Envoyer */}
          <button
            onClick={handleSubmitReview}
            disabled={submittingReview}
            className="bg-[#370669] text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#370669]/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submittingReview ? "Envoi en cours..." : "Publier mon avis"}
            <Send className="w-4 h-4" />
          </button>
        </div>
      )
    )
  ) : (
    // NIVEAU 1 ELSE : Utilisateur NON Connecté
    <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-100 flex items-center gap-3">
      <User className="w-5 h-5" />
      <span>
        <Link to="/compte" className="font-bold underline hover:text-orange-900">Connectez-vous</Link> pour donner votre avis sur cette école.
      </span>
    </div>
  )}
</div>
{/* === FIN DU FORMULAIRE === */}


              {/* === LISTE DES AVIS (Affichage dynamique) === */}
              <div className="space-y-4">
                {reviewsList.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-gray-500 italic">Aucun avis pour le moment.</p>
                    <p className="text-sm text-[#18B49C] font-bold mt-1">Soyez le premier à donner votre avis !</p>
                  </div>
                ) : (
                  reviewsList.map((review) => (
                    <ReviewCard
                      key={review.id_avis}
                      name={`${review.utilisateur.prenom} ${review.utilisateur.nom.charAt(0)}.`}
                      // On gère la date si elle n'existe pas
                      date={review.date_creation ? new Date(review.date_creation).toLocaleDateString() : "Récemment"}
                      rating={review.note}
                      comment={review.commentaire}
                      avatarColor="bg-[#370669]"
                    />
                  ))
                )}
              </div>

              {/* Fermeture des balises principales */}
            </>
          )}
        
        </div>
      </div>
      <Footer />
    </div>
  );
}