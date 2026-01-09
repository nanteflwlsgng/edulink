import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, UploadCloud, FileText, 
  User, GraduationCap, ChevronRight, Save, AlertCircle, Calendar, Users
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StudentNavbar from "../components/StudentNavbar";
import Navbar from "../components/Navbar";

// --- COMPOSANTS UI EXTERNES (Modifiés pour gérer les erreurs) ---

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = true, icon: Icon, error, ...props }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props} // Permet de passer 'max', 'min', etc.
        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm bg-white text-slate-800 placeholder:text-gray-400 
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#370669] focus:ring-[#370669]/20 focus:ring-2'}`}
      />
      {Icon && <Icon className={`absolute left-3 top-3.5 w-4 h-4 ${error ? 'text-red-500' : 'text-gray-400'}`} />}
    </div>
    {/* Message d'erreur */}
    {error && <p className="text-red-500 text-xs mt-1 ml-1 font-medium animate-pulse">{error}</p>}
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = true, icon: Icon, error }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
        {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all text-sm bg-white text-slate-800 appearance-none
        ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#370669] focus:ring-[#370669]/20 focus:ring-2'}`}
      >
        <option value="" disabled>Sélectionner...</option>
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {Icon && <Icon className={`absolute left-3 top-3.5 w-4 h-4 ${error ? 'text-red-500' : 'text-gray-400'}`} />}
      <div className="absolute right-4 top-4 pointer-events-none">
         <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
      </div>
    </div>
    {error && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{error}</p>}
  </div>
);

