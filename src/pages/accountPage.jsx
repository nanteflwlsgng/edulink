import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { 
  ArrowLeft, X, Check, ChevronRight, Mail, Lock, User, 
  MapPin, Eye, EyeOff, Building2, Phone 
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AccountPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [view, setView] = useState("selection"); // 'selection' | 'student' | 'school'

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(".parallax-bg", {
        x: xPos, y: yPos, duration: 1, ease: "power2.out", stagger: 0.1
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, { opacity: 0, duration: 0.4, onComplete: () => navigate(-1) });
  };

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#fdfdfd] z-[100] overflow-hidden font-poppins text-slate-800">
      <div className="parallax-bg absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-slate-100 rounded-full blur-[120px] opacity-60" />
      <div className="parallax-bg absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-slate-100 rounded-full blur-[100px] opacity-60" />

      <button onClick={handleClose} className="fixed top-8 right-8 z-[120] p-3 hover:rotate-90 transition-transform duration-300 bg-white rounded-full shadow-sm hover:shadow-md">
        <X className="w-6 h-6 text-slate-400" />
      </button>

      {view === "selection" ? (
        <RoleSelection onSelect={(role) => setView(role)} />
      ) : (
        <AuthForm 
          type={view} 
          onBack={() => setView("selection")} 
          theme={view === "student" ? "#18B49C" : "#27b6d8"} 
        />
      )}
    </div>
  );
}

function RoleSelection({ onSelect }) {
  return (
    <div className="relative w-full h-full flex flex-col md:flex-row">
      <RoleCard title="Étudiant" img="/etudiant1.png" label="STUDENT" color="#18B49C" onClick={() => onSelect("student")} />
      <div className="hidden md:block w-[1px] h-32 self-center bg-gray-100 z-10" />
      <RoleCard title="Établissement" img="/professor.png" label="SCHOOL" color="#27b6d8" onClick={() => onSelect("school")} />
    </div>
  );
}

function RoleCard({ title, img, label, color, onClick }) {
  const cardRef = useRef(null);
  const onMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef.current.querySelector(".role-label"), { x: -x * 50, y: -y * 50, duration: 0.6 });
  };

  return (
    <div ref={cardRef} onMouseMove={onMouseMove} onClick={onClick} className="flex-1 relative flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
      <span className="role-label absolute text-[12vw] font-bold text-slate-100 select-none z-0 transition-colors group-hover:text-slate-200">{label}</span>
      <div className="role-img relative z-10 w-48 h-48 md:w-80 md:h-80 mb-6 transition-transform duration-500 group-hover:scale-105">
        <img src={img} alt={title} className="w-full h-full object-contain drop-shadow-2xl" />
      </div>
      <h2 className="relative z-10 text-4xl font-bold text-slate-900 group-hover:text-[var(--hover-color)] transition-colors" style={{"--hover-color": color}}>{title}</h2>
    </div>
  );
}

