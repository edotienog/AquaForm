import { Species, Ingredient } from './types';

export const MOCK_SPECIES: Species[] = [
  {
    id: 's1',
    name: 'Atlantic Salmon',
    scientificName: 'Salmo salar',
    lifeStage: 'Juvenile',
    targetNutrients: { protein: 45, lipids: 20, fiber: 2, ash: 8, moisture: 10, carbohydrates: 15 },
    description: 'Requires high protein and moderate lipid levels for optimal growth in the juvenile stage.'
  },
  {
    id: 's2',
    name: 'Whiteleg Shrimp',
    scientificName: 'Litopenaeus vannamei',
    lifeStage: 'Adult',
    targetNutrients: { protein: 35, lipids: 8, fiber: 4, ash: 12, moisture: 10, carbohydrates: 31 },
    description: 'Omnivorous scavenger requiring balanced plant and animal proteins.'
  },
  {
    id: 's3',
    name: 'Nile Tilapia',
    scientificName: 'Oreochromis niloticus',
    lifeStage: 'Grow-out',
    targetNutrients: { protein: 30, lipids: 6, fiber: 6, ash: 10, moisture: 10, carbohydrates: 38 },
    description: 'Hardy freshwater species, tolerates higher carbohydrate levels.'
  },
  {
    id: 's4',
    name: 'Gilthead Seabream',
    scientificName: 'Sparus aurata',
    lifeStage: 'Adult',
    targetNutrients: { protein: 44, lipids: 16, fiber: 2.5, ash: 9, moisture: 9, carbohydrates: 19.5 },
    description: 'Carnivorous species requiring high quality fish meal or equivalent.'
  }
];

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: 'i1', name: 'Fish Meal (Anchovy)', category: 'Animal Protein', costPerKg: 1.50, nutrients: { protein: 65, lipids: 10, fiber: 0.5, ash: 16, moisture: 8, carbohydrates: 0.5 } },
  { id: 'i2', name: 'Soybean Meal', category: 'Plant Protein', costPerKg: 0.55, nutrients: { protein: 48, lipids: 2, fiber: 6, ash: 6, moisture: 11, carbohydrates: 27 } },
  { id: 'i3', name: 'Wheat Flour', category: 'Cereal', costPerKg: 0.35, nutrients: { protein: 12, lipids: 1.5, fiber: 2.5, ash: 1.5, moisture: 12, carbohydrates: 70.5 } },
  { id: 'i4', name: 'Fish Oil', category: 'Oil', costPerKg: 2.10, nutrients: { protein: 0, lipids: 99.5, fiber: 0, ash: 0, moisture: 0.5, carbohydrates: 0 } },
  { id: 'i5', name: 'Corn Gluten Meal', category: 'Plant Protein', costPerKg: 0.65, nutrients: { protein: 60, lipids: 2.5, fiber: 1.5, ash: 1.5, moisture: 10, carbohydrates: 24.5 } },
  { id: 'i6', name: 'Krill Meal', category: 'Animal Protein', costPerKg: 2.80, nutrients: { protein: 58, lipids: 22, fiber: 4, ash: 10, moisture: 6, carbohydrates: 0 } },
  { id: 'i7', name: 'Vitamin/Mineral Premix', category: 'Additive', costPerKg: 5.00, nutrients: { protein: 0, lipids: 0, fiber: 0, ash: 95, moisture: 5, carbohydrates: 0 } },
  { id: 'i8', name: 'Pea Protein Concentrate', category: 'Plant Protein', costPerKg: 0.90, nutrients: { protein: 55, lipids: 1.8, fiber: 3, ash: 4, moisture: 8, carbohydrates: 28.2 } },
];
