import React, { useState, useEffect } from "react";
import { 
  X, Plus, Trash2, Save, Image as ImageIcon, 
  Calendar, MapPin, DollarSign, BookOpen, Clock, CheckCircle 
} from "lucide-react";

export default function FormationModal({ isOpen, onClose, onSubmit, initialData }) {
  // État initial vide
  const emptyState = {
    title: "",
    category: "Informatique",
    level: "Licence",
    duration: "",
    mode: "Présentiel",
    language: "Français",
    startDate: "",
    endDate: "",
    city: "",
    country: "",
    price: "",
    paymentType: "/ an",
    insertionRate: "",
    description: "",
    image: "",
    type: "Sélection de dossier",
    conditions: [] 
  };

  const [formData, setFormData] = useState(emptyState);
  const [conditionInput, setConditionInput] = useState("");

  // EFFET : Quand le modal s'ouvre, on vérifie si c'est pour éditer ou créer
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData); // Mode Édition
      } else {
        setFormData(emptyState); // Mode Création
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      setFormData({ ...formData, conditions: [...formData.conditions, conditionInput] });
      setConditionInput("");
    }
  };

  const removeCondition = (index) => {
    const newConditions = formData.conditions.filter((_, i) => i !== index);
    setFormData({ ...formData, conditions: newConditions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
        alert("Veuillez remplir au moins le titre et le prix.");
        return;
    }
    onSubmit(formData); // Renvoie les données modifiées au parent
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeInUp">
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? "Modifier la formation" : "Nouvelle Formation"}
            </h2>
            <p className="text-xs text-gray-500">
              {initialData ? "Mettez à jour les informations ci-dessous." : "Remplissez les détails pour la fiche publique."}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* FORMULAIRE (Identique à avant) */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <form id="formation-form" onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4">
              <SectionTitle icon={BookOpen} title="Informations Générales" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Titre de la formation" name="title" placeholder="Ex: Master Data Science" value={formData.title} onChange={handleChange} fullWidth />
                <Select label="Catégorie" name="category" value={formData.category} onChange={handleChange} 
                  options={["Informatique", "Marketing", "Design", "Business", "Santé", "Droit", "Ingénierie"]} />
                <Select label="Niveau" name="level" value={formData.level} onChange={handleChange} 
                  options={["Bachelor", "Licence", "Master", "MBA", "Doctorat", "Certificat"]} />
                <Input label="Taux d'insertion (Est.)" name="insertionRate" placeholder="Ex: 94%" value={formData.insertionRate} onChange={handleChange} />
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-100">
               <SectionTitle icon={Clock} title="Modalités & Dates" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Input label="Durée" name="duration" placeholder="Ex: 2 ans" value={formData.duration} onChange={handleChange} />
                 <Input label="Langue(s)" name="language" placeholder="Ex: Fr & En" value={formData.language} onChange={handleChange} />
                 <Select label="Format" name="mode" value={formData.mode} onChange={handleChange} options={["Présentiel", "En ligne", "Hybride"]} />
                 <Input label="Date de rentrée" type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                 <Input label="Date limite dossier" type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                 <Input label="Type d'admission" name="type" placeholder="Ex: Concours, Dossier" value={formData.type} onChange={handleChange} />
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-100">
              <SectionTitle icon={MapPin} title="Localisation & Visuel" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Ville" name="city" placeholder="Ex: Paris" value={formData.city} onChange={handleChange} />
                 <Input label="Pays" name="country" placeholder="Ex: France" value={formData.country} onChange={handleChange} />
                 <div className="md:col-span-2">
                    <Input label="URL Image de couverture" name="image" placeholder="https://..." icon={ImageIcon} value={formData.image} onChange={handleChange} fullWidth />
                 </div>
              </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-gray-100">
              <SectionTitle icon={DollarSign} title="Tarification" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Montant" name="price" placeholder="Ex: 4 500 000 Ar" value={formData.price} onChange={handleChange} />
                 <Input label="Fréquence" name="paymentType" placeholder="Ex: / an, / total" value={formData.paymentType} onChange={handleChange} />
              </div>
            </section>

             <section className="space-y-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Description du programme</label>
                        <textarea 
                            name="description"
                            value={formData.description} 
                            onChange={handleChange}
                            className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#27b6d8] focus:ring-2 focus:ring-[#27b6d8]/20 outline-none text-sm min-h-[150px] resize-none"
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Pré-requis / Conditions</label>
                        <div className="flex gap-2 mb-2">
                            <input 
                                type="text" 
                                value={conditionInput}
                                onChange={(e) => setConditionInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                                placeholder="Ex: Baccalauréat Scientifique..."
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm focus:border-[#27b6d8] outline-none"
                            />
                            <button type="button" onClick={addCondition} className="bg-[#370669] text-white p-2 rounded-xl hover:bg-[#2a0552]">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                            {formData.conditions.map((cond, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-lg text-sm text-slate-700 animate-fadeIn">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-[#18B49C]" /> {cond}
                                    </div>
                                    <button type="button" onClick={() => removeCondition(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
          </form>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
            <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-200 transition-colors">
                Annuler
            </button>
            <button 
                type="submit" 
                form="formation-form"
                className="px-8 py-3 rounded-xl font-bold text-sm text-white bg-[#27b6d8] hover:bg-[#1fa0bc] shadow-lg shadow-[#27b6d8]/20 flex items-center gap-2 transition-all transform hover:scale-105"
            >
                <Save className="w-4 h-4" /> {initialData ? "Enregistrer les modifications" : "Publier la formation"}
            </button>
        </div>
      </div>
    </div>
  );
}

// Helpers (Identiques à avant)
const SectionTitle = ({ icon: Icon, title }) => (
    <h3 className="text-xs font-bold uppercase tracking-widest text-[#370669] flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" /> {title}
    </h3>
);

const Input = ({ label, name, type = "text", value, onChange, placeholder, fullWidth, icon: Icon }) => (
    <div className={`space-y-1.5 ${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}>
        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{label}</label>
        <div className="relative">
            <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#27b6d8] focus:ring-2 focus:ring-[#27b6d8]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-gray-300"/>
             {Icon && <Icon className="absolute right-3 top-3 w-4 h-4 text-gray-400" />}
        </div>
    </div>
);

const Select = ({ label, name, value, onChange, options }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{label}</label>
        <div className="relative">
            <select name={name} value={value} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#27b6d8] focus:ring-2 focus:ring-[#27b6d8]/20 outline-none text-sm text-slate-800 appearance-none bg-white cursor-pointer">
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    </div>
);