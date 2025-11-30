import React from 'react';
import { Species } from '../types';
import { MOCK_SPECIES } from '../constants';
import { Fish, ArrowRight } from 'lucide-react';

interface Props {
  onSelect: (species: Species) => void;
}

const SpeciesSelector: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">Select Species</h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">
          Begin your formulation by selecting a target species. Our database includes verified nutritional profiles derived from the latest aquaculture research.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_SPECIES.map((species) => (
          <div 
            key={species.id}
            onClick={() => onSelect(species)}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Fish className="w-8 h-8 text-blue-500 group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    {species.lifeStage}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-1">{species.name}</h3>
              <p className="text-sm italic text-gray-400 mb-4">{species.scientificName}</p>
              
              <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                {species.description}
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-lg">
                  <div>Protein Target: <span className="font-semibold text-gray-700">{species.targetNutrients.protein}%</span></div>
                  <div>Lipids Target: <span className="font-semibold text-gray-700">{species.targetNutrients.lipids}%</span></div>
              </div>

              <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
                Create Formula <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpeciesSelector;