// === NOUVELLE VERSION DU FORMULAIRE (PROFESSIONNEL) ===
function AuthForm({ type, onBack, theme }) {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef(null);

  const [isLogin, setIsLogin] = useState(true); // Par défaut Login
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  
  // Données du formulaire enrichies
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: ""
  });

  useEffect(() => {
    gsap.fromTo(formRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); 
  };

  const handleNextOrSubmit = (e) => {
    e.preventDefault();
    setError("");

    // --- LOGIQUE LOGIN ---
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("Identifiants requis.");
        shakeForm();
        return;
      }
      const res = login(formData.email, formData.password, type);
      // const res = register(formData, type);
      
      if (res.success) {
        // Redirection intelligente selon le rôle
        if (type === 'school') {
            navigate("/schoolDashboard");
        } else {
            navigate("/studentDashboard"); // Ou /dashboard par défaut
        }
    } else {
        setError(res.message);
        shakeForm();
    }


      // if (res.success) {
      //   navigate("/dashboard");
      // } else {
      //   setError(res.message);
      //   shakeForm();
      // }
      // return;
    }

    // --- LOGIQUE REGISTER ---
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setError("Veuillez remplir les informations de base.");
        shakeForm();
        return;
      }
      nextStepAnim();
    } else {
      if (!formData.password || formData.password !== formData.confirmPassword) {
        setError("Les mots de passe ne correspondent pas ou sont vides.");
        shakeForm();
        return;
      }
      // const res = register(formData);
      // if (res.success) {
      //   navigate("/dashboard");
      // } else {
      //   setError(res.message);
      //   shakeForm();
      // }
      const res = register(formData, type); // 'type' vient des props de AuthForm
    
    if (res.success) {
        // Redirection intelligente selon le rôle
        if (type === 'school') {
            navigate("/schoolDashboard");
        } else {
            navigate("/studentDashboard"); // Ou /dashboard par défaut
        }
    } else {
        setError(res.message);
        shakeForm();
    }
    }
  };

  // Animations GSAP
  const shakeForm = () => gsap.to(".form-container", { x: [-5, 5, -5, 5, 0], duration: 0.4 });
  
  const nextStepAnim = () => {
    gsap.to(".step-anim", { opacity: 0, x: -20, duration: 0.3, onComplete: () => {
      setStep(step + 1);
      gsap.fromTo(".step-anim", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
    }});
  };

  const toggleMode = () => {
    gsap.to(".form-container", { opacity: 0, y: 10, duration: 0.2, onComplete: () => {
        setIsLogin(!isLogin);
        setStep(1);
        setError("");
        gsap.fromTo(".form-container", { opacity: 1, y: 0 }, { opacity: 1, y: 0, duration: 0.3 });
    }});
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-50 p-4">
      <div ref={formRef} className="form-container w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative">
        
        {/* Bandeau supérieur coloré */}
        <div className="h-2 w-full absolute top-0 left-0" style={{ backgroundColor: theme }}></div>
        
        <div className="p-8 md:p-10">
            {/* Header Form */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-slate-800 transition-colors text-xs font-bold mb-4">
                        <ArrowLeft className="w-3 h-3" /> Retour
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isLogin ? "Bon retour !" : "Créer un compte"}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {isLogin ? "Accédez à votre espace " + (type === 'student' ? "étudiant" : "établissement") : "Rejoignez la plateforme"}
                    </p>
                </div>
                {/* Icône de type */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 text-slate-900 shadow-sm">
                    {type === 'student' ? <User className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                </div>
            </div>

            {/* Zone d'erreur */}
            {error && (
                <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> {error}
                </div>
            )}

            <form className="step-anim" onSubmit={handleNextOrSubmit}>
                {isLogin ? (
                    // --- LOGIN FORM ---
                    <div className="space-y-4">
                        <InputField 
                            label="Email académique" 
                            name="email" 
                            type="email" 
                            icon={Mail} 
                            value={formData.email} 
                            onChange={handleChange} 
                            activeColor={theme}
                        />
                        <div>
                            <InputField 
                                label="Mot de passe" 
                                name="password" 
                                type="password" 
                                icon={Lock} 
                                value={formData.password} 
                                onChange={handleChange} 
                                activeColor={theme}
                            />
                            <div className="flex justify-end mt-2">
                                <a href="#" className="text-[11px] font-bold text-gray-400 hover:text-[#370669]">Mot de passe oublié ?</a>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- REGISTER FORM ---
                    step === 1 ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <InputField label="Prénom" name="firstName" icon={User} value={formData.firstName} onChange={handleChange} activeColor={theme} />
                                <InputField label="Nom" name="lastName" icon={User} value={formData.lastName} onChange={handleChange} activeColor={theme} />
                            </div>
                            <InputField label="Email" name="email" type="email" icon={Mail} value={formData.email} onChange={handleChange} activeColor={theme} />
                            <InputField label="Téléphone" name="phone" type="tel" icon={Phone} value={formData.phone} onChange={handleChange} activeColor={theme} />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <InputField label="Ville / Campus" name="city" icon={MapPin} value={formData.city} onChange={handleChange} activeColor={theme} />
                            <InputField label="Mot de passe" name="password" type="password" icon={Lock} value={formData.password} onChange={handleChange} activeColor={theme} />
                            <InputField label="Confirmer" name="confirmPassword" type="password" icon={Lock} value={formData.confirmPassword} onChange={handleChange} activeColor={theme} />
                        </div>
                    )
                )}

                {/* Bouton d'action */}
                <button 
                    type="submit"
                    className="w-full mt-8 py-4 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    style={{ backgroundColor: theme || '#370669' }}
                >
                    {isLogin ? "Se connecter" : (step === 1 ? "Suivant" : "Confirmer l'inscription")}
                    {(!isLogin && step === 1) ? <ChevronRight className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                </button>
            </form>

            {/* Toggle Login/Register Footer */}
            <div className="mt-8 text-center pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                    {isLogin ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"} 
                    <button 
                        onClick={toggleMode} 
                        className="ml-2 font-bold hover:underline transition-all"
                        style={{ color: theme || '#370669' }}
                    >
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

// === INPUT COMPONENT PROFESSIONNEL ===
const InputField = ({ label, type = "text", name, value, onChange, icon: Icon, activeColor }) => {
    const [showPass, setShowPass] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPass ? "text" : "password") : type;

    return (
        <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 ml-1">{label}</label>
            <div className="relative group">
                <input
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={`Entrez votre ${label.toLowerCase()}`}
                    className="w-full pl-10 pr-10 py-3.5 rounded-xl  border border-gray-200 focus:border-[#370669] focus:ring-2 focus:ring-[#370669]/20 outline-none transition-all text-sm bg-white text-slate-800 placeholder:text-gray-400"
                    style={{ "--active-color": activeColor }}
                />
                {Icon && (
                    <Icon className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[var(--active-color)] transition-colors" style={{ "--active-color": activeColor }} />
                )}
                
                {isPassword && (
                    <button 
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>
        </div>
    );
};