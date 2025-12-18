// src/components/CategoriesModern.jsx
import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";

// Données des Catégories (Group 1)
const DATA_GROUP_1 = [
  { id: 1, title: "Informatique", count: "120+ Formations", img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Commerce", count: "85 Écoles", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Communication", count: "60 Cursus", img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop" },
  { id: 4, title: "Santé", count: "45 Instituts", img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop" },
];

// Données des Catégories (Group 2)
const DATA_GROUP_2 = [
  { id: 5, title: "Langues", count: "30 Programmes", img: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=800&auto=format&fit=crop" },
  { id: 6, title: "Sciences", count: "90 Labos", img: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=800&auto=format&fit=crop" },
  { id: 7, title: "Théologie", count: "15 Centres", img: "https://images.unsplash.com/photo-1507643179173-39db4f92c827?q=80&w=800&auto=format&fit=crop" },
  { id: 8, title: "Gestion", count: "110 Masters", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop" },
];

const CategoriesModern = () => {
  const containerRef = useRef(null);
  const cardsContainerRef = useRef(null);
  const [activeGroup, setActiveGroup] = useState(1); // 1 ou 2
  const [isAnimating, setIsAnimating] = useState(false);

  // Fonction pour changer de groupe avec animation GSAP
  const switchCategories = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    const nextGroup = activeGroup === 1 ? 2 : 1;
    const cards = cardsContainerRef.current.children;

    const tl = gsap.timeline({
      onComplete: () => {
        setActiveGroup(nextGroup);
        // Une fois le state changé, on réanime l'entrée (voir useLayoutEffect ci-dessous)
      }
    });

    // 1. Sortie des cartes actuelles (Vers le haut + Fade Out + Rotation)
    tl.to(cards, {
      y: -50,
      opacity: 0,
      rotationX: 15,
      scale: 0.9,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.in"
    });
  };

  // Effet qui se déclenche quand activeGroup change (pour l'entrée des nouvelles cartes)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        const cards = cardsContainerRef.current.children;
        
        // 2. Entrée des nouvelles cartes (Du bas vers le haut)
        gsap.fromTo(cards, 
          { y: 100, opacity: 0, scale: 0.9, rotationX: -15 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.2)", // Petit effet de rebond élastique
            onComplete: () => setIsAnimating(false)
          }
        );

        // Animation texte description
        gsap.fromTo(".desc-text", 
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, delay: 0.2 }
        );

    }, containerRef);
    return () => ctx.revert();
  }, [activeGroup]);


  const currentData = activeGroup === 1 ? DATA_GROUP_1 : DATA_GROUP_2;

  return (
    <div ref={containerRef} className="py-24 bg-white relative overflow-hidden text-slate-900">
      
      {/* Background Decoration (Subtile) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gray-50 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

        {/* === GAUCHE : TEXTE & CONTROLES === */}
        <div className="lg:col-span-4 flex flex-col items-start z-10">
          <span className="text-[#18B49C] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
             <span className="w-8 h-[2px] bg-[#18B49C]"></span>
             Exploration
          </span>
          
          <h2 className="text-5xl md:text-6xl font-orange leading-[1] mb-6 text-slate-900">
            Choisissez <br/>
            <span className="text-transparent font-orange bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">
                votre voie.
            </span>
          </h2>

          <div className="h-32 relative w-full mb-8">
             <p className="desc-text text-gray-500 leading-relaxed text-lg absolute top-0 left-0 w-full">
                {activeGroup === 1 
                  ? "Plongez dans les secteurs les plus dynamiques du marché. Du code au commerce, ces filières construisent le monde de demain."
                  : "Ouvrez votre esprit à de nouvelles perspectives. Des sciences fondamentales à la gestion des organisations, l'avenir est pluriel."
                }
             </p>
          </div>

          {/* Bouton de Switch Stylisé */}
          <div className="flex items-center gap-6">
              <button 
                onClick={switchCategories}
                disabled={isAnimating}
                className="group relative px-8 py-4 bg-[#370669] text-white rounded-full overflow-hidden shadow-xl shadow-slate-200 hover:shadow-2xl transition-transform transform hover:scale-105"
              >
                  <span className="relative z-10 font-bold text-sm tracking-widest uppercase flex items-center gap-3">
                    {activeGroup === 1 ? "Voir Sciences & Gestion" : "Voir Tech & Commerce"}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
              </button>
              
              {/* Indicateur de page (Dots) */}
              <div className="flex gap-2">
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeGroup === 1 ? "bg-[#18B49C] w-6" : "bg-gray-200"}`}></div>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${activeGroup === 2 ? "bg-[#27b6d8] w-6" : "bg-gray-200"}`}></div>
              </div>
          </div>
        </div>

        {/* === DROITE : GRILLE DE CARTES (INTERACTIVE) === */}
        <div className="lg:col-span-8 perspective-1000">
            <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentData.map((item) => (
                    <div 
                        key={item.id} 
                        className="group relative h-[280px] rounded-[2rem] overflow-hidden cursor-pointer shadow-lg shadow-gray-100 hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500"
                    >
                        {/* Image Background avec Zoom au hover */}
                        <img 
                            src={item.img} 
                            alt={item.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Overlay Gradient (Noir en bas vers transparent) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity"></div>

                        {/* Contenu Texte */}
                        <div className="absolute bottom-0 left-0 p-8 pr-0 w-full transform transition-transform duration-500 group-hover:translate-y-[-5px]">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] font-bold text-white uppercase tracking-wider mb-3">
                                {item.count}
                            </span>
                            <h3 className="text-3xl font-bold text-white mb-1 w-full flex pt-1 transition-colors font-poppins">
                                {item.title}
                            </h3>
                            <div className="h-[2px] w-0 bg-[#18B49C] group-hover:w-16 transition-all duration-500 delay-100"></div>
                        </div>

                        {/* Icone Flèche (Apparition au hover) */}
                        <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 border border-white/20">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};

export default CategoriesModern;