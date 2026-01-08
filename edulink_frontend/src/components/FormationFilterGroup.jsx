import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp, X, Check, Minus } from "lucide-react";

export const FilterGroup = ({ title, options, selectedValues, onChange, type }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [localSearch, setLocalSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const LIMIT = 2;

  // Filtrage interne (barre de recherche dans le filtre)
  const searchFilteredOptions = options.filter(opt => 
    opt.value.toLowerCase().includes(localSearch.toLowerCase())
  );

  // Tri : Sélectionnés d'abord, puis par nombre décroissant
  const sortedOptions = [...searchFilteredOptions].sort((a, b) => {
    const aSelected = selectedValues.includes(a.value);
    const bSelected = selectedValues.includes(b.value);
    if (aSelected && !bSelected) return -1;
    if (!aSelected && bSelected) return 1;
    return b.count - a.count;
  });

  // Pagination "Voir plus"
  const visibleOptions = (showAll || localSearch.length > 0) 
    ? sortedOptions 
    : sortedOptions.slice(0, LIMIT);

  if (options.length === 0) return null;

  return (
    <div className="border-b border-gray-100 last:border-0 py-5">
      {/* Header Accordéon */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center group select-none"
      >
        <h4 className="font-bold text-[#370669] text-sm group-hover:text-[#683cc7] transition-colors">
          {title}
        </h4>
        {isOpen ? (
          <Minus className="w-4 h-4 text-gray-400 group-hover:text-[#683cc7]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#683cc7]" />
        )}
      </button>

      {/* Contenu Accordéon */}
      {isOpen && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
          
          {/* Recherche interne */}
          {options.length > 5 && (
            <div className="relative mb-3">
              <input
                type="text"
                placeholder={`Filtrer...`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-xs rounded px-2 py-1.5 pl-7 focus:border-[#683cc7] focus:outline-none transition-colors"
              />
              <Search className="w-3 h-3 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
              {localSearch && (
                <button 
                  onClick={() => setLocalSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Liste des options */}
          <div className="space-y-1">
            {visibleOptions.length > 0 ? (
              visibleOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                const isDisabled = opt.count === 0 && !isSelected;

                return (
                  <label 
                    key={opt.value} 
                    className={`flex items-center justify-between py-1.5 px-2 rounded-md transition-colors cursor-pointer group/item
                      ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-purple-50'}
                      ${isSelected ? 'bg-purple-50' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                        isSelected 
                          ? "bg-[#683cc7] border-[#683cc7]" 
                          : "border-gray-300 bg-white group-hover/item:border-[#683cc7]"
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={isSelected}
                        onChange={() => !isDisabled && onChange(type, opt.value)}
                        disabled={isDisabled}
                      />
                      <span className={`text-sm truncate ${isSelected ? "font-medium text-[#370669]" : "text-gray-600"}`}>
                        {opt.value}
                      </span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${
                      isSelected ? "bg-[#683cc7] text-white" : "bg-gray-100 text-gray-500"
                    }`}>
                      {opt.count}
                    </span>
                  </label>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-2">Aucun résultat.</p>
            )}
          </div>

          {/* Toggle Voir Plus/Moins */}
          {searchFilteredOptions.length > LIMIT && localSearch === "" && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-semibold text-[#683cc7] mt-2 px-2 flex items-center hover:underline"
            >
              {showAll ? <>Voir moins <ChevronUp className="w-3 h-3 ml-1" /></> : <>Voir plus <ChevronDown className="w-3 h-3 ml-1" /></>}
            </button>
          )}
        </div>
      )}
    </div>
  );
};