import React, { useState } from 'react';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { Recipe } from '../types';
import { addRecipe } from '../services/recipeService';

interface RecipeFormProps {
  onCancel: () => void;
  onSuccess: (recipe: Recipe) => void;
  username: string;
}

export function RecipeForm({ onCancel, onSuccess, username }: RecipeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [instructions, setInstructions] = useState<string[]>(['']);
  const [calories, setCalories] = useState<number>(0);
  const [cookingTime, setCookingTime] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = [...ingredients];
      newIngredients.splice(index, 1);
      setIngredients(newIngredients);
    }
  };

  const addInstruction = () => {
    setInstructions([...instructions, '']);
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      const newInstructions = [...instructions];
      newInstructions.splice(index, 1);
      setInstructions(newInstructions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validazione
    if (!title.trim()) {
      setError('Il titolo è obbligatorio');
      setIsSubmitting(false);
      return;
    }

    if (!description.trim()) {
      setError('La descrizione è obbligatoria');
      setIsSubmitting(false);
      return;
    }

    const filteredIngredients = ingredients.filter(ing => ing.trim());
    if (filteredIngredients.length === 0) {
      setError('Aggiungi almeno un ingrediente');
      setIsSubmitting(false);
      return;
    }

    const filteredInstructions = instructions.filter(inst => inst.trim());
    if (filteredInstructions.length === 0) {
      setError('Aggiungi almeno un\'istruzione');
      setIsSubmitting(false);
      return;
    }

    // Prepara l'oggetto ricetta
    const newRecipe = {
      title: title.trim(),
      description: description.trim(),
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      calories: calories || 0,
      cookingTime: cookingTime.trim() || 'N/A',
      image: image.trim() || `https://source.unsplash.com/featured/?${encodeURIComponent(title.trim())}`,
      url: '#',
      author: username,
      approved: false
    };

    try {
      const result = await addRecipe(newRecipe);
      
      if (result.success && result.recipe) {
        onSuccess(result.recipe);
      } else {
        setError(result.error || 'Si è verificato un errore durante il salvataggio della ricetta');
      }
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore durante il salvataggio della ricetta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Aggiungi una Nuova Ricetta</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titolo*
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Immagine URL (opzionale)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Se non specificata, verrà generata automaticamente
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrizione*
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            rows={2}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calorie (kcal)
            </label>
            <input
              type="number"
              value={calories || ''}
              onChange={(e) => setCalories(parseInt(e.target.value) || 0)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tempo di Preparazione
            </label>
            <input
              type="text"
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              placeholder="Es: 30 min"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Ingredienti*
            </label>
            <button
              type="button"
              onClick={addIngredient}
              className="text-green-600 hover:text-green-700 flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Aggiungi
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  placeholder={`Ingrediente ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  disabled={ingredients.length === 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Istruzioni*
            </label>
            <button
              type="button"
              onClick={addInstruction}
              className="text-green-600 hover:text-green-700 flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Aggiungi
            </button>
          </div>
          <div className="space-y-2">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-center">
                <textarea
                  value={instruction}
                  onChange={(e) => updateInstruction(index, e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  rows={2}
                  placeholder={`Passo ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  disabled={instructions.length === 1}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            disabled={isSubmitting}
          >
            Annulla
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              'Salvataggio...'
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Salva Ricetta
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}