import { Recipe } from '../types';

// Carica le ricette dal localStorage o usa quelle di default
const DEFAULT_RECIPES: Recipe[] = [
  {
    id: '1',
    title: 'Pasta al Pomodoro',
    description: 'Un classico piatto italiano semplice e gustoso',
    ingredients: ['Pasta 80g', 'Pomodori 200g', 'Basilico', 'Olio d\'oliva', 'Sale'],
    instructions: ['Cuocere la pasta', 'Preparare il sugo', 'Condire e servire'],
    calories: 350,
    cookingTime: '20 min',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800',
    url: '#',
    author: 'Sistema',
    approved: true
  },
  {
    id: '2',
    title: 'Insalata di Quinoa',
    description: 'Piatto leggero e nutriente, ricco di proteine vegetali',
    ingredients: ['Quinoa 100g', 'Pomodorini', 'Cetrioli', 'Avocado', 'Limone'],
    instructions: ['Cuocere la quinoa', 'Tagliare le verdure', 'Condire con limone e olio'],
    calories: 280,
    cookingTime: '25 min',
    image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800',
    url: '#',
    author: 'Sistema',
    approved: true
  },
  {
    id: '3',
    title: 'Frittata di Verdure',
    description: 'Ricca di proteine e verdure di stagione',
    ingredients: ['Uova 2', 'Zucchine', 'Peperoni', 'Cipolla', 'Formaggio'],
    instructions: ['Sbattere le uova', 'Aggiungere le verdure tagliate', 'Cuocere in padella'],
    calories: 320,
    cookingTime: '15 min',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800',
    url: '#',
    author: 'Sistema',
    approved: true
  }
];

// Gestione del localStorage
const STORAGE_KEY = 'app_recipes';

function loadRecipes(): Recipe[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_RECIPES;
  } catch {
    return DEFAULT_RECIPES;
  }
}

function saveRecipes(recipes: Recipe[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  } catch (error) {
    console.error('Errore nel salvataggio delle ricette:', error);
  }
}

// Inizializza le ricette
let recipes: Recipe[] = loadRecipes();

// Validazione ricetta
function validateRecipe(recipe: Partial<Recipe>): string | null {
  if (!recipe.title?.trim()) {
    return 'Il titolo è obbligatorio';
  }
  if (!recipe.description?.trim()) {
    return 'La descrizione è obbligatoria';
  }
  if (!recipe.ingredients?.length) {
    return 'Aggiungi almeno un ingrediente';
  }
  if (!recipe.instructions?.length) {
    return 'Aggiungi almeno un\'istruzione';
  }
  if (recipe.calories && recipe.calories < 0) {
    return 'Le calorie non possono essere negative';
  }
  return null;
}

// Funzione per generare un'immagine di fallback
function getRecipeImage(title: string): string {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800', // Cucina generica
    'https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800', // Ingredienti
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800'  // Tavola apparecchiata
  ];
  
  return `https://source.unsplash.com/featured/?${encodeURIComponent(title.split(' ')[0])},food` || 
         fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const lowerQuery = query.toLowerCase();
  return recipes
    .filter(recipe => 
      recipe.approved && (
        recipe.title.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(lowerQuery))
      )
    )
    .slice(0, 6);
}

export async function addRecipe(recipe: Omit<Recipe, 'id'>): Promise<{ success: boolean; error?: string; recipe?: Recipe }> {
  try {
    // Validazione
    const validationError = validateRecipe(recipe);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const newRecipe: Recipe = {
      ...recipe,
      id: crypto.randomUUID(),
      approved: false,
      url: '#',
      image: recipe.image || getRecipeImage(recipe.title)
    };

    recipes.push(newRecipe);
    saveRecipes(recipes);
    return { success: true, recipe: newRecipe };
  } catch (error: any) {
    return { success: false, error: error.message || 'Errore durante l\'aggiunta della ricetta' };
  }
}

export async function getUserRecipes(username: string): Promise<Recipe[]> {
  return recipes.filter(recipe => recipe.author === username);
}

export async function getRecipesToReview(): Promise<Recipe[]> {
  return recipes.filter(recipe => !recipe.approved);
}

export async function approveRecipe(recipeId: string): Promise<boolean> {
  const recipe = recipes.find(r => r.id === recipeId);
  if (recipe) {
    recipe.approved = true;
    saveRecipes(recipes);
    return true;
  }
  return false;
}

export async function deleteRecipe(recipeId: string): Promise<boolean> {
  const index = recipes.findIndex(r => r.id === recipeId);
  if (index !== -1) {
    recipes.splice(index, 1);
    saveRecipes(recipes);
    return true;
  }
  return false;
}