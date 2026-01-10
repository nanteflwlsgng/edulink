import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, CheckCircle, UploadCloud, FileText, 
  User, GraduationCap, ChevronRight, Save, AlertCircle, Calendar, Users
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import StudentNavbar from "../components/StudentNavbar";
import Navbar from "../components/Navbar";
import { MOCK_DATA } from "../dataformation"; 

// --- COMPOSANTS UI EXTERNES (Pour corriger le bug de focus) ---

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required = true, icon: Icon }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">{label}</label>
    <div className="relative">
      <input
        type={type}
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#370669] focus:ring-2 focus:ring-[#370669]/20 outline-none transition-all text-sm bg-white text-slate-800 placeholder:text-gray-400"
      />
      {Icon && <Icon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />}
    </div>
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required = true, icon: Icon }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">{label}</label>
    <div className="relative">
      <select
        name={name}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#370669] focus:ring-2 focus:ring-[#370669]/20 outline-none transition-all text-sm bg-white text-slate-800 appearance-none"
      >
        <option value="" disabled>Sélectionner...</option>
        {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {Icon && <Icon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />}
      {/* Petite flèche personnalisée pour le select */}
      <div className="absolute right-4 top-4 pointer-events-none">
         <ChevronRight className="w-3 h-3 text-gray-400 rotate-90" />
      </div>
    </div>
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
  
  const formation = MOCK_DATA.find((f) => f.id.toString() === id);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    // Step 1
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    birthDate: "", // Nouveau champ
    gender: "",    // Nouveau champ
    lastDiploma: "",
    schoolOrigin: "",
    motivation: "",
    // Step 2
    cv: null,
    letter: null,
    transcript: null,
    idCard: null
  });

  useEffect(() => {
    if (!formation) navigate("/formations");
  }, [formation, navigate]);

  if (!formation) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Candidature envoyée avec succès !");
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins text-slate-800">
      {user ? <StudentNavbar /> : <Navbar />}

      {/* En-tête */}
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
            
            {/* Barre de progression */}
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
                
                {/* --- ÉTAPE 1 --- */}
                {step === 1 && (
                    <div className="animate-fadeIn">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <User className="w-5 h-5 text-[#18B49C]" /> Informations Personnelles
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Votre prénom" icon={User} />
                            <InputField label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Votre nom" icon={User} />
                        </div>

                        {/* NOUVEAUX CHAMPS ICI */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField 
                                label="Date de naissance" 
                                name="birthDate" 
                                type="date" 
                                value={formData.birthDate} 
                                onChange={handleChange} 
                                icon={Calendar} 
                            />
                            <SelectField 
                                label="Sexe" 
                                name="gender" 
                                value={formData.gender} 
                                onChange={handleChange}
                                icon={Users}
                                options={[
                                    { value: "M", label: "Masculin" },
                                    { value: "F", label: "Féminin" }
                                ]}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="exemple@email.com" icon={FileText} />
                            <InputField label="Téléphone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+261 34 ..." icon={FileText} />
                        </div>

                        <h2 className="text-xl font-bold mb-6 mt-8 flex items-center gap-2 pb-4 border-b border-gray-100">
                            <GraduationCap className="w-5 h-5 text-[#18B49C]" /> Parcours Académique
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Dernier Diplôme" name="lastDiploma" value={formData.lastDiploma} onChange={handleChange} placeholder="Ex: Baccalauréat, Licence..." icon={GraduationCap} />
                            <InputField label="Établissement d'origine" name="schoolOrigin" value={formData.schoolOrigin} onChange={handleChange} placeholder="Ex: Lycée Jules Ferry" icon={GraduationCap} />
                        </div>

                        <div className="mt-4">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Lettre de motivation (Courte)</label>
                            <textarea 
                                name="motivation"
                                value={formData.motivation}
                                onChange={handleChange}
                                required
                                rows="5"
                                placeholder="Expliquez brièvement pourquoi vous souhaitez rejoindre cette formation..."
                                className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#370669] focus:ring-2 focus:ring-[#370669]/20 outline-none transition-all text-sm"
                            ></textarea>
                        </div>
                        
                        <div className="mt-8 flex justify-end">
                            <button type="submit" className="bg-[#370669] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#2a0450] transition-all flex items-center gap-2 shadow-lg shadow-[#370669]/20">
                                Étape suivante <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- ÉTAPE 2 --- */}
                {step === 2 && (
                    <div className="animate-fadeIn">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 flex gap-3">
                             <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                             <p className="text-xs text-blue-800 leading-relaxed">
                                Veuillez importer des documents lisibles (format PDF ou Image). Si vous n'avez pas tous les documents maintenant, vous pourrez les compléter plus tard depuis votre espace étudiant.
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