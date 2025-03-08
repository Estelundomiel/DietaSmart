import React, { useState } from 'react';
import { ChefHat, Search, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { Meal } from '../types';
import { searchRecipes, Recipe } from '../services/recipeService';

interface RecipeSuggestionsProps {
  meals: Meal[];
  compact?: boolean;
}

export function RecipeSuggestions({ meals, compact = false }: RecipeSuggestionsProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'ingredients' | 'custom'>('ingredients');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = searchQuery;
      if (searchType === 'ingredients') {
        // Usa gli ingredienti dei pasti come query di ricerca
        const ingredients = meals
          .flatMap(meal => meal.ingredients)
          .filter(ing => ing && ing.trim().length > 0)
          .slice(0, 5); // Limita a 5 ingredienti per una ricerca più mirata
        
        if (ingredients.length === 0) {
          setError("Non ci sono ingredienti disponibili. Aggiungi dei pasti o usa la ricerca libera.");
          setLoading(false);
          return;
        }
        
        query = `Ricette con: ${ingredients.join(', ')}`;
      }
      
      const results = await searchRecipes(query);
      setRecipes(results);
    } catch (error: any) {
      console.error('Errore nella ricerca delle ricette:', error);
      
      // Gestione specifica dell'errore di quota insufficiente
      if (error?.error?.code === 'insufficient_quota') {
        setError("La chiave API OpenAI ha raggiunto il limite di utilizzo. Verranno mostrate ricette di esempio.");
      } else {
        setError("Si è verificato un errore durante la ricerca delle ricette. Verranno mostrate ricette di esempio.");
      }
      
      // Prova a caricare comunque alcune ricette di esempio
      try {
        const results = await searchRecipes("ricette base");
        setRecipes(results);
      } catch (e) {
        // Se anche questo fallisce, non fare nulla
      }
    } finally {
      setLoading(false);
    }
  };

  const displayedRecipes = compact ? recipes.slice(0, 2) : recipes;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <ChefHat className="w-6 h-6 mr-2 text-green-600" />
        Ricette Suggerite
      </h2>

      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setSearchType('ingredients')}
            className={`px-4 py-2 rounded-md transition ${
              searchType === 'ingredients'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Usa Ingredienti
          </button>
          <button
            onClick={() => setSearchType('custom')}
            className={`px-4 py-2 rounded-md transition ${
              searchType === 'custom'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ricerca Libera
          </button>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchType === 'custom'
                ? 'Cerca una ricetta...'
                : 'Usa gli ingredienti dei tuoi pasti'
            }
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            disabled={searchType === 'ingredients'}
          />
          <button
            onClick={handleSearch}
            disabled={loading || (searchType === 'custom' && !searchQuery.trim())}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                Cerca
              </>
            )}
          </button>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {loading
              ? 'Ricerca in corso...'
              : 'Cerca ricette basate sui tuoi ingredienti o inserisci una ricerca personalizzata'}
          </p>
        </div>
      ) : (
        <>
          <div className={`grid ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
            {displayedRecipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-lg overflow-hidden shadow-md">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Calorie: {recipe.calories} kcal</p>
                    <p>Tempo: {recipe.cookingTime}</p>
                    <p className="line-clamp-2">{recipe.description}</p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button 
                      onClick={() => window.open(recipe.url, '_blank')}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Vedi Ricetta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {compact && recipes.length > 2 && (
            <div className="mt-4 text-center">
              <button className="text-green-600 hover:text-green-700 font-medium">
                Vedi tutte le ricette →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}