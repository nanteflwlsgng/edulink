// src/components/ScrollHeroSection.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollHeroSection = () => {
  const containerRef = useRef(null);
  const box1Ref = useRef(null); // Cahier
  const box3Ref = useRef(null); // Laptop
  const target7Ref = useRef(null);
  const target8Ref = useRef(null);
  const studentTextRef = useRef(null);
  const schoolTextRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --- PARTIE 1 : MOUVEMENT CAHIER & LAPTOP ---
      const box1 = box1Ref.current;
      const box3 = box3Ref.current;
      const target7 = target7Ref.current;
      const target8 = target8Ref.current;

      const start1 = box1.getBoundingClientRect();
      const start3 = box3.getBoundingClientRect();
      const end7 = target7.getBoundingClientRect();
      const end8 = target8.getBoundingClientRect();
      
      const scrollY = window.scrollY;
      const startTop1 = start1.top + scrollY;
      const endTop7 = end7.top + scrollY;
      
      const xChange1 = end7.left - start1.left;
      const yChange1 = endTop7 - startTop1;
      const xChange3 = end8.left - start3.left;
      const yChange3 = (end8.top + scrollY) - (start3.top + scrollY);
      
      const widthChange1 = end7.width;
      const heightChange1 = end7.height;
      const endScrollPosition = endTop7 - (window.innerHeight / 2) + (end7.height / 2);

      const animConfig = {
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top", 
          end: `${endScrollPosition}px top`,
          scrub: 1, 
        }
      };

      gsap.to(box1, {
        x: xChange1,
        y: yChange1,
        width: widthChange1,
        height: heightChange1,
        scale: 1,
        ...animConfig
      });

      gsap.to(box3, {
        x: xChange3,
        y: yChange3,
        width: widthChange1,
        height: heightChange1,
        ...animConfig
      });

      // --- PARTIE 2 : APPARITION TEXTES ---
      const qStudent = gsap.utils.selector(studentTextRef);
      const qSchool = gsap.utils.selector(schoolTextRef);
      const textElements = [...qStudent("h1, p, li"), ...qSchool("h1, p, li")];

      gsap.fromTo(textElements, 
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: target7Ref.current,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );

    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  const inputStyle = "border border-gray-300 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500 w-full";

  return (
    <div ref={containerRef} className="relative font-sans text-slate-800">
      
      {/* --- HERO SCREEN --- */}
      <div className="h-screen font-poppins flex flex-col pt-10 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* BOX 1 : CAHIER */}
          <div ref={box1Ref} className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 z-50">
            {/* <img src="/cahier.png" alt="Cahier" className="w-full h-full object-contain drop-shadow-xl" /> */}
          </div>

          {/* BOX 2 : TITRE */}
          <div className="flex items-center justify-center text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-gray-800">
              Trouvez l'école parfaite,<br />
              <span className="text-[#18B49C] flex pt-3">construisez votre avenir</span>
            </h1>
          </div>

          {/* BOX 3 : LAPTOP */}
          <div ref={box3Ref} className="w-32 h-32 md:w-36 md:h-36 flex-shrink-0 z-50">
            {/* <img src="/computer.png" alt="Laptop" className="w-full h-full object-contain drop-shadow-xl" /> */}
          </div>
        </div>

        {/* INPUTS & SEARCH */}
        <div className="flex justify-center mb-8">
            <p className="text-lg md:text-sm text-gray-600 text-center max-w-2xl">
              Recherchez, comparez et inscrivez-vous dans des milliers d'écoles, 
              instituts et centres de formation à travers le monde.
            </p>
        </div>
        
        <div className="flex justify-center w-full mb-8 z-40 relative">
             <div className=" p-4 rounded-xl w-full max-w-5xl flex flex-col lg:flex-row gap-3 items-end lg:items-center">
               <div className="flex-1 w-full">
                 <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Études</label>
                 <input type="text" placeholder="Que voulez-vous étudier ?" className={inputStyle} />
               </div>
               <div className="w-full lg:w-40">
                  <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Lieu</label>
                 <select className={inputStyle}><option>Localisation</option></select>
               </div>
               <div className="w-full lg:w-40">
                 <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Type</label>
                 <select className={inputStyle}><option>Type d'école</option></select>
               </div>
               <div className="w-full lg:w-40">
                 <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Domaine</label>
                 <select className={inputStyle}><option>Domaine</option></select>
               </div>
               <div className="w-full lg:w-32">
                 <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Budget</label>
                 <input type="number" placeholder="Max €" className={inputStyle} />
               </div>
               <div className="w-full lg:w-auto">
                 <button className="bg-[#18b49d1a] transition-transform transform hover:scale-105 text-gray-900 text-sm py-2 px-6 rounded-full w-full">
                   Rechercher
                 </button>
               </div>
             </div>
        </div>

        <div className="flex justify-center mb-10">
            <button className="px-8 py-3 bg-[#27b6d8] text-white text-sm font-semibold rounded-full transition-transform transform hover:scale-105">
              Découvrir formation
            </button>
        </div>

        <div className="flex-1 flex items-end justify-center pb-4">
            <p className="text-gray-400 animate-bounce text-sm">↓ Scrollez pour voir l'animation ↓</p>
        </div>
      </div>

      {/*ESPACE VIDE POUR LE SCROLL (Transition) */}
      <div className="h-[50vh]"></div>

      {/* --- CIBLES SCREEN (Features) --- */}
      <div className="h-screen flex flex-col justify-center bg-white relative z-10">
          <div className="text-center pt-4 mb-10">
            <h2 className="text-lg font-poppins font-semibold text-gray-800">Vos outils pour réussir</h2>
            <p className="text-gray-500">Les éléments viennent se placer ici.</p>
          </div>

          <div className="flex gap-32 flex-[0.3] p-4 w-full max-w-6xl mx-auto items-start justify-center">
            {/* ZONE ÉTUDIANTS */}
            <div className="flex flex-col items-center gap-4">
              <div ref={target7Ref} className="w-44 h-44 rounded-full  p-4 flex items-start justify-center text-3xl"></div>
              <div ref={studentTextRef} className="w-[400px] font-poppins items-start flex flex-col gap-3">
                <h1 className="text-[#18b49c] text-sm font-semibold">Pour les etudiants</h1>
                <p className="text-gray-600 text-sm">Explorez les meilleures formations et postulez en quelques clics.</p>
                <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                  <li>Recherchez parmi des milliers de formations</li>
                  <li>Comparez les programmes</li>
                  <li>Postulez directement en ligne</li>
                  <li>Suivez vos candidatures</li>
                </ul>
              </div>
            </div>

            {/* ZONE ECOLES */}
            <div className="flex flex-col items-center lg:flex-col gap-4">
              <div ref={target8Ref} className="w-44 h-44 rounded-full  p-4 flex items-start justify-center text-3xl"></div>
              <div ref={schoolTextRef} className="w-[400px] font-poppins items-start flex flex-col gap-3">
                <h1 className="text-[#18b49c] text-sm font-semibold">Pour les ecoles</h1>
                <p className="text-gray-600 text-sm">Présentez vos formations, gérez vos inscriptions, et suivez vos étudiants.</p>
                <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside">
                  <li>Créez votre profil école</li>
                  <li>Publiez vos formations</li>
                  <li>Gérez les candidatures</li>
                  <li>Analysez vos statistiques</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex-1"></div>
      </div>
    </div>
  );
};

export default ScrollHeroSection;