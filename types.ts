export interface NutrientProfile {
  protein: number;
  lipids: number;
  fiber: number;
  ash: number;
  moisture: number;
  carbohydrates: number;
}

export interface Ingredient {
  id: string;
  name: string;
  category: 'Animal Protein' | 'Plant Protein' | 'Oil' | 'Additive' | 'Cereal';
  nutrients: NutrientProfile; // percentages (0-100)
  costPerKg: number; // in USD
}

export interface SelectedIngredient extends Ingredient {
  weight: number; // percentage in the formula (0-100)
}

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  lifeStage: 'Larva' | 'Juvenile' | 'Adult' | 'Broodstock' | 'Grow-out';
  targetNutrients: NutrientProfile;
  description: string;
}

export interface Formulation {
  id: string;
  name: string;
  speciesId: string;
  ingredients: SelectedIngredient[];
  totalCost: number;
  notes: string;
  lastModified: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  FORMULATOR = 'FORMULATOR',
  ENCYCLOPEDIA = 'ENCYCLOPEDIA',
  SETTINGS = 'SETTINGS'
}