import React from "react";
import { Bot, Sparkles } from "lucide-react";

export default function FloatingAssistant({ onClick, isVisible }) {
  if (!isVisible) return null;

  return (
    <button 
      onClick={onClick}
      className="fixed bottom-8 right-8 z-[900] group animate-bounce-slow"
    >
      {/* Effet de Halo */}
      <div className="absolute inset-0 bg-[#370669] rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
      
      {/* Le Robot */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-[#370669] to-[#5b2299] rounded-full flex items-center justify-center shadow-2xl border border-white/20 hover:scale-110 transition-transform duration-300">
        <Bot className="w-8 h-8 text-white" />
        
        {/* Badge Notification IA */}
        <div className="absolute -top-1 -right-1 bg-[#18B49C] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
            <Sparkles className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Tooltip au survol */}
      <div className="absolute bottom-full right-0 mb-4 w-48 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl text-xs text-slate-600 border border-white/50 text-right">
            <span className="font-bold text-[#370669] block">Assistant IA</span>
            Cliquez pour analyser les dossiers et générer le classement.
        </div>
      </div>
    </button>
  );
}