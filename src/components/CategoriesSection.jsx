// src/components/CategoriesSection.jsx
import { useRef, useState } from "react";
import gsap from "gsap";

const CategoriesSection = () => {
  const grid1Ref = useRef(null);
  const grid2Ref = useRef(null);
  const [isSecondGrid, setIsSecondGrid] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

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

    tl.to(leavingGrid, {
      scale: 0.6,
      duration: 0.8,
      ease: "power2.out",
    })
    .to(leavingGrid, {
      y: exitY,
      opacity: 0,
      duration: 0.8,
      ease: "power2.in",
    })
    .fromTo(enteringGrid, 
      {
        y: entryFromY,
        scale: 1.5,
        opacity: 0,
        zIndex: 10,
        display: "grid",
      },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
      },
      "<0.4"
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative z-20">
      <div className="h-screen bg-white flex items-center justify-center px-12 w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 w-full h-3/4">

          {/* === LEFT : CONTENEUR DES GRILLES === */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden"> 
            
            {/* GRILLE 1 */}
            <div 
              ref={grid1Ref}
              className="grid grid-cols-2 gap-[1px] w-full h-full absolute top-0 left-0 bg-white origin-center"
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
              className="grid grid-cols-2 gap-[1px] w-full h-full absolute top-0 left-0 bg-white opacity-0 origin-center"
              style={{ transform: "translateY(600px)" }} 
            >
              <div className="bg-[#27b6d8] py-6 flex items-center justify-center text-white font-poppins font-semibold">LANGUES</div>
              <div className="bg-[#27b6d8] py-6 ml-1 flex items-center justify-center text-white font-poppins font-semibold">SCIENCES</div>
              <div className="bg-[#27b6d8] py-6 mt-1 flex items-center justify-center text-white font-poppins font-semibold">THÉOLOGIES</div>
              <div className="bg-[#27b6d8] py-6 ml-1 mt-1 flex items-center justify-center text-white font-poppins font-semibold">GESTION</div>
            </div>

            {/* BOUTON TOGGLE */}
            <button 
              onClick={toggleGrids}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-50 shadow-md border-2 border-white"
            >
              <img 
                src={isSecondGrid ? "/up.svg" : "/down.svg"} 
                alt="Toggle Categories" 
                className="w-6 h-6 transition-all duration-300"
              />
            </button>
          </div>

          {/* === RIGHT : TEXTE === */}
          <div className="flex flex-col justify-start lg:pl-10 pt-10">
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
                <button className="px-8 py-3 bg-[#683cc7] text-white text-sm font-semibold rounded-full transition-transform transform hover:scale-105">
                  Postulez maintenant
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoriesSection;