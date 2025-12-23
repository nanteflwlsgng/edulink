import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ArrowLeft, X, Check, ChevronRight, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Import du contexte

export default function AccountPage() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [view, setView] = useState("selection");

  // --- PARALLAX DE FOND (INCHANGÉ) ---
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5) * 20;
      const yPos = (clientY / window.innerHeight - 0.5) * 20;

      gsap.to(".parallax-bg", {
        x: xPos,
        y: yPos,
        duration: 1,
        ease: "power2.out",
        stagger: 0.1
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleClose = () => {
    gsap.to(containerRef.current, { opacity: 0, duration: 0.4, onComplete: () => navigate("/") });
  };

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full bg-[#fdfdfd] z-[100] overflow-hidden font-poppins">
      
      {/* ÉLÉMENTS DE FOND PARALLAX */}
      <div className="parallax-bg absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-slate-100 rounded-full blur-[120px] opacity-60" />
      <div className="parallax-bg absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-slate-100 rounded-full blur-[100px] opacity-60" />

      {/* BOUTON FERMER */}
      <button onClick={handleClose} className="fixed top-8 right-8 z-[120] p-3 hover:rotate-90 transition-transform duration-300">
        <X className="w-6 h-6 text-slate-400" />
      </button>

      {view === "selection" ? (
        <RoleSelection onSelect={(role) => setView(role)} />
      ) : (
        <MinimalForm 
          type={view} 
          onBack={() => setView("selection")} 
          theme={view === "student" ? "#18B49C" : "#27b6d8"} 
        />
      )}
    </div>
  );
}

// ... RoleSelection et RoleCard restent INCHANGÉS (copier ton code précédent ici) ...
/* (Je ne remets pas RoleSelection ici pour économiser l'espace, garde le tien tel quel) */
/* =========================================================================
   SÉLECTION DES RÔLES (Simple Parallax & Hover)
   ========================================================================= */
function RoleSelection({ onSelect }) {
  return (
    <div className="relative w-full h-full flex flex-col md:flex-row">
      <RoleCard 
        title="Étudiant" 
        img="/etudiant1.png" 
        label="STUDENT"
        color="#18B49C"
        onClick={() => onSelect("student")} 
      />
      <div className="hidden md:block w-[1px] h-32 self-center bg-gray-100 z-10" />
      <RoleCard 
        title="Établissement" 
        img="/professor.png" 
        label="SCHOOL"
        color="#27b6d8"
        onClick={() => onSelect("school")} 
      />
    </div>
  );
}

function RoleCard({ title, img, label, color, onClick }) {
  const cardRef = useRef(null);

  // Parallax interne au hover
  const onMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // gsap.to(cardRef.current.querySelector(".role-img"), { x: x * 30, y: y * 30, duration: 0.6 });
    gsap.to(cardRef.current.querySelector(".role-label"), { x: -x * 50, y: -y * 50, duration: 0.6 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={onMouseMove}
      onClick={onClick}
      className="flex-1 relative flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
    >
      <span className="role-label absolute text-[12vw] font-bold text-slate-100 select-none z-0 transition-colors group-hover:text-slate-200">
        {label}
      </span>
      <div className="role-img relative z-10 w-48 h-48 md:w-80 md:h-80 mb-6 transition-transform duration-500 group-hover:scale-105">
        <img src={img} alt={title} className="w-full h-full object-contain drop-shadow-2xl" />
      </div>
      <h2 className="relative z-10 text-4xl font-orange text-slate-900 group-hover:text-[var(--hover-color)] transition-colors" style={{"--hover-color": color}}>
        {title}
      </h2>
    </div>
  );
}

/* =========================================================================
   FORMULAIRE (Connecté au Context & LocalStorage)
   ========================================================================= */
function MinimalForm({ type, onBack, theme }) {
  const navigate = useNavigate();
  const { login, register } = useAuth(); // Hook personnalisé
  
  const [isLoginMode, setIsLoginMode] = useState(false); // Toggle entre Login et Register
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", city: "" });
  const [error, setError] = useState("");
  const formRef = useRef(null);

  // Animation d'entrée
  useEffect(() => {
    gsap.fromTo(formRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Reset erreur quand l'utilisateur tape
  };

  const handleNextOrSubmit = async () => {
    // LOGIQUE DE CONNEXION
    if (isLoginMode) {
      if (!formData.email || !formData.password) {
        setError("Veuillez remplir tous les champs.");
        return;
      }
      const res = login(formData.email, formData.password);
      if (res.success) {
        navigate("/dashboard");
      } else {
        setError(res.message);
        shakeForm();
      }
      return;
    }

    // LOGIQUE D'INSCRIPTION (Multi-étapes)
    if (step === 1) {
      if (!formData.name || !formData.email) {
        setError("Champs obligatoires manquants.");
        shakeForm();
        return;
      }
      nextStepAnim();
    } else {
      if (!formData.password || !formData.city) {
        setError("Champs obligatoires manquants.");
        shakeForm();
        return;
      }
      const res = register(formData);
      if (res.success) {
        navigate("/dashboard");
      } else {
        setError(res.message);
        shakeForm();
      }
    }
  };

  // Petite animation de secousse en cas d'erreur
  const shakeForm = () => {
    gsap.to(".step-anim", { x: [-10, 10, -10, 10, 0], duration: 0.4 });
  };

  const nextStepAnim = () => {
    gsap.to(".step-anim", { opacity: 0, x: -20, duration: 0.3, onComplete: () => {
      setStep(step + 1);
      gsap.fromTo(".step-anim", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 });
    }});
  };

  const toggleMode = () => {
    gsap.to(".step-anim", { opacity: 0, y: 10, duration: 0.2, onComplete: () => {
        setIsLoginMode(!isLoginMode);
        setStep(1);
        setError("");
        gsap.fromTo(".step-anim", { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.3 });
    }});
  };

  return (
    <div ref={formRef} className="absolute inset-0 flex items-center justify-center bg-white z-50">
      <div className="w-full max-w-lg px-8">
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-12">
            <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 hover:text-black transition-colors uppercase">
            <ArrowLeft className="w-4 h-4" /> Retour
            </button>
            
            {/* Toggle Mode Login/Register */}
            <button onClick={toggleMode} className="text-xs font-bold tracking-widest text-[#370669] hover:opacity-70 transition-opacity uppercase border-b border-[#370669] pb-0.5">
                {isLoginMode ? "Créer un compte" : "Se connecter"}
            </button>
        </div>

        <div className="step-anim">
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2" style={{ color: theme }}>
            {isLoginMode ? "CONNEXION" : `ÉTAPE 0${step}`}
          </p>
          <h2 className="text-4xl font-orange text-slate-900 mb-2">
            {isLoginMode ? "Bon retour." : (step === 1 ? "Vos identifiants." : "Presque fini.")}
          </h2>
          {/* Zone d'erreur */}
          <div className="h-6 mb-8 text-red-500 text-xs font-bold uppercase tracking-wider">{error}</div>

          <div className="space-y-8">
            {isLoginMode ? (
                // FORMULAIRE LOGIN
                <>
                 <SimpleInput name="email" label="Adresse Email" type="email" theme={theme} value={formData.email} onChange={handleChange} />
                 <SimpleInput name="password" label="Mot de passe" type="password" theme={theme} value={formData.password} onChange={handleChange} />
                </>
            ) : (
                // FORMULAIRE REGISTER
                step === 1 ? (
                <>
                    <SimpleInput name="name" label="Nom complet" theme={theme} value={formData.name} onChange={handleChange} />
                    <SimpleInput name="email" label="Adresse Email" type="email" theme={theme} value={formData.email} onChange={handleChange} />
                </>
                ) : (
                <>
                    <SimpleInput name="password" label="Mot de passe" type="password" theme={theme} value={formData.password} onChange={handleChange} />
                    <SimpleInput name="city" label="Ville" theme={theme} value={formData.city} onChange={handleChange} />
                </>
                )
            )}
          </div>

          <div className="mt-12 flex justify-end">
            <button 
              onClick={handleNextOrSubmit}
              className="px-10 py-4 rounded-full bg-slate-900 text-white flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="text-xs font-bold uppercase tracking-widest">
                {isLoginMode ? "Se connecter" : (step === 2 ? "Valider" : "Suivant")}
              </span>
              {!isLoginMode && step === 1 && <ChevronRight className="w-4 h-4" />}
              {(isLoginMode || step === 2) && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleInput({ label, type = "text", theme, name, value, onChange }) {
  return (
    <div className="relative w-full">
      <input 
        name={name}
        type={type} 
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full bg-transparent border-b border-gray-200 py-3 text-lg outline-none focus:border-slate-900 transition-all text-slate-900"
      />
      <label className="absolute left-0 top-3 text-gray-400 pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-[:not(:placeholder-shown)]:-top-5 peer-[:not(:placeholder-shown)]:text-[10px]">
        {label}
      </label>
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-slate-900 transition-all duration-500 peer-focus:w-full" style={{ backgroundColor: theme }} />
    </div>
  );
}