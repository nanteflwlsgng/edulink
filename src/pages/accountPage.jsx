// src/pages/AccountPage.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function AccountPage() {
  const contentRef = useRef(null);
  const navigate = useNavigate();

  // --- STATE DE NAVIGATION ---
  const [view, setView] = useState("selection"); // 'selection' | 'student' | 'school'

  // --- ANIMATION D'ENTRÉE (ON MOUNT) ---
  useEffect(() => {
    // La page descend subitement d'en haut au chargement
    gsap.fromTo(
      contentRef.current,
      { y: "-100%" }, 
      { y: "0%", duration: 0.5, ease: "circ.inOut" }
    );
  }, []);

  // Fonction pour fermer la page (retour accueil)
  const handleClose = () => {
    // On peut animer la sortie avant de naviguer
    gsap.to(contentRef.current, {
      y: "-100%",
      duration: 0.5,
      ease: "power2.in",
      onComplete: () => navigate("/") // Retour à l'accueil
    });
  };

  const handleBack = () => {
    setView("selection");
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-white relative">
      
      {/* BOUTON FERMER (RETOUR ACCUEIL) */}
      <button
        onClick={handleClose}
        className="fixed top-6 right-8 z-[110] bg-white/20 backdrop-blur-sm p-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-[#370669] transition-all shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        
      </button>

      {/* CONTENEUR PRINCIPAL ANIMÉ */}
      <div ref={contentRef} className="w-full h-full relative">
        
        {view === "selection" && (
          <RoleSelection onSelect={(role) => setView(role)} />
        )}

        {view === "student" && (
          <StudentForm onBack={handleBack} />
        )}

        {view === "school" && (
          <SchoolForm onBack={handleBack} />
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   COMPOSANT 1 : SÉLECTION DU RÔLE (SPLIT SCREEN)
   ========================================================================= */
function RoleSelection({ onSelect }) {
  useEffect(() => {
    gsap.fromTo(".role-content",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 0.6, stagger: 0.2 }
    );
  }, []);

  return (
    <div className="flex flex-col md:flex-row w-full h-full">
      {/* Côté Étudiant */}
      <div onClick={() => onSelect("student")} className="relative flex-1 h-full bg-[#370669] group cursor-pointer overflow-hidden flex flex-col items-center justify-center p-10 hover:flex-[1.3] transition-all duration-500">
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="role-content z-10 text-center flex flex-col items-center">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform"><img src="/etudiant.png" alt="student" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}/></div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Étudiant</h2>
            <p className="text-white/90 text-sm max-w-sm font-medium">Je cherche une formation.</p>
            <span className="mt-8 px-8 py-3 bg-white text-[#18b49c] text-sm font-bold rounded-full opacity-0 transform translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">S'inscrire / Se connecter</span>
        </div>
      </div>

      {/* Côté Établissement */}
      <div onClick={() => onSelect("school")} className="relative flex-1 h-full bg-[#370669] group cursor-pointer overflow-hidden flex flex-col items-center justify-center p-10 hover:flex-[1.3] transition-all duration-500">
         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="role-content z-10 text-center flex flex-col items-center">
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform"><img src="/director.png" alt="student" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}/></div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Établissement</h2>
            <p className="text-white/90 text-sm max-w-sm font-medium">Je veux recruter.</p>
            <span className="mt-8 px-8 py-3 bg-white text-[#27b6d8] text-sm rounded-full font-bold opacity-0 transform translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">Créer un compte / Se connecter</span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   COMPOSANT 2 : FORMULAIRE ÉTUDIANT
   ========================================================================= */
function StudentForm({ onBack }) {
  const [step, setStep] = useState(1);
  const nextStep = (e) => { e.preventDefault(); setStep(step + 1); };
  const prevStep = () => setStep(step - 1);

  return (
    <div className="h-full w-full overflow-y-auto bg-[#18b49c] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-8 md:p-12 animate-fadeIn">
        <button onClick={onBack} className="text-gray-400 hover:text-[#18b49c] font-semibold text-sm mb-6 flex items-center gap-2 transition-colors">← Changer de profil</button>
        
        <div className="mb-6"><h2 className="text-3xl font-bold text-[#18b49c]">Inscription Étudiant</h2><p className="text-gray-500 text-sm mt-1">Étape {step} sur 3</p></div>
        <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden"><div className="h-full bg-[#18b49c] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div></div>

        <form>
          {step === 1 && (
            <div className="space-y-5 animate-slideIn">
              <div className="grid grid-cols-2 gap-4"><InputGroup label="Nom" /><InputGroup label="Prénom" /></div>
              <InputGroup label="Date de naissance" type="date" />
              <InputGroup label="Téléphone" type="tel" />
              <div className="pt-6 flex justify-end"><ButtonNext onClick={nextStep}>Suivant</ButtonNext></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5 animate-slideIn">
              <InputGroup label="Pseudo" />
              <InputGroup label="Email" type="email" />
              <InputGroup label="Mot de passe" type="password" />
              <div className="pt-6 flex justify-between"><ButtonPrev onClick={prevStep} /><ButtonNext onClick={nextStep}>Suivant</ButtonNext></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 animate-slideIn">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400 text-sm text-blue-800">Domaine d'intérêt (Optionnel)</div>
              <select className="w-full border p-3 rounded-lg outline-none"><option>Choisir...</option><option>Info</option><option>Commerce</option></select>
              <div className="pt-6 flex justify-between"><ButtonPrev onClick={prevStep} /><button className="bg-[#18b49c] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-all">Terminer</button></div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* =========================================================================
   COMPOSANT 3 : FORMULAIRE ÉTABLISSEMENT
   ========================================================================= */
function SchoolForm({ onBack }) {
  const [step, setStep] = useState(1);
  const nextStep = (e) => { e.preventDefault(); setStep(step + 1); };
  const prevStep = () => setStep(step - 1);

  return (
    <div className="h-full w-full overflow-y-auto bg-[#27b6d8] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-8 md:p-12 animate-fadeIn">
        <button onClick={onBack} className="text-gray-400 hover:text-[#27b6d8] font-semibold text-sm mb-6 flex items-center gap-2 transition-colors">← Changer de profil</button>

        <div className="mb-6"><h2 className="text-3xl font-bold text-[#27b6d8]">Espace Établissement</h2><p className="text-gray-500 text-sm mt-1">Étape {step} sur 3</p></div>
        <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden"><div className="h-full bg-[#27b6d8] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div></div>

        <form>
          {step === 1 && (
            <div className="space-y-5 animate-slideIn">
              <InputGroup label="Nom Établissement" />
              <div className="grid grid-cols-2 gap-4"><InputGroup label="Type" /><InputGroup label="Ville" /></div>
              <div className="pt-6 flex justify-end"><ButtonNext onClick={nextStep} color="bg-[#27b6d8]">Suivant</ButtonNext></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-5 animate-slideIn">
              <InputGroup label="Admin User" />
              <InputGroup label="Email Pro" type="email" />
              <div className="grid grid-cols-2 gap-4"><InputGroup label="Password" type="password" /><InputGroup label="Confirm" type="password" /></div>
              <div className="pt-6 flex justify-between"><ButtonPrev onClick={prevStep} /><ButtonNext onClick={nextStep} color="bg-[#27b6d8]">Suivant</ButtonNext></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-6 animate-slideIn">
              <h3 className="font-bold border-b pb-2">Identité visuelle</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-2 dashed p-6 text-center cursor-pointer hover:bg-blue-50 text-gray-400">Logo</div>
                <div className="border-2 dashed p-6 text-center cursor-pointer hover:bg-blue-50 text-gray-400">Cover</div>
              </div>
              <div className="pt-6 flex justify-between"><ButtonPrev onClick={prevStep} /><button className="bg-[#27b6d8] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-all">Valider</button></div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// Helpers UI
const InputGroup = ({ label, type = "text" }) => (
  <div className="space-y-1 w-full"><label className="text-xs font-bold text-gray-500 ml-1 uppercase">{label}</label><input type={type} className="w-full border rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-gray-200 outline-none" /></div>
);
const ButtonNext = ({ onClick, children, color = "bg-[#18b49c]" }) => <button onClick={onClick} className={`${color} text-white px-6 py-2 rounded-full font-bold hover:brightness-110`}>{children}</button>;
const ButtonPrev = ({ onClick }) => <button type="button" onClick={onClick} className="text-gray-500 font-semibold px-4 py-2 hover:text-gray-800">Précédent</button>;