import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Trash2, Wand2, Save, Info, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Ingredient, SelectedIngredient, Species, NutrientProfile } from '../types';
import { MOCK_INGREDIENTS } from '../constants';
import NutrientChart from './NutrientChart';
import { optimizeFormulaWithAI, getSpeciesInsights } from '../services/aiService';

interface Props {
  species: Species;
  onSave: (name: string, ingredients: SelectedIngredient[]) => void;
}

const FormulaEditor: React.FC<Props> = ({ species, onSave }) => {
  const [ingredients, setIngredients] = useState<SelectedIngredient[]>([]);
  const [availableIngredients] = useState<Ingredient[]>(MOCK_INGREDIENTS);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [speciesInsight, setSpeciesInsight] = useState<string>("");
  const [insightLoading, setInsightLoading] = useState(false);

  useEffect(() => {
    // Load default insight
    let mounted = true;
    const loadInsight = async () => {
      setInsightLoading(true);
      try {
        const text = await getSpeciesInsights(species.name);
        if (mounted) setSpeciesInsight(text);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setInsightLoading(false);
      }
    };
    if (process.env.API_KEY) {
        loadInsight();
    }
    return () => { mounted = false; };
  }, [species]);

  const currentNutrients = useMemo(() => {
    const total: NutrientProfile = { protein: 0, lipids: 0, fiber: 0, ash: 0, moisture: 0, carbohydrates: 0 };
    let totalWeight = 0;

    ingredients.forEach(ing => {
      totalWeight += ing.weight;
      total.protein += (ing.nutrients.protein * ing.weight) / 100;
      total.lipids += (ing.nutrients.lipids * ing.weight) / 100;
      total.fiber += (ing.nutrients.fiber * ing.weight) / 100;
      total.ash += (ing.nutrients.ash * ing.weight) / 100;
      total.moisture += (ing.nutrients.moisture * ing.weight) / 100;
      total.carbohydrates += (ing.nutrients.carbohydrates * ing.weight) / 100;
    });

    return total;
  }, [ingredients]);

  const totalWeight = ingredients.reduce((sum, ing) => sum + ing.weight, 0);
  const totalCost = ingredients.reduce((sum, ing) => sum + (ing.costPerKg * ing.weight) / 100, 0);

  const handleAddIngredient = (id: string) => {
    if (ingredients.find(i => i.id === id)) return;
    const original = availableIngredients.find(i => i.id === id);
    if (original) {
      setIngredients([...ingredients, { ...original, weight: 0 }]);
    }
  };

  const handleWeightChange = (id: string, weight: number) => {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, weight } : i));
  };

  const handleRemove = (id: string) => {
    setIngredients(prev => prev.filter(i => i.id !== id));
  };

  const handleAIOptimize = async () => {
    if (!process.env.API_KEY) {
        alert("Please set your API_KEY in the environment to use AI features.");
        return;
    }
    setIsOptimizing(true);
    setAiMessage(null);
    try {
      // Use all available ingredients for the AI to choose from, or just the current ones if the user has started
      const pool = ingredients.length > 0 ? ingredients : availableIngredients;
      
      const result = await optimizeFormulaWithAI(species, pool, currentNutrients);
      
      const newIngredients: SelectedIngredient[] = [];
      result.suggestedIngredients.forEach(sug => {
        const original = availableIngredients.find(i => i.id === sug.id);
        if (original) {
          newIngredients.push({ ...original, weight: sug.weight });
        }
      });
      
      setIngredients(newIngredients);
      setAiMessage(result.explanation);
    } catch (err) {
      console.error(err);
      setAiMessage("Failed to optimize. Please try again or check API configuration.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-6">
      {/* Left Panel: Ingredients & Controls */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        
        {/* Header Area */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    {species.name}
                    <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{species.lifeStage}</span>
                </h2>
                <p className="text-sm text-gray-500 mt-1">{species.scientificName}</p>
            </div>
            <div className="flex gap-2">
                 <button 
                    onClick={handleAIOptimize}
                    disabled={isOptimizing}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isOptimizing ? 'bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
                 >
                    {isOptimizing ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4" />}
                    {isOptimizing ? 'Optimizing...' : 'AI Optimize'}
                 </button>
                 <button 
                    onClick={() => onSave(`Formula for ${species.name}`, ingredients)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-md transition-all"
                 >
                    <Save className="w-4 h-4" /> Save
                 </button>
            </div>
        </div>

        {/* AI Insight Message */}
        {(aiMessage || (insightLoading || speciesInsight)) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-900 shadow-sm relative overflow-hidden">
               <div className="flex gap-3">
                   <div className="mt-0.5"><Info className="w-5 h-5 text-blue-600" /></div>
                   <div className="space-y-2">
                       {insightLoading && <p className="animate-pulse">Loading species insights...</p>}
                       {!insightLoading && speciesInsight && !aiMessage && (
                           <p><strong>Species Insight:</strong> {speciesInsight}</p>
                       )}
                       {aiMessage && (
                           <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                               <p className="font-semibold text-indigo-700 mb-1">Optimization Report:</p>
                               <p>{aiMessage}</p>
                           </div>
                       )}
                   </div>
               </div>
            </div>
        )}

        {/* Ingredient Mixer */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-700">Formula Mixer</h3>
                <div className="text-sm text-gray-500">
                    Total Weight: <span className={`${totalWeight > 100.1 || totalWeight < 99.9 ? 'text-red-500 font-bold' : 'text-emerald-600 font-bold'}`}>{totalWeight.toFixed(1)}%</span>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {ingredients.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <p className="mb-4">No ingredients added.</p>
                        <p className="text-sm">Select ingredients from the library below or click "AI Optimize" to generate a starting formula.</p>
                    </div>
                ) : (
                    ingredients.map((ing) => (
                        <div key={ing.id} className="group bg-white border border-gray-100 rounded-lg p-3 hover:border-blue-200 hover:shadow-md transition-all flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-gray-800">{ing.name}</span>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{ing.category}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="80" 
                                        step="0.1" 
                                        value={ing.weight}
                                        onChange={(e) => handleWeightChange(ing.id, parseFloat(e.target.value))}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                    />
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={ing.weight}
                                            onChange={(e) => handleWeightChange(ing.id, parseFloat(e.target.value))}
                                            className="w-16 text-right text-sm border border-gray-300 rounded px-1 py-0.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                        />
                                        <span className="absolute right-6 top-0.5 text-gray-400 text-xs hidden">%</span>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500 w-8 text-right">%</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleRemove(ing.id)}
                                className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Ingredient Bar */}
            <div className="p-3 border-t border-gray-100 bg-gray-50">
                <select 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => {
                        if (e.target.value) {
                            handleAddIngredient(e.target.value);
                            e.target.value = '';
                        }
                    }}
                >
                    <option value="">+ Add Ingredient to Mix...</option>
                    {availableIngredients.filter(ai => !ingredients.find(i => i.id === ai.id)).map(ing => (
                        <option key={ing.id} value={ing.id}>{ing.name} (${ing.costPerKg.toFixed(2)}/kg)</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* Right Panel: Analysis */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
          <NutrientChart target={species.targetNutrients} actual={currentNutrients} />
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
             <h3 className="font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Analysis</h3>
             
             <div className="space-y-3">
                 <MetricRow label="Protein" actual={currentNutrients.protein} target={species.targetNutrients.protein} />
                 <MetricRow label="Lipids" actual={currentNutrients.lipids} target={species.targetNutrients.lipids} />
                 <MetricRow label="Carbs" actual={currentNutrients.carbohydrates} target={species.targetNutrients.carbohydrates} />
             </div>

             <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Est. Cost</span>
                    <span className="font-bold text-gray-900 text-lg">${totalCost.toFixed(2)}<span className="text-xs font-normal text-gray-500">/kg</span></span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completeness</span>
                    <span className={`text-sm font-medium ${Math.abs(totalWeight - 100) < 0.5 ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {totalWeight.toFixed(1)}% / 100%
                    </span>
                </div>
             </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h4 className="text-blue-900 font-semibold text-sm mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4"/> Research Note
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                  {species.description}
              </p>
          </div>
      </div>
    </div>
  );
};

const MetricRow: React.FC<{ label: string; actual: number; target: number }> = ({ label, actual, target }) => {
    const diff = actual - target;
    const percentDiff = (diff / target) * 100;
    const isGood = Math.abs(percentDiff) < 5; // within 5% tolerance

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-medium text-gray-600">
                <span>{label}</span>
                <span className="text-gray-400">Target: {target}%</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${isGood ? 'bg-emerald-500' : (diff > 0 ? 'bg-amber-400' : 'bg-red-400')}`}
                        style={{ width: `${Math.min(actual, 100)}%` }} 
                    />
                </div>
                <span className={`text-xs w-12 text-right font-mono ${isGood ? 'text-emerald-600 font-bold' : 'text-gray-600'}`}>
                    {actual.toFixed(1)}%
                </span>
            </div>
        </div>
    );
}

export default FormulaEditor;
