import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";

gsap.registerPlugin(ScrollTrigger);

function App() {
  // --- Refs existantes ---
  const containerRef = useRef(null);
  const box1Ref = useRef(null);
  const box3Ref = useRef(null);
  const target7Ref = useRef(null);
  const target8Ref = useRef(null);
  const studentTextRef = useRef(null);
  const schoolTextRef = useRef(null);

  // --- Refs pour les Grilles INTERNES (Toggle) ---
  const grid1Ref = useRef(null);
  const grid2Ref = useRef(null);
  
  // --- NOUVELLES REFS POUR L'ANIMATION SCROLL SECTION CATÉGORIES ---
  const categoriesSectionRef = useRef(null); // Le wrapper global
  const leftColRef = useRef(null);  // La colonne de gauche (Grilles)
  const rightColRef = useRef(null); // La colonne de droite (Texte)

  const [isSecondGrid, setIsSecondGrid] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ... (Code existant pour Box 1, Box 3, Textes Etudiants...) ...
       const box1 = box1Ref.current;
      const box3 = box3Ref.current;
      const target7 = target7Ref.current;
      const target8 = target8Ref.current;
      // ... (Je garde votre logique de scroll existante ici pour abréger) ...
      // --- (Imaginez tout votre code scrollTrigger précédent ici) ---

      // --- NOUVELLE ANIMATION : ENTRÉE DES COLONNES CATÉGORIES ---
      // On anime gauche et droite simultanément
      
      // Animation Colonne Gauche (Vient de gauche, tilt -20)
      gsap.fromTo(leftColRef.current,
        {
          x: -200,        // Vient de la gauche
          rotation: -20,  // Incliné
          opacity: 0,     // Invisible au début
        },
        {
          x: 0,           // Place finale
          rotation: 0,    // Se redresse
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesSectionRef.current, // Déclenche quand la section arrive
            start: "top 75%", // Commence quand le haut de la section est à 75% de l'écran
          }
        }
      );

      // Animation Colonne Droite (Vient de droite, tilt -20)
      gsap.fromTo(rightColRef.current,
        {
          x: 200,         // Vient de la droite
          rotation: -20,  // Incliné (même angle que demandé)
          opacity: 0,
        },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: categoriesSectionRef.current,
            start: "top 75%",
          }
        }
      );

    }, containerRef); // Note: On scope sur containerRef, assurez-vous que categoriesSectionRef est dedans
    return () => ctx.revert(); 
  }, []);

  // --- LOGIQUE TOGGLE GRILLE (Inchangée) ---
  const toggleGrids = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    const leavingGrid = isSecondGrid ? grid2Ref.current : grid1Ref.current;
    const enteringGrid = isSecondGrid ? grid1Ref.current : grid2Ref.current;
    const exitY = isSecondGrid ? 600 : -600;
    const entryFromY = isSecondGrid ? -600 : 600;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsSecondGrid(!isSecondGrid);
        setIsAnimating(false);
      }
    });

    tl.to(leavingGrid, { scale: 0.6, duration: 0.8, ease: "power2.out" })
      .to(leavingGrid, { y: exitY, opacity: 0, duration: 0.8, ease: "power2.in" })
      .fromTo(enteringGrid, 
        { y: entryFromY, scale: 1.5, opacity: 0, zIndex: 10, display: "grid" },
        { y: 0, scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" },
        "<0.4"
      );
  };

  return (
    <>
      <Navbar />
      
      <div ref={containerRef} className="min-h-[200vh] relative font-sans text-slate-800 overflow-x-hidden">
        {/* Note: j'ai ajouté overflow-x-hidden au container principal pour éviter la scrollbar latérale pendant l'anim */}

        {/* ... (Hero, Intermédiaire, Cibles...) ... */}
        <div className="h-screen font-poppins flex flex-col pt-10 px-4 max-w-7xl mx-auto"></div>
        <div className="h-screen flex items-center justify-center bg-gray-50 relative z-0"></div>
        <div className="h-screen flex flex-col justify-center bg-white"></div>


        {/* --- ÉCRAN : Catégories Populaires --- */}
        <div className="min-h-screen bg-white flex flex-col items-center relative z-20">
          
          {/* REF SECTION GLOBALE */}
          <div ref={categoriesSectionRef} className="h-screen bg-white flex items-center justify-center px-12 w-full max-w-7xl">

            <div className="grid lg:grid-cols-2 gap-12 w-full h-3/4">

              {/* === LEFT : CONTENEUR DES GRILLES === */}
              {/* REF AJOUTÉE : leftColRef */}
              <div 
                ref={leftColRef} 
                className="relative w-full h-full flex items-center justify-center" // J'ai retiré overflow-hidden ici pour permettre la rotation propre sans coupure
              > 
                
                {/* GRILLE 1 */}
                <div 
                  ref={grid1Ref}
                  className="grid grid-cols-2 gap-[1px] w-full h-full absolute top-0 left-0 bg-white origin-center shadow-lg" // Ajout shadow pour du relief
                  style={{ zIndex: 1 }}
                >
                  <div className="bg-[#27b6d8] py-6 flex items-center justify-center text-white font-poppins font-semibold">INFORMATIQUES</div>
                  <div className="bg-[#27b6d8] py-6 ml-1 flex items-center justify-center text-white font-poppins font-semibold">COMMERCES</div>
                  <div className="bg-[#27b6d8] py-6 mt-1 flex items-center justify-center text-white font-poppins font-semibold">COMMUNICATION</div>
                  <div className="bg-[#27b6d8] py-6 ml-1 mt-1 flex items-center justify-center text-white font-poppins font-semibold">SANTÉ</div>
                </div>

                {/* GRILLE 2 */}
                <div 
                  ref={grid2Ref}
                  className="grid grid-cols-2 gap-[1px] w-full h-full absolute top-0 left-0 bg-white opacity-0 origin-center shadow-lg"
                  style={{ transform: "translateY(600px)" }} 
                >
                  <div className="bg-[#27b6d8] py-6 flex items-center justify-center text-white font-poppins font-semibold">LANGUES</div>
                  <div className="bg-[#27b6d8] py-6 ml-1 flex items-center justify-center text-white font-poppins font-semibold">SCIENCES</div>
                  <div className="bg-[#27b6d8] py-6 mt-1 flex items-center justify-center text-white font-poppins font-semibold">THÉOLOGIES</div>
                  <div className="bg-[#27b6d8] py-6 ml-1 mt-1 flex items-center justify-center text-white font-poppins font-semibold">GESTION</div>
                </div>

                {/* BOUTON ROND */}
                <button 
                  onClick={toggleGrids}
                  className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-50 shadow-md border-2 border-gray-100"
                >
                  <img 
                    src={isSecondGrid ? "/up.svg" : "/down.svg"} 
                    alt="Toggle" 
                    className="w-6 h-6 transition-all duration-300"
                  />
                </button>

              </div>

              {/* === RIGHT : TEXTE === */}
              {/* REF AJOUTÉE : rightColRef */}
              <div ref={rightColRef} className="flex flex-col justify-start lg:pl-10 pt-10">
                <div className="flex w-full h-full flex-col">
                  
                  <h2 className="text-base font-poppins font-bold text-gray-800 mb-4">
                    {isSecondGrid ? "Découvrez d'autres horizons" : "Explore nos catégories phares"}
                  </h2>
                  
                  <p className="text-gray-600 font-poppins leading-relaxed text-sm transition-opacity duration-500">
                    {isSecondGrid 
                      ? "Ces filières offrent des opportunités uniques pour ceux qui cherchent à approfondir leurs connaissances théoriques ou scientifiques."
                      : "Découvre les domaines les plus demandés actuellement. Ces catégories sont pensées pour t’aider à trouver rapidement la voie qui match avec ton projet."
                    }
                  </p>
                  
                  <div className="flex h-full w-full justify-center items-center">
                    <button className="px-8 py-3 bg-[#683cc7] text-white text-sm font-semibold rounded-full transition-transform transform hover:scale-105 shadow-lg">
                      Postulez maintenant
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default App;