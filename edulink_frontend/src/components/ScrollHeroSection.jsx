// src/components/ProfessionalHome.jsx
import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, CheckCircle2, Star, ShieldCheck, Users } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ProfessionalHome = () => {
  const mainRef = useRef(null);

  // Images (Style Bureau / Campus lumineux)
  const HERO_IMG = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"; 
  const STUDENT_IMG = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop"; 
  const SCHOOL_IMG = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2000&auto=format&fit=crop"; 

  // Vos données
  const TESTIMONIALS = [
    { name: "Léa", role: "Design", img: "https://i.pravatar.cc/150?img=5", text: "J'ai trouvé mon école en 2 jours." },
    { name: "Thomas", role: "Marketing", img: "https://i.pravatar.cc/150?img=11", text: "Une plateforme intuitive !" },
    { name: "Sarah", role: "Droit", img: "https://i.pravatar.cc/150?img=9", text: "Le matching est parfait." },
    { name: "Mehdi", role: "Ingénieur", img: "https://i.pravatar.cc/150?img=3", text: "Admis à Lyon grâce à vous." },
    { name: "Julie", role: "Santé", img: "https://i.pravatar.cc/150?img=1", text: "Simple, rapide, efficace." },
  ];

  const STUDENT_FEATURES = [
    "Recherchez parmi des milliers de formations",
    "Comparez les programmes en détail",
    "Postulez directement en ligne",
    "Suivez vos candidatures en temps réel"
  ];

  const SCHOOL_FEATURES = [
    "Créez votre profil école attractif",
    "Publiez vos formations et programmes",
    "Gérez les candidatures centralisées",
    "Analysez vos statistiques de vues"
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      
      // 1. ANIMATION HERO (Douce montée)
      const tl = gsap.timeline();
      tl.from(".hero-content", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" })
        .from(".hero-image", { x: 30, opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.6");

      // 2. MARQUEE (Défilement fluide)
      gsap.to(".testimonials-track", {
        xPercent: -50,
        repeat: -1,
        duration: 40, // Plus lent pour être lisible
        ease: "none",
      });

      // 3. ANIMATION SECTIONS (Apparition au scroll)
      const sections = gsap.utils.toArray(".fade-section");
      sections.forEach((sec) => {
        gsap.from(sec, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sec,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="bg-white text-slate-800 font-poppins overflow-x-hidden selection:bg-[#18B49C] selection:text-white">
      
      {/* --- HERO SECTION (Classique & Efficace) --- */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-10 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texte Gauche */}
          <div className="max-w-2xl">
            <span className="hero-content inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#27b6d8] text-xs font-bold uppercase tracking-wider mb-6">
               <span className="w-2 h-2 rounded-full bg-[#27b6d8]"></span> Plateforme N°1 en Orientation
            </span>
            <h1 className="hero-content text-4xl lg:text-6xl font-bold text-slate-900 leading-[1.15] mb-6">
              Trouvez l'école qui <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18B49C] to-[#27b6d8]">
                changera votre avenir.
              </span>
            </h1>
            <p className="hero-content text-base text-gray-500 mb-8 leading-relaxed">
              Rejoignez une communauté de 50 000+ étudiants. Comparez, choisissez et postulez aux meilleures formations en toute simplicité.
            </p>
            <div className="hero-content flex flex-wrap gap-4">
               <button className="px-8 py-3.5 bg-[#370669] text-white rounded-lg font-semibold hover:bg-[#2a0452] transition-colors shadow-lg shadow-[#370669]/20 flex items-center gap-2">
                 Explorer les formations <ArrowRight className="w-4 h-4" />
               </button>
               <button className="px-8 py-3.5 bg-white border border-gray-200 text-slate-700 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                 Comment ça marche ?
               </button>
            </div>
            
            {/* Trust Badges */}
            <div className="hero-content mt-10 flex items-center gap-6 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#18B49C]"/> Dossiers vérifiés</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-[#18B49C]"/> +500 Écoles</div>
            </div>
          </div>

          {/* Image Droite (Propre avec bords arrondis) */}
          <div className="hero-image relative lg:h-[500px]">
             <img src={HERO_IMG} alt="Students working" className="w-full h-full object-cover rounded-2xl shadow-2xl shadow-gray-200" />
             
             {/* Floating Card */}
             <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-50 hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-3 mb-2">
                   <div className="flex -space-x-2">
                      <img src="https://i.pravatar.cc/100?img=12" className="w-8 h-8 rounded-full border-2 border-white" />
                      <img src="https://i.pravatar.cc/100?img=32" className="w-8 h-8 rounded-full border-2 border-white" />
                      <img src="https://i.pravatar.cc/100?img=15" className="w-8 h-8 rounded-full border-2 border-white" />
                   </div>
                   <span className="text-sm font-bold text-slate-900">+2k Inscrits aujourd'hui</span>
                </div>
                <div className="flex gap-1">
                   {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />)}
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* --- BANDEAU AVIS (Fond Gris clair pour séparer) --- */}
      <div className="bg-slate-50 py-16 border-y border-gray-100 overflow-hidden">
         <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Ils nous font confiance</h2>
         </div>
         
         {/* Carrousel Déroulant */}
         <div className="w-full overflow-hidden relative">
             <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
             <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>

             <div className="testimonials-track flex gap-6 w-max pl-6">
                {[...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS].map((item, index) => (
                    <div key={index} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm min-w-[300px] flex flex-col gap-3">
                        <p className="text-sm text-gray-600 italic">"{item.text}"</p>
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                            <img src={item.img} alt={item.name} className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="text-xs font-bold text-slate-900">{item.name}</p>
                                <p className="text-[10px] text-gray-400 uppercase">{item.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
         </div>
      </div>

      {/* --- SECTION ÉTUDIANTS --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center fade-section">
            
            {/* Image Gauche */}
            <div className="relative order-2 lg:order-1">
                <div className="absolute inset-0 bg-[#18B49C] rounded-2xl transform rotate-3 opacity-20 translate-y-4 translate-x-4"></div>
                <img src={STUDENT_IMG} alt="Student" className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-lg" />
            </div>

            {/* Texte Droite */}
            <div className="order-1 lg:order-2">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-[#18B49C] mb-6">
                   <Users className="w-6 h-6" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                   L'espace Étudiant. <br/> Simplifiez votre orientation.
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                   Plus besoin de multiplier les dossiers. Créez votre profil unique et postulez à des centaines de formations vérifiées en quelques clics.
                </p>

                <ul className="space-y-4">
                   {STUDENT_FEATURES.map((feat, i) => (
                       <li key={i} className="flex items-start gap-3">
                           <CheckCircle2 className="w-5 h-5 text-[#18B49C] flex-shrink-0 mt-0.5" />
                           <span className="text-slate-700 font-medium">{feat}</span>
                       </li>
                   ))}
                </ul>

                <button className="mt-8 text-[#18B49C] font-bold hover:text-[#14806e] flex items-center gap-2 group">
                    Créer mon profil étudiant <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

         </div>
      </div>

      {/* --- SECTION ÉCOLES --- */}
      <div className="bg-[#fcfbfc] py-24 border-t border-gray-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center fade-section">
                
                {/* Texte Gauche */}
                <div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-[#370669] mb-6">
                       <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">
                       Pour les Écoles. <br/> Attirez les meilleurs talents.
                    </h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                       Une suite d'outils complète pour gérer vos admissions, promouvoir vos programmes et analyser votre attractivité auprès des étudiants.
                    </p>

                    <ul className="space-y-4">
                       {SCHOOL_FEATURES.map((feat, i) => (
                           <li key={i} className="flex items-start gap-3">
                               <span className="w-5 h-5 rounded-full bg-[#370669] text-white flex items-center justify-center text-[10px] font-bold mt-0.5">
                                   {i + 1}
                               </span>
                               <span className="text-slate-700 font-medium">{feat}</span>
                           </li>
                       ))}
                    </ul>

                    <button className="mt-8 px-6 py-3 bg-white border border-gray-300 text-slate-700 rounded-lg font-bold hover:border-[#370669] hover:text-[#370669] transition-colors">
                        Espace Établissement
                    </button>
                </div>

                {/* Image Droite */}
                <div className="relative">
                    <div className="absolute inset-0 bg-[#370669] rounded-2xl transform -rotate-3 opacity-10 translate-y-4 -translate-x-4"></div>
                    <img src={SCHOOL_IMG} alt="School" className="relative z-10 w-full h-[500px] object-cover rounded-2xl shadow-lg" />
                </div>

            </div>
         </div>
      </div>

      {/* --- CTA FINAL --- */}
      <div className="py-20 text-center px-6">
          <div className="max-w-3xl mx-auto bg-[#370669] rounded-3xl p-10 md:p-16 text-white shadow-2xl shadow-[#370669]/30 fade-section">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à commencer ?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Rejoignez la plateforme dès aujourd'hui et accédez à toutes les fonctionnalités gratuitement.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button className="px-8 py-3 bg-white text-[#370669] rounded-lg font-bold hover:bg-gray-100 transition-colors">
                      Inscription Étudiants
                  </button>
                  <button className="px-8 py-3 bg-transparent border border-white/30 text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
                      Partenaire Écoles
                  </button>
              </div>
          </div>
      </div>

    </div>
  );
};

export default ProfessionalHome;