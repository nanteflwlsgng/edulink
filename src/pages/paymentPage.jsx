import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Lock, ShieldCheck, CreditCard, Smartphone, 
  CheckCircle2, ArrowLeft, Loader2, Home, Download, Mail
} from "lucide-react";

// --- LOGOS SIMULÉS ---
const LogoVisa = () => <span className="font-bold text-blue-800 italic text-xl tracking-tighter">VISA</span>;
const LogoMastercard = () => <div className="flex -space-x-2"><div className="w-6 h-6 rounded-full bg-red-500/80"></div><div className="w-6 h-6 rounded-full bg-orange-400/80"></div></div>;

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // États
  const [method, setMethod] = useState("card"); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phone, setPhone] = useState("");

  // Simulation de données
  const order = {
    school: "Sorbonne Université",
    program: "Licence Droit",
    totalYear: "4 500 000 Ar",
    deposit: "900 000 Ar", 
    fee: "2 000 Ar"
  };

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulation d'appel API Paiement
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      window.scrollTo(0, 0); // Remonte en haut pour voir le ticket
    }, 2500);
  };

// --- ÉCRAN DE SUCCÈS : STYLE "CARTE CARRÉE PREMIUM" ---
if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] font-poppins flex items-center justify-center p-6 relative overflow-hidden">
        
        {/* Fond d'ambiance flou */}
        <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#18B49C]/20 to-[#370669]/20 rounded-full blur-[100px]"></div>
        </div>

        {/* LA CARTE CARRÉE */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-white/50 max-w-sm w-full text-center relative z-10 animate-scaleIn">
          
          {/* Icône animée */}
          <div className="w-16 h-16 bg-[#18B49C] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#18B49C]/30 animate-bounce">
             <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={3} />
          </div>

          {/* Titre & Montant */}
          <h2 className="text-xl font-bold text-slate-900 mb-1">Paiement Validé</h2>
          <p className="text-gray-400 text-xs mb-6 font-medium">Référence : #TX-89201</p>
          
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
             <span className="block text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Montant Payé</span>
             <span className="block text-3xl font-extrabold text-[#370669]">902 000 Ar</span>
          </div>

          {/* Détails compacts */}
          <div className="grid grid-cols-2 gap-4 text-xs text-left mb-8 px-2">
             <div>
                <span className="block text-gray-400">Date</span>
                <span className="font-bold text-slate-700">{new Date().toLocaleDateString()}</span>
             </div>
             <div>
                <span className="block text-gray-400">Moyen</span>
                <span className="font-bold text-slate-700 capitalize">{method === 'card' ? 'Carte' : 'Mobile'}</span>
             </div>
             <div>
                <span className="block text-gray-400">Ecole</span>
                <span className="font-bold text-slate-700 truncate">{order.school}</span>
             </div>
             <div>
                <span className="block text-gray-400">Formation</span>
                <span className="font-bold text-slate-700 truncate">{order.program}</span>
             </div>
        
          </div>

          {/* Boutons (Action principale + Secondaire) */}
          <div className="space-y-3">
            <button 
                onClick={() => navigate("/dashboard")} 
                className="w-full bg-[#370669] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#2b0554] hover:shadow-lg hover:shadow-[#370669]/20 transition-all flex items-center justify-center gap-2"
            >
                <Home className="w-4 h-4" /> Retour au Dashboard
            </button>
            
            <button className="w-full text-gray-400 hover:text-[#370669] py-2 font-bold text-xs transition-colors flex items-center justify-center gap-2">
                <Download className="w-3 h-3" /> Télécharger le reçu
            </button>
          </div>

        </div>
      </div>
    );
  }

  // --- RESTE DU FORMULAIRE DE PAIEMENT ---
  return (
    <div className="min-h-screen py-10 font-poppins flex items-center justify-center px-4 md:px-6">
      
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-5 gap-0 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2rem] overflow-hidden bg-white">
        
        {/* === GAUCHE : RÉCAPITULATIF === */}
        <div className="lg:col-span-2 bg-[#370669] text-white p-8 md:p-12 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#18B49C] rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
          
          <div>
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-bold mb-10">
              <ArrowLeft className="w-4 h-4" /> Annuler
            </button>
            
            <h1 className="text-2xl font-bold mb-2">Récapitulatif</h1>
            <p className="text-white/60 text-sm mb-8">Vérifiez les détails avant de valider.</p>

            <div className="space-y-6">
               <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10">
                  <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Formation</p>
                  <p className="font-bold text-lg">{order.program}</p>
                  <p className="text-sm text-[#18B49C]">{order.school}</p>
               </div>
               
               <div className="flex justify-between items-center py-4 border-b border-white/10">
                  <span className="text-white/70">Acompte Inscription</span>
                  <span className="font-bold">{order.deposit}</span>
               </div>
               <div className="flex justify-between items-center py-4 border-b border-white/10">
                  <span className="text-white/70">Frais de plateforme</span>
                  <span className="font-bold">{order.fee}</span>
               </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/20">
             <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium">Total à payer</span>
                <span className="text-3xl font-bold tracking-tight">902 000 <span className="text-base font-normal text-white/60">Ar</span></span>
             </div>
             <div className="flex items-center gap-2 text-[10px] text-[#18B49C] bg-[#18B49C]/10 px-3 py-1.5 rounded-full w-fit">
                <ShieldCheck className="w-3 h-3" /> Paiement chiffré SSL 256-bit
             </div>
          </div>
        </div>

        {/* === DROITE : PAIEMENT === */}
        <div className="lg:col-span-3 p-8 md:p-12 bg-white">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900">Moyen de paiement</h2>
            <div className="flex gap-2">
                <LogoVisa />
                <div className="w-px h-6 bg-gray-200 mx-1"></div>
                <LogoMastercard />
            </div>
          </div>

          {/* SÉLECTEUR DE MÉTHODE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
             <MethodCard 
                active={method === 'card'} 
                onClick={() => setMethod('card')}
                icon={<CreditCard className="w-6 h-6" />}
                label="Carte"
             />
             <MethodCard 
                active={method === 'mvola'} 
                onClick={() => setMethod('mvola')}
                imgColor="bg-yellow-400"
                label="MVola"
             />
             <MethodCard 
                active={method === 'orange'} 
                onClick={() => setMethod('orange')}
                imgColor="bg-orange-500"
                label="Orange"
             />
             <MethodCard 
                active={method === 'airtel'} 
                onClick={() => setMethod('airtel')}
                imgColor="bg-red-500"
                label="Airtel"
             />
          </div>

          {/* FORMULAIRE DYNAMIQUE */}
          <form onSubmit={handlePay} className="animate-fadeIn">
            
            {method === 'card' ? (
                <div className="space-y-5">
                    <InputGroup label="Nom sur la carte" placeholder="M. JEAN DUPONT" icon={ShieldCheck} />
                    <InputGroup label="Numéro de carte" placeholder="0000 0000 0000 0000" icon={CreditCard} />
                    <div className="grid grid-cols-2 gap-5">
                        <InputGroup label="Date d'expiration" placeholder="MM / AA" />
                        <InputGroup label="CVC" placeholder="123" icon={Lock} />
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center">
                    <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md text-white ${
                        method === 'mvola' ? 'bg-yellow-400' : method === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                    }`}>
                        <Smartphone className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">Paiement Mobile {method === 'mvola' ? 'MVola' : method === 'orange' ? 'Orange Money' : 'Airtel Money'}</h3>
                    <p className="text-xs text-gray-500 mb-6">Validez la notification sur votre téléphone.</p>
                    
                    <div className="max-w-xs mx-auto text-left">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Numéro de téléphone</label>
                        <div className="relative">
                            <span className="absolute left-4 top-3.5 text-gray-500 font-bold text-sm">+261</span>
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="34 00 000 00" 
                                className="w-full pl-16 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#370669] focus:ring-2 focus:ring-[#370669]/20 outline-none transition-all font-mono text-slate-800"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* BOUTON D'ACTION */}
            <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full mt-8 bg-[#370669] text-white py-4 rounded-xl font-bold text-sm hover:bg-[#2b0554] hover:shadow-lg hover:shadow-[#370669]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Traitement sécurisé...
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4" /> Payer 902 000 Ar
                    </>
                )}
            </button>
            
            <p className="text-center text-[10px] text-gray-400 mt-4 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Vos informations sont chiffrées et ne sont pas stockées.
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}

// --- SOUS-COMPOSANTS UI ---

const MethodCard = ({ active, onClick, icon, imgColor, label }) => (
    <button 
        type="button"
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
            active 
            ? 'border-[#370669] bg-[#370669]/5 shadow-inner' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }`}
    >
        {active && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#370669]"></div>}
        
        {icon ? (
            <div className={`text-[#370669] mb-2 ${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
        ) : (
            <div className={`w-8 h-8 rounded-full mb-2 ${imgColor} shadow-sm ${active ? 'ring-2 ring-offset-2 ring-[#370669]' : ''}`}></div>
        )}
        
        <span className={`text-xs font-bold ${active ? 'text-[#370669]' : 'text-gray-500'}`}>{label}</span>
    </button>
);

const InputGroup = ({ label, placeholder, icon: Icon }) => (
    <div>
        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">{label}</label>
        <div className="relative">
            <input 
                type="text" 
                placeholder={placeholder}
                className="w-full pl-4 pr-10 py-3 rounded-xl border border-gray-200 focus:border-[#370669] focus:ring-2 focus:ring-[#370669]/20 outline-none transition-all text-sm placeholder:text-gray-300 font-medium text-slate-800"
            />
            {Icon && <Icon className="absolute right-4 top-3.5 w-4 h-4 text-gray-400" />}
        </div>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 font-medium">{label}</span>
        <span className="font-bold text-slate-800 text-right">{value}</span>
    </div>
);