const FileUpload = ({ label, name, file, onChange, accept = ".pdf,.jpg,.png" }) => (
  <div className="mb-6">
    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">{label}</label>
    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${file ? 'border-[#18B49C] bg-green-50' : 'border-gray-300 hover:border-[#370669] hover:bg-gray-50'}`}>
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        {file ? (
          <>
              <CheckCircle className="w-8 h-8 text-[#18B49C] mb-2" />
              <p className="text-sm text-gray-500 font-medium">{file.name}</p>
          </>
        ) : (
          <>
              <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500"><span className="font-bold">Cliquez pour upload</span> ou glissez</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG (Max 5Mo)</p>
          </>
        )}
      </div>
      <input 
          type="file" 
          name={name}
          className="hidden" 
          accept={accept}
          onChange={(e) => onChange(e, name)} 
      />
    </label>
  </div>
);

// --- COMPOSANT PRINCIPAL ---

export default function CandidaturePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formation, setFormation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État des erreurs
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    firstName: user?.prenom || "", 
    lastName: user?.nom || "",    
    email: user?.email || "",
    phone: "",
    birthDate: "",
    gender: "",
    lastDiploma: "",
    schoolOrigin: "",
    motivation: "",
    cv: null,
    letter: null,
    transcript: null,
    idCard: null
  });

  useEffect(() => {
    const fetchFormation = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/formations/${id}`);
            const json = await response.json();
            if (json.success) {
                setFormation({
                    id: json.data.id_formation,
                    title: json.data.titre,
                    school: json.data.ecole?.nom || "École partenaire"
                });
            } else {
                navigate("/formations");
            }
        } catch (error) {
            console.error("Erreur fetch:", error);
        } finally {
            setLoading(false);
        }
    };
    if (id) fetchFormation();
  }, [id, navigate]);

  // --- FONCTION DE VALIDATION ---
  const validateStep1 = () => {
    const newErrors = {};
    const data = formData;

    // 1. Noms
    const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
    if (!data.firstName.trim()) newErrors.firstName = "Le prénom est requis.";
    else if (!nameRegex.test(data.firstName)) newErrors.firstName = "Lettres uniquement.";
    
    if (!data.lastName.trim()) newErrors.lastName = "Le nom est requis.";
    else if (!nameRegex.test(data.lastName)) newErrors.lastName = "Lettres uniquement.";

    // 2. Date de naissance (16 ans min, pas de futur)
    if (!data.birthDate) {
        newErrors.birthDate = "La date est requise.";
    } else {
        const birthDate = new Date(data.birthDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (birthDate > today) {
            newErrors.birthDate = "Impossible de sélectionner une date future.";
        } else if (age < 16) {
            newErrors.birthDate = `Vous devez avoir au moins 16 ans (Actuellement : ${age} ans).`;
        } else if (age > 100) {
            newErrors.birthDate = "Année de naissance invalide.";
        }
    }

    // 3. Sexe
    if (!data.gender) newErrors.gender = "Veuillez choisir.";

    // 4. Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) newErrors.email = "L'email est requis.";
    else if (!emailRegex.test(data.email)) newErrors.email = "Format invalide.";

    // 5. Téléphone (+261 ou 03...)
    const phoneRegex = /^(\+261|0)(32|33|34|38)[0-9]{7}$/;
    const cleanPhone = data.phone.replace(/\s/g, ''); 
    if (!data.phone.trim()) {
        newErrors.phone = "Le téléphone est requis.";
    } else if (!cleanPhone.match(phoneRegex)) {
        newErrors.phone = "Numéro invalide (Ex: +261 34... ou 034...).";
    }

    // 6. Diplôme (Pas que des chiffres)
    if (!data.lastDiploma.trim()) {
        newErrors.lastDiploma = "Champ requis.";
    } else if (/^\d+$/.test(data.lastDiploma)) {
        newErrors.lastDiploma = "Le diplôme doit contenir des lettres.";
    } else if (data.lastDiploma.length < 2) {
        newErrors.lastDiploma = "Trop court.";
    }

    if (!data.schoolOrigin.trim()) newErrors.schoolOrigin = "Champ requis.";

    // 7. Motivation
    if (!data.motivation.trim()) {
        newErrors.motivation = "La motivation est requise.";
    } else if (data.motivation.length < 20) {
        newErrors.motivation = "Minimum 20 caractères.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Effacer l'erreur en tapant
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Validation avant de passer à l'étape 2
    if (validateStep1()) {
        window.scrollTo(0, 0);
        setStep(2);
    } else {
        window.scrollTo(0, 0); // Remonter pour voir les erreurs
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const dataToSend = new FormData();
        dataToSend.append('id_formation', id);
        dataToSend.append('id_utilisateur', user.id_utilisateur);
        dataToSend.append('prenom', formData.firstName);
        dataToSend.append('nom', formData.lastName);
        dataToSend.append('telephone', formData.phone);
        dataToSend.append('date_naissance', formData.birthDate);
        dataToSend.append('sexe', formData.gender);
        dataToSend.append('dernier_diplome', formData.lastDiploma);
        dataToSend.append('ecole_origine', formData.schoolOrigin);
        dataToSend.append('motivation', formData.motivation);

        if (formData.cv) dataToSend.append('cv', formData.cv);
        if (formData.letter) dataToSend.append('lettre_motivation', formData.letter);
        if (formData.transcript) dataToSend.append('releve_notes', formData.transcript);
        if (formData.idCard) dataToSend.append('piece_identite', formData.idCard);

        const response = await fetch('http://localhost:5000/api/inscriptions', {
            method: 'POST',
            body: dataToSend
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert("Candidature envoyée avec succès !");
            navigate("/dashboard");
        } else {
            alert("Erreur : " + (result.message || "Impossible d'envoyer"));
        }
    } catch (error) {
        console.error("Erreur:", error);
        alert("Erreur de connexion.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  if (!formation) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-slate-800">
      {user ? <StudentNavbar /> : <Navbar />}

      <div className="bg-[#370669] text-white pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
            <Link to={`/formations/${id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Retour à la fiche
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Candidature : {formation.title}</h1>
            <p className="text-white/80 text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> {formation.school}
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8 pb-20">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            
            <div className="flex items-center justify-center mb-10">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#370669]' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-[#370669] text-white' : 'bg-gray-100'}`}>1</div>
                    <span className="text-sm font-bold hidden md:inline">Informations</span>
                </div>
                <div className={`w-16 h-1 mx-4 rounded-full ${step === 2 ? 'bg-[#370669]' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#370669]' : 'text-gray-300'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-[#370669] text-white' : 'bg-gray-100'}`}>2</div>
                    <span className="text-sm font-bold hidden md:inline">Dossiers</span>
                </div>
            </div>

            <form onSubmit={step === 1 ? handleNext : handleSubmit}>
                
                {step === 1 && (
                    <div className="animate-fadeIn">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <User className="w-5 h-5 text-[#18B49C]" /> Informations Personnelles
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="Prénom" name="firstName" value={formData.firstName} 
                                onChange={handleChange} placeholder="Votre prénom" icon={User} 
                                error={errors.firstName}
                            />
                            <InputField 
                                label="Nom" name="lastName" value={formData.lastName} 
                                onChange={handleChange} placeholder="Votre nom" icon={User} 
                                error={errors.lastName}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="Date de naissance" 
                                name="birthDate" 
                                type="date" 
                                value={formData.birthDate} 
                                onChange={handleChange} 
                                icon={Calendar}
                                error={errors.birthDate}
                                max={new Date().toISOString().split("T")[0]} // Bloque le futur
                            />
                            <SelectField 
                                label="Sexe" name="gender" value={formData.gender} 
                                onChange={handleChange} icon={Users}
                                error={errors.gender}
                                options={[
                                    { value: "M", label: "Masculin" },
                                    { value: "F", label: "Féminin" }
                                ]}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="Email" name="email" type="email" value={formData.email} 
                                onChange={handleChange} placeholder="exemple@email.com" icon={FileText} 
                                error={errors.email}
                            />
                            <InputField 
                                label="Téléphone" name="phone" type="tel" value={formData.phone} 
                                onChange={handleChange} placeholder="+261 34 00 000 00" icon={FileText} 
                                error={errors.phone}
                            />
                        </div>

                        <h2 className="text-xl font-bold mb-6 mt-8 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <GraduationCap className="w-5 h-5 text-[#18B49C]" /> Parcours Académique
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="Dernier Diplôme" name="lastDiploma" value={formData.lastDiploma} 
                                onChange={handleChange} placeholder="Ex: Baccalauréat" icon={GraduationCap} 
                                error={errors.lastDiploma}
                            />
                            <InputField 
                                label="Établissement d'origine" name="schoolOrigin" value={formData.schoolOrigin} 
                                onChange={handleChange} placeholder="Ex: Lycée Jules Ferry" icon={GraduationCap} 
                                error={errors.schoolOrigin}
                            />
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                                Lettre de motivation (Courte) <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                                name="motivation"
                                value={formData.motivation}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Expliquez brièvement pourquoi vous souhaitez rejoindre cette formation..."
                                className={`w-full p-4 rounded-xl border outline-none transition-all text-sm
                                ${errors.motivation ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-[#370669] focus:ring-[#370669]/20 focus:ring-2'}`}
                            ></textarea>
                            {errors.motivation && <p className="text-red-500 text-xs mt-1 font-medium">{errors.motivation}</p>}
                        </div>
                        
                        <div className="mt-8 flex justify-end">
                            <button type="submit" className="bg-[#370669] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#2a0450] transition-all flex items-center gap-2 shadow-lg shadow-[#370669]/20">
                                Étape suivante <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fadeIn">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
                             <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                             <p className="text-xs text-blue-800 leading-relaxed">
                                Veuillez importer des documents lisibles. Formats acceptés : PDF, JPG, PNG.
                             </p>
                        </div>

                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <UploadCloud className="w-5 h-5 text-[#18B49C]" /> Importation des pièces
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FileUpload label="Curriculum Vitae (CV)" name="cv" file={formData.cv} onChange={handleFileChange} />
                            <FileUpload label="Lettre de motivation (PDF)" name="letter" file={formData.letter} onChange={handleFileChange} />
                            <FileUpload label="Relevé de notes / Diplôme" name="transcript" file={formData.transcript} onChange={handleFileChange} />
                            <FileUpload label="Pièce d'identité" name="idCard" file={formData.idCard} onChange={handleFileChange} />
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <button type="button" onClick={handleBack} className="text-gray-500 font-bold text-sm hover:text-[#370669] flex items-center gap-2 px-4 py-2">
                                <ArrowLeft className="w-4 h-4" /> Retour
                            </button>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className={`bg-[#18B49C] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#159c87] transition-all flex items-center gap-2 shadow-lg shadow-[#18B49C]/20 ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                            >
                                {isSubmitting ? 'Envoi en cours...' : 'Finaliser la candidature'} 
                                {!isSubmitting && <Save className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}
            </form>
        </div>
      </div>
    </div>
  );
}