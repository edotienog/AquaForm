import { GoogleGenAI, Type } from "@google/genai";
import { Ingredient, Species, NutrientProfile } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");
  return new GoogleGenAI({ apiKey });
};

export const optimizeFormulaWithAI = async (
  species: Species,
  availableIngredients: Ingredient[],
  currentNutrients: NutrientProfile
): Promise<{ explanation: string; suggestedIngredients: { id: string; weight: number }[] }> => {
  const ai = getAiClient();
  
  const prompt = `
    I am formulating a feed for ${species.name} (${species.scientificName}, ${species.lifeStage}).
    
    My target nutrient profile is:
    ${JSON.stringify(species.targetNutrients)}

    My current nutrient profile (which might be off) is:
    ${JSON.stringify(currentNutrients)}

    I have the following ingredients available (with their ID and nutritional composition):
    ${JSON.stringify(availableIngredients.map(i => ({ id: i.id, name: i.name, nutrients: i.nutrients })))}

    Please optimize the formula to match the target nutrient profile as closely as possible while maintaining a realistic formulation (total weight must be exactly 100%).
    Prioritize fulfilling Protein and Lipid requirements first.
    Return a list of ingredients with their suggested inclusion rates (weights).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: {
            type: Type.STRING,
            description: "A brief professional explanation of why these ratios were chosen, citing specific nutritional needs of the species."
          },
          suggestedIngredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                weight: { type: Type.NUMBER, description: "Percentage of inclusion (0-100)" }
              }
            }
          }
        }
      }
    }
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text);
};

export const getSpeciesInsights = async (speciesName: string): Promise<string> => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide a concise, 1-paragraph academic summary of the nutritional requirements and feeding habits of ${speciesName} in aquaculture. Focus on protein/lipid ratios and key micronutrients.`
    });
    return response.text || "No insights available.";
}
