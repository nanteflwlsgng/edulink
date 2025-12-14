import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { FilterGroup } from "./FormationFilterGroup";

export const FormationsSidebar = ({ filters, counts, onFilterChange, onReset }) => {
  const hasActiveFilters = Object.values(filters).some(arr => arr.length > 0);

  return (
    // 1. On applique 'sticky' directement sur le conteneur <aside>
    // 2. On définit une hauteur calculée (h-[calc(100vh-XXX)]) pour qu'elle ne dépasse pas l'écran
    // 3. 'top-24' permet de laisser de la place pour votre Navbar si elle est aussi sticky ou fixe
    <aside className="w-full lg:w-1/4 min-w-[280px] flex-shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
      
      {/* Le conteneur interne prend toute la hauteur disponible (h-full) */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden flex flex-col h-full">
        
        {/* En-tête Sidebar (Reste toujours visible en haut du bloc) */}
        <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-[#370669]">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </div>
          {hasActiveFilters && (
            <button 
              onClick={onReset} 
              className="text-xs text-[#683cc7] hover:text-[#532e9e] font-semibold flex items-center gap-1 hover:underline transition-all"
            >
              <RotateCcw className="w-3 h-3" /> Réinitialiser
            </button>
          )}
        </div>

        {/* Corps Sidebar (C'est SEULEMENT cette partie qui scroll) */}
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
          
          <FilterGroup 
            title="Domaines d'étude" 
            type="category" 
            options={counts.category} 
            selectedValues={filters.category} 
            onChange={onFilterChange} 
          />
          
          <FilterGroup 
            title="Niveau" 
            type="level" 
            options={counts.level} 
            selectedValues={filters.level} 
            onChange={onFilterChange} 
          />
          
          <FilterGroup 
            title="Pays" 
            type="country" 
            options={counts.country} 
            selectedValues={filters.country} 
            onChange={onFilterChange} 
          />
          
          <FilterGroup 
            title="Villes" 
            type="city" 
            options={counts.city} 
            selectedValues={filters.city} 
            onChange={onFilterChange} 
          />
          
          <FilterGroup 
            title="Durée" 
            type="duration" 
            options={counts.duration} 
            selectedValues={filters.duration} 
            onChange={onFilterChange} 
          />
          
          <div className="h-8"></div>
        </div>
        
        {/* Footer Sidebar (Reste toujours visible en bas du bloc) */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 flex-shrink-0">
           EduLink Filters ©
        </div>
      </div>
    </aside>
  );
};