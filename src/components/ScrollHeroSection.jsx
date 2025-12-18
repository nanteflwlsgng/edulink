// src/components/MinimalistMorph.jsx
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MinimalistMorph = () => {
  const containerRef = useRef(null);
  
  // Images (Style "Bright & Clean")
  const HERO_IMG = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"; 
  const STUDENT_IMG = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop"; 
  const SCHOOL_IMG = "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"; 

  // Données Témoignages (Avatars + Avis courts)
  const TESTIMONIALS = [
    { name: "Léa", role: "Design", img: "https://i.pravatar.cc/150?img=5", text: "J'ai trouvé mon école en 2 jours." },
    { name: "Thomas", role: "Marketing", img: "https://i.pravatar.cc/150?img=11", text: "Une plateforme intuitive !" },
    { name: "Sarah", role: "Droit", img: "https://i.pravatar.cc/150?img=9", text: "Le matching est parfait." },
    { name: "Mehdi", role: "Ingénieur", img: "https://i.pravatar.cc/150?img=3", text: "Admis à Lyon grâce à vous." },
    { name: "Julie", role: "Santé", img: "https://i.pravatar.cc/150?img=1", text: "Simple, rapide, efficace." },
    { name: "Alex", role: "Commerce", img: "https://i.pravatar.cc/150?img=8", text: "Je recommande à 100%." },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. INTRO (Chargement page)
      const tl = gsap.timeline();
      tl.from(".hero-text", { y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.7)" })
        // On remplace l'anim search-bar par l'anim testimonials
        .from(".testimonials-container", { y: 40, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4");

      // 1-BIS. ANIMATION MARQUEE INFINI (Témoignages)
      // On déplace le "track" de 50% (car on a doublé le contenu)
      gsap.to(".testimonials-track", {
        xPercent: -50,
        repeat: -1,
        duration: 20, // Vitesse du défilement (plus grand = plus lent)
        ease: "none",
      });

      // 2. HERO MORPHING (L'Effet Demi-Cercle -> Rectangle)
      gsap.fromTo(".hero-morph-container", 
        { 
          clipPath: "ellipse(70% 60% at 50% 0%)", 
          width: "90%",
          marginTop: "0px"
        },
        {
          clipPath: "ellipse(150% 100% at 50% 0%)",
          width: "100%",
          marginTop: "40px",
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: ".hero-section-trigger",
            start: "top top",
            end: "bottom 40%", 
            scrub: 1,
          }
        }
      );

      gsap.fromTo(".hero-inner-img",
        { scale: 1.2 },
        { 
          scale: 1,
          scrollTrigger: {
            trigger: ".hero-section-trigger",
            start: "top top",
            end: "bottom 40%",
            scrub: 1
          }
        }
      );

      // 3. PARALLAX DES AUTRES IMAGES
      const imgContainers = gsap.utils.toArray(".parallax-container");
      imgContainers.forEach((container) => {
        const img = container.querySelector("img");
        
        gsap.fromTo(img, 
          { yPercent: -30, scale: 1.25 },
          {
            yPercent: 30,
            scale: 1.25,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom", 
              end: "bottom top",
              scrub: 0, 
            }
          }
        );
      });

      // 4. TEXTES REVEAL
      const textSections = gsap.utils.toArray(".text-reveal");
      textSections.forEach((section) => {
        gsap.fromTo(section,
          { y: 80, opacity: 0 },
          {
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%", 
              end: "bottom 15%", 
              toggleActions: "play reverse play reverse"
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-white text-slate-800 font-sans overflow-x-hidden selection:bg-[#18B49C] selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <div className="hero-section-trigger relative min-h-screen flex flex-col items-center pt-20 pb-10 max-w-full mx-auto">
        
        {/* TITRE & SOUS-TITRE */}
        <div className="text-center mb-10 z-20 px-6 max-w-4xl">
          <h1 className="hero-text text-5xl md:text-7xl font-avenueX leading-[1.1] tracking-tight text-gray-900 mb-6">
            Trouvez l'école parfaite,<br />
            <span className="text-transparent font-avenueX bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">
              construisez votre avenir
            </span>
          </h1>
          <p className="hero-text text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
            Rejoignez une communauté de plus de 50 000 étudiants satisfaits.
          </p>
        </div>

        {/* --- TÉMOIGNAGES INFINITE SCROLL --- */}
        <div className="testimonials-container w-full max-w-full overflow-hidden relative z-30 mb-8 py-4">
             {/* Masques de flou sur les côtés pour l'effet fondu */}
             <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-40"></div>
             <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-40"></div>

             {/* Le Track qui contient les éléments doublés */}
             <div className="testimonials-track flex gap-6 w-max pl-6">
                {/* On double la liste pour créer la boucle infinie */}
                {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] px-5 py-3 rounded-full min-w-[280px] hover:scale-105 transition-transform cursor-default">
                        <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full border-2 border-gray-50 object-cover flex-shrink-0" />
                        <div className="flex flex-col">
                            <p className="text-xs font-bold text-gray-800">{item.name} <span className="text-[#18B49C] font-normal">• {item.role}</span></p>
                            <p className="text-xs text-gray-500 italic truncate max-w-[160px]">"{item.text}"</p>
                        </div>
                    </div>
                ))}
             </div>
        </div>

        {/* --- IMAGE HERO MORPHING --- */}
        <div className="hero-morph-container h-[500px] md:h-[650px] overflow-hidden relative z-10 mx-auto">
            <img src={HERO_IMG} alt="Students" className="hero-inner-img w-full h-full object-cover" />
             <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="flex justify-center mt-12 hero-text relative z-20">
            <button className="px-8 py-3 font-bold text-sm tracking-widest uppercase bg-white border border-gray-200 text-gray-600 hover:text-[#370669] hover:border-[#370669] rounded-full transition-colors">
              Découvrir formation
            </button>
        </div>
      </div>


      {/* --- SECTION 2 : ÉTUDIANTS --- */}
      <div className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            
            {/* Image Parallax Gauche */}
            <div className="parallax-container h-[500px] w-full rounded-[2rem] overflow-hidden relative shadow-2xl shadow-gray-100">
                <img src={STUDENT_IMG} alt="Étudiant" className="absolute w-full h-full object-cover" />
            </div>

            {/* Texte Droite */}
            <div className="text-reveal pl-0 md:pl-8">
                <span className="text-[#18B49C] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-[#18B49C]"></span>
                    Étudiants
                </span>
                <h2 className="text-5xl md:text-6xl font-orange mb-6 text-slate-900 leading-tight">
                    Pour les etudiants
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                    Explorez les meilleures formations et postulez en quelques clics. 
                    Nous simplifions votre parcours vers l'excellence.
                </p>
                <ul className="space-y-4">
                  {[
                      "Recherchez parmi des milliers de formations",
                      "Comparez les programmes en détail",
                      "Postulez directement en ligne",
                      "Suivez vos candidatures en temps réel"
                  ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-gray-700 font-medium">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-50 text-[#18b49c] flex items-center justify-center text-sm">✓</span>
                          {item}
                      </li>
                  ))}
                </ul>
                <button className="mt-10 group flex items-center gap-2 text-[#18b49c] font-bold hover:gap-4 transition-all">
                    Commencer l'inscription <span className="text-xl">→</span>
                </button>
            </div>
          </div>
      </div>


      {/* --- SECTION 3 : ÉCOLES --- */}
      <div className="py-24 px-6 max-w-7xl mx-auto rounded-[3rem] mb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            
            {/* Texte Gauche */}
            <div className="text-reveal pr-0 md:pr-8 order-2 md:order-1">
            <span className="text-[#18B49C] font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#18B49C]"></span>
                    Institutions
                </span>
                <h2 className="text-5xl md:text-6xl font-orange mb-6 text-slate-9000 leading-tight">
                    Pour les ecoles
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                    Présentez vos formations, gérez vos inscriptions, et suivez vos étudiants
                    avec nos outils dédiés aux professionnels de l'éducation.
                </p>
                <ul className="space-y-4">
                  {[
                      "Créez votre profil école attractif",
                      "Publiez vos formations et programmes",
                      "Gérez les candidatures centralisées",
                      "Analysez vos statistiques de vues"
                  ].map((item, i) => (
                      <li key={i} className="flex items-start gap-4 text-gray-700 font-medium">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-[#27b6d8] flex items-center justify-center text-sm">✓</span>
                          {item}
                      </li>
                  ))}
                </ul>
                 <button className="mt-10 group flex items-center gap-2 text-[#27b6d8] font-bold hover:gap-4 transition-all">
                    Devenir partenaire <span className="text-xl">→</span>
                </button>
            </div>

            {/* Image Parallax Droite */}
            <div className="parallax-container h-[500px] w-full rounded-[2rem] overflow-hidden relative shadow-2xl shadow-blue-100 order-1 md:order-2">
                <img src={SCHOOL_IMG} alt="École" className="absolute w-full h-full object-cover" />
            </div>

          </div>
      </div>

    </div>
  );
};

export default MinimalistMorph;