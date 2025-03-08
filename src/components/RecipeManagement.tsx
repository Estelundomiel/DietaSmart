import React, { useState, useEffect } from 'react';
import { ChefHat, Plus, Check, X, Trash2, Eye } from 'lucide-react';
import { Recipe } from '../types';
import { RecipeForm } from './RecipeForm';
import { getUserRecipes, getRecipesToReview, approveRecipe, deleteRecipe } from '../services/recipeService';

interface RecipeManagementProps {
  isAdmin?: boolean;
  username: string;
}

export function RecipeManagement({ isAdmin = false, username }: RecipeManagementProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let loadedRecipes: Recipe[];
      
      if (isAdmin) {
        loadedRecipes = await getRecipesToReview();
      } else {
        loadedRecipes = await getUserRecipes(username);
      }
      
      setRecipes(loadedRecipes);
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore durante il caricamento delle ricette');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [isAdmin, username]);

  const handleRecipeAdded = (recipe: Recipe) => {
    setShowForm(false);
    setSuccessMessage('Ricetta aggiunta con successo! Sarà visibile dopo l\'approvazione.');
    loadRecipes();
    
    // Nascondi il messaggio dopo 5 secondi
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const handleApprove = async (recipeId: string) => {
    try {
      const success = await approveRecipe(recipeId);
      if (success) {
        setSuccessMessage('Ricetta approvata con successo!');
        loadRecipes();
      } else {
        setError('Si è verificato un errore durante l\'approvazione della ricetta');
      }
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore durante l\'approvazione della ricetta');
    }
    
    // Nascondi il messaggio dopo 5 secondi
    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, 5000);
  };

  const handleDelete = async (recipeId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa ricetta?')) {
      return;
    }
    
    try {
      const success = await deleteRecipe(recipeId);
      if (success) {
        setSuccessMessage('Ricetta eliminata con successo!');
        loadRecipes();
      } else {
        setError('Si è verificato un errore durante l\'eliminazione della ricetta');
      }
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore durante l\'eliminazione della ricetta');
    }
    
    // Nascondi il messaggio dopo 5 secondi
    setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, 5000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <ChefHat className="w-6 h-6 mr-2 text-green-600" />
          {isAdmin ? 'Ricette da Approvare' : 'Le Mie Ricette'}
        </h2>
        {!isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Aggiungi Ricetta
          </button>
        )}
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {showForm ? (
        <RecipeForm 
          onCancel={() => setShowForm(false)} 
          onSuccess={handleRecipeAdded}
          username={username}
        />
      ) : (
        <>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Caricamento ricette in corso...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">
                {isAdmin 
                  ? 'Non ci sono ricette da approvare al momento.' 
                  : 'Non hai ancora aggiunto ricette. Clicca su "Aggiungi Ricetta" per iniziare.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="bg-white rounded-lg overflow-hidden shadow-md border">
                  <div className="h-48 bg-gray-200 relative">
                    {recipe.image ? (
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ChefHat className="w-12 h-12" />
                      </div>
                    )}
                    {!isAdmin && recipe.approved && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                        Approvata
                      </div>
                    )}
                    {!isAdmin && !recipe.approved && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        In attesa
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p className="line-clamp-2">{recipe.description}</p>
                      {recipe.calories > 0 && <p>Calorie: {recipe.calories} kcal</p>}
                      {recipe.cookingTime && <p>Tempo: {recipe.cookingTime}</p>}
                      {isAdmin && <p>Autore: {recipe.author}</p>}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {isAdmin ? (
                        <>
                          <button 
                            onClick={() => handleApprove(recipe.id)}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Approva
                          </button>
                          <button 
                            onClick={() => handleDelete(recipe.id)}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Rifiuta
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizza
                          </button>
                          <button 
                            onClick={() => handleDelete(recipe.id)}
                            className="flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}