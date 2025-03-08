import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Meal, MealType } from '../types';

interface MealEntryProps {
  onAddMeal: (meal: Meal) => void;
}

export function MealEntry({ onAddMeal }: MealEntryProps) {
  const [mealType, setMealType] = useState<MealType>('colazione');
  const [ingredients, setIngredients] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingredients.trim()) return;

    const newMeal: Meal = {
      id: Date.now(),
      type: mealType,
      ingredients: ingredients.split(',').map(i => i.trim()),
      date: new Date().toISOString(),
    };

    onAddMeal(newMeal);
    setIngredients('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Aggiungi Pasto</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo di Pasto
          </label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value as MealType)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
          >
            <option value="colazione">Colazione</option>
            <option value="pranzo">Pranzo</option>
            <option value="cena">Cena</option>
            <option value="spuntino">Spuntino</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingredienti (separati da virgola)
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
            rows={3}
            placeholder="Es: pasta 100g, pomodoro 50g, olio 10g"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Aggiungi Pasto
        </button>
      </form>
    </div>
  );
}