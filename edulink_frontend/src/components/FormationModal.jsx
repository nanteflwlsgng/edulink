import React, { useState, useEffect } from "react";
import { 
  X, Save, Image as ImageIcon, UploadCloud,
  Calendar, MapPin, DollarSign, BookOpen, Clock, CheckCircle, Trash2, Plus, Users,
} from "lucide-react";

export default function FormationModal({ isOpen, onClose, onSubmit, initialData }) {
  const emptyState = {
    title: "", category: "Informatique", level: "Licence", duration: "",
    mode: "Présentiel", language: "Français", startDate: "", endDate: "",
    city: "", country: "", price: "", paymentType: "/ an", insertionRate: "",
    description: "", image: null, imagePreview: "",
    type: "Sélection de dossier", conditions: [] ,quota: ""
  };
  

  const [formData, setFormData] = useState(emptyState);
  const [conditionInput, setConditionInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // --- CORRECTION DU BUG ICI ---
  useEffect(() => {
    if (isOpen) {
        if (initialData) {
          setFormData({
              ...emptyState,
              ...initialData,
              conditions: initialData.conditions || [],
              image: null, // On ne met pas l'URL dans 'image' (qui attend un File)
              imagePreview: initialData.image // On met l'URL dans la preview pour l'afficher
          });
          
          // Si l'image est une URL string, on met l'input file à vide mais on affiche la preview
        } else {
          setFormData(emptyState);
        }
      }
    }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // On utilise FormData pour envoyer l'image + les données
    const dataToSend = new FormData();
    
    // Ajout des champs textes
    Object.keys(formData).forEach(key => {
      if (key === 'image') {
        if (formData.image instanceof File) {
          dataToSend.append('image', formData.image);
        }
      } else if (key === 'conditions') {
        // Les tableaux doivent être stringifiés pour passer dans FormData
        dataToSend.append('conditions', JSON.stringify(formData.conditions));
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    onSubmit(dataToSend); // On envoie le FormData au lieu de l'objet JSON
    onClose();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Logique Drag & Drop (Image)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file, imagePreview: URL.createObjectURL(file) });
    }
  };

  const addCondition = () => {
    if (conditionInput.trim()) {
      setFormData({ ...formData, conditions: [...formData.conditions, conditionInput] });
      setConditionInput("");
    }
  };

  const removeCondition = (index) => {
    setFormData({ ...formData, conditions: formData.conditions.filter((_, i) => i !== index) });
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#0f172a]/70 backdrop-blur-md transition-all animate-fadeIn">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* HEADER */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {initialData ? "Modifier le programme" : "Créer une formation"}
            </h2>
            <p className="text-xs text-gray-500">Configurez les détails visibles par les étudiants.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <form id="formation-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. VISUEL & IDENTITÉ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* COLONNE GAUCHE : IMAGE (1/3) */}
                <div className="md:col-span-1 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Couverture</label>
                    <div 
                        className={`relative h-48 md:h-full min-h-[200px] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                            isDragging ? 'border-[#370669] bg-[#370669]/5' : 'border-gray-200 hover:border-[#370669] hover:bg-gray-50'
                        }`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                    >
                        <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                        
                        {formData.imagePreview || (initialData && typeof initialData.image === 'string') ? (
                            <>
                            <img src={formData.imagePreview || initialData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white"><ImageIcon className="w-5 h-5"/></div>
                            </div>
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                    <UploadCloud className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-bold text-slate-700">Image</p>
                            </div>
                        )}
                    </div>
                </div>
        
                {/* COLONNE DROITE : INFO PRINCIPALES (2/3) */}
                <div className="md:col-span-2 space-y-5">
                    <Input label="Titre du programme" name="title" value={formData.title} onChange={handleChange} placeholder="Ex: Master Data Science" fullWidth />
                    
                    <div className="grid grid-cols-2 gap-5">
                        <Select label="Catégorie" name="category" value={formData.category} onChange={handleChange} options={["Informatique", "Marketing", "Business", "Droit", "Santé", "Ingénierie"]} />
                        <Select label="Niveau" name="level" value={formData.level} onChange={handleChange} options={["Bachelor", "Licence", "Master", "MBA", "Doctorat", "Certificat"]} />
                    </div>
        
                    <div className="grid grid-cols-2 gap-5">
                        <Input label="Frais de scolarité (Ar)" name="price" value={formData.price} onChange={handleChange} icon={DollarSign} placeholder="Ex: 4 500 000" />
                        <Input label="Durée" name="duration" value={formData.duration} onChange={handleChange} icon={Clock} placeholder="Ex: 2 ans" />
                                                  {/* ✅ LE NOUVEAU CHAMP QUOTA */}
                                                  <Input 
                              label="Quota (Places)" 
                              name="quota" 
                              type="number"
                              value={formData.quota} 
                              onChange={handleChange} 
                              placeholder="Ex: 30" 
                              icon={Users} // Importez Users de lucide-react
                          />
                    </div>
                </div>
            </div>
        
            {/* 2. CALENDRIER & MODALITÉS (Bloc Grisé) */}
            <div className="pt-6">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                <h3 className="text-xs font-bold text-[#370669] uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Organisation & Planning
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input 
                        label="Rentrée scolaire" 
                        name="startDate" 
                        type="date" 
                        value={formData.startDate} 
                        onChange={handleChange} 
                    />
                    <Input 
                        label="Date limite dépôt dossier" 
                        name="endDate" 
                        type="date" 
                        value={formData.endDate} 
                        onChange={handleChange} 
                    />
                    <Select 
                        label="Format d'enseignement" 
                        name="mode" 
                        value={formData.mode} 
                        onChange={handleChange} 
                        options={["Présentiel", "En ligne", "Hybride"]} 
                    />
                </div>
        
                {/* CHAMPS TYPE D'ADMISSION (FIXE) */}
                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#370669]/10 text-[#370669] rounded-lg">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-bold uppercase">Procédure d'admission</p>
                            <p className="text-sm font-bold text-slate-900">Sélection de dossier uniquement</p>
                        </div>
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded-full">
                        Standard
                    </div>
                </div>
            </div>
            </div>
        
            {/* 3. DÉTAILS DU CONTENU */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Description du cursus</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        className="w-full p-4 rounded-xl border border-gray-200 focus:border-[#370669] focus:ring-1 focus:ring-[#370669]/20 outline-none text-sm min-h-[160px] resize-none bg-white transition-colors leading-relaxed" 
                        placeholder="Décrivez les objectifs, les compétences visées et les débouchés..."
                    ></textarea>
                </div>
        
                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Pré-requis (Conditions d'accès)</label>
                    <div className="flex gap-2 mb-3">
                        <input 
                            type="text" 
                            value={conditionInput} 
                            onChange={(e) => setConditionInput(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())} 
                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#370669]" 
                            placeholder="Ex: Baccalauréat série C ou D..." 
                        />
                        <button type="button" onClick={addCondition} className="bg-[#370669] text-white px-4 rounded-xl hover:bg-[#2b0554] transition-colors"><Plus className="w-5 h-5"/></button>
                    </div>
                    
                    <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1 custom-scrollbar">
                        {formData.conditions && formData.conditions.length > 0 ? (
                            formData.conditions.map((cond, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-50 border border-gray-100 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 group">
                                    <span className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-[#18B49C]"/> {cond}</span>
                                    <button type="button" onClick={() => removeCondition(i)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-6 text-gray-300 text-xs italic border-2 border-dashed border-gray-100 rounded-xl">Aucun pré-requis ajouté</div>
                        )}
                    </div>
                </div>
            </div>
        
        </form>
        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-200 transition-colors">Annuler</button>
            <button type="submit" form="formation-form" className="px-8 py-2.5 rounded-xl font-bold text-sm text-white bg-[#370669] hover:bg-[#2b0554] shadow-lg shadow-[#370669]/20 flex items-center gap-2">
                <Save className="w-4 h-4" /> {initialData ? "Mettre à jour" : "Publier"}
            </button>
        </div>
      </div>
    </div>
  );
}

// Helpers Input/Select (Inchangés)
const Input = ({ label, name, type = "text", value, onChange, placeholder, fullWidth, icon: Icon }) => (
  <div className={`space-y-1.5 ${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}>
      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{label}</label>
      <div className="relative">
          <input 
              type={type} 
              name={name} 
              value={value} 
              onChange={onChange} 
              placeholder={placeholder} 
              className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#370669] focus:ring-1 focus:ring-[#370669]/20 outline-none text-sm text-slate-800 transition-all placeholder:text-gray-300 bg-white ${type === 'date' ? 'uppercase font-medium text-gray-600' : ''}`} 
          />
          {/* Si c'est une date, l'icône native du navigateur s'affiche à droite, donc on ne met pas d'icône custom pour éviter la superposition, sauf si type text */}
          {Icon && type !== 'date' && <Icon className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />}
      </div>
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">{label}</label>
      <div className="relative">
          <select name={name} value={value} onChange={onChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#370669] focus:ring-1 focus:ring-[#370669]/20 outline-none text-sm text-slate-800 appearance-none bg-white cursor-pointer truncate pr-8">
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          {/* Petite flèche custom */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1L5 5L9 1"/></svg>
          </div>
      </div>
  </div>
);