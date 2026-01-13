import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, Twitter, Instagram, Linkedin, Send, 
  MapPin, Phone, Mail, ChevronRight, Heart 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#370669] text-white pt-20 pb-10 overflow-hidden font-poppins">
      
      {/* --- AMBIANCE LUMINEUSE (BACKGROUND) --- */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#18B49C] rounded-full blur-[150px] opacity-10 pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8b5cf6] rounded-full blur-[120px] opacity-10 pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* --- PARTIE SUPÉRIEURE : NEWSLETTER & CTA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16 border-b border-white/10 pb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
              Ne manquez aucune opportunité.
            </h2>
            <p className="text-white/60 text-sm">
              Rejoignez 15,000+ étudiants et recevez les dernières offres de formation.
            </p>
          </div>
          
          <form className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#18B49C] to-[#370669] rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative flex bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-1.5 focus-within:bg-white/10 focus-within:border-white/20 transition-all">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5" />
               <input 
                  type="email" 
                  placeholder="votre-email@exemple.com" 
                  className="w-full bg-transparent text-white placeholder-white/40 pl-12 pr-4 py-3 outline-none text-sm font-medium"
               />
               <button className="bg-[#18B49C] hover:bg-[#159c87] text-white px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#18B49C]/20 flex items-center gap-2">
                  S'abonner <Send className="w-3 h-3" />
               </button>
            </div>
          </form>
        </div>

        {/* --- PARTIE CENTRALE : LIENS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
          
          {/* COLONNE 1 : BRAND */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
              <div className="w-16 h-16 rounded-full bg-[#18B49C] flex items-center justify-center text-white">
        <img src="/icons8-éducation-64 1.png" alt="Logo" className="h-10 w-10" />
              </div>
              <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-white">EduLink</span>
      </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              La première plateforme d'orientation et d'inscription universitaire à Madagascar. Connectez votre avenir.
            </p>
            <div className="flex gap-3">
              <SocialBtn icon={Facebook} />
              <SocialBtn icon={Twitter} />
              <SocialBtn icon={Instagram} />
              <SocialBtn icon={Linkedin} />
            </div>
          </div>

          {/* COLONNE 2 : ÉTUDIANTS */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              Étudiants <div className="h-1 w-1 rounded-full bg-[#18B49C]"></div>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/formations">Toutes les formations</FooterLink>
              <FooterLink to="/orientation">Test d'orientation</FooterLink>
              <FooterLink to="/bourses">Bourses d'études</FooterLink>
              <FooterLink to="/guide">Guide de l'étudiant</FooterLink>
              <FooterLink to="/account">Mon Espace</FooterLink>
            </ul>
          </div>

          {/* COLONNE 3 : ÉTABLISSEMENTS */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              Écoles <div className="h-1 w-1 rounded-full bg-[#18B49C]"></div>
            </h3>
            <ul className="space-y-3">
              <FooterLink to="/partner">Devenir partenaire</FooterLink>
              <FooterLink to="/dashboard">Tableau de bord</FooterLink>
              <FooterLink to="/tarifs">Tarifs & Offres</FooterLink>
              <FooterLink to="/success-stories">Success Stories</FooterLink>
            </ul>
          </div>

          {/* COLONNE 4 : CONTACT */}
          <div>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              Contact <div className="h-1 w-1 rounded-full bg-[#18B49C]"></div>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="w-5 h-5 text-[#18B49C] shrink-0 mt-0.5" />
                <span>Enceinte Galaxy, Andraharo<br/>Antananarivo 101, Madagascar</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="w-5 h-5 text-[#18B49C] shrink-0" />
                <span>+261 34 00 000 00</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="w-5 h-5 text-[#18B49C] shrink-0" />
                <span>contact@eduplatform.mg</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- PARTIE INFÉRIEURE : COPYRIGHT --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} EduLink. Tous droits réservés.</p>
          
          <div className="flex gap-6 font-medium">
             <Link to="/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
             <Link to="/terms" className="hover:text-white transition-colors">CGU</Link>
             <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>

          <p className="flex items-center gap-1">
             Fait avec <Heart className="w-3 h-3 text-red-500 fill-red-500" /> à Madagascar
          </p>
        </div>

      </div>
    </footer>
  );
}

// --- COMPOSANTS INTERNES ---

const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors duration-300"
    >
      <ChevronRight className="w-3 h-3 text-[#18B49C] opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      <span className="relative">
        {children}
        <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-[#18B49C] transition-all duration-300 group-hover:w-full"></span>
      </span>
    </Link>
  </li>
);

const SocialBtn = ({ icon: Icon }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#18B49C] border border-white/10 hover:border-[#18B49C] flex items-center justify-center text-white transition-all duration-300 hover:-translate-y-1">
    <Icon className="w-4 h-4" />
  </a>
);