import React, { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";

const variants = {
  success: {
    icon: CheckCircle2,
    bg: "bg-[#18B49C]/10",
    border: "border-[#18B49C]/20",
    text: "text-[#18B49C]",
    title: "Succès",
    glow: "shadow-[0_0_30px_-5px_rgba(24,180,156,0.3)]"
  },
  error: {
    icon: AlertCircle,
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-500",
    title: "Erreur",
    glow: "shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]"
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-100",
    text: "text-amber-500",
    title: "Attention",
    glow: "shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]"
  },
  info: {
    icon: Info,
    bg: "bg-[#370669]/5",
    border: "border-[#370669]/10",
    text: "text-[#370669]",
    title: "Information",
    glow: "shadow-[0_0_30px_-5px_rgba(55,6,105,0.2)]"
  }
};

export default function Toast({ type = "success", message, onClose, duration = 4000 }) {
  const [isVisible, setIsVisible] = useState(false);
  const style = variants[type];
  const Icon = style.icon;

  useEffect(() => {
    // Animation d'entrée
    setTimeout(() => setIsVisible(true), 10);

    // Auto-close
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Attendre la fin de l'animation de sortie
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`fixed bottom-6 right-6 z-[9999] transition-all duration-500 ease-out transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
      <div className={`relative flex items-start gap-4 p-5 rounded-[1.5rem] bg-white/90 backdrop-blur-xl border ${style.border} ${style.glow} min-w-[320px] max-w-md shadow-2xl`}>
        
        {/* Icône avec fond coloré */}
        <div className={`p-3 rounded-2xl ${style.bg} ${style.text} shadow-sm flex-shrink-0`}>
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>

        {/* Contenu */}
        <div className="flex-1 pt-1">
          <h4 className={`font-bold text-sm ${style.text} mb-1`}>{style.title}</h4>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">
            {message}
          </p>
        </div>

        {/* Bouton Fermer */}
        <button 
          onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
          className="text-gray-300 hover:text-slate-500 transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Barre de progression (Timer visuel) */}
        <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-gray-100 rounded-full overflow-hidden">
            <div 
                className={`h-full ${style.bg.replace('/10', '').replace('/5', '')} ${type === 'success' ? 'bg-[#18B49C]' : type === 'info' ? 'bg-[#370669]' : ''}`} 
                style={{ 
                    width: isVisible ? '0%' : '100%', 
                    transition: `width ${duration}ms linear` 
                }}
            ></div>
        </div>
      </div>
    </div>
  );
}