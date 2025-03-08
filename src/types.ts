export type MealType = 'colazione' | 'pranzo' | 'cena' | 'spuntino';

export interface Meal {
  id: number;
  type: MealType;
  ingredients: string[];
  date: string;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  meals: PlannedMeal[];
}

export interface PlannedMeal {
  type: MealType;
  dayOfWeek: number; // 0-6, dove 0 è Domenica
  ingredients: string[];
  portions: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  calories: number;
  cookingTime: string;
  image: string;
  url: string;
  author?: string;
  approved?: boolean;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface SponsoredProduct {
  name: string;
  description: string;
  price: string;
  image: string;
  url: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  excerpt: string;
  recipeId?: string;
  sponsoredProducts?: SponsoredProduct[];
}