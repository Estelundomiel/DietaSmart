import React, { useState } from 'react';
import { Clock, Plus, Search, ChefHat, CalendarPlus, Check } from 'lucide-react';
import { Meal, MealType, DietPlan, PlannedMeal } from '../types';

interface DailyOverviewProps {
  activePlan: DietPlan | null;
  meals: Meal[];
  onAddMeal: (meal: Meal) => void;
  onViewRecipes: () => void;
  onCreatePlan: () => void;
}

export function DailyOverview({ activePlan, meals, onAddMeal, onViewRecipes, onCreatePlan }: DailyOverviewProps) {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddType, setQuickAddType] = useState<MealType>('colazione');
  const [quickAddIngredients, setQuickAddIngredients] = useState('');
  const [completedMeals, setCompletedMeals] = useState<Set<number>>(new Set());

  const getTodayPlannedMeals = (): PlannedMeal[] => {
    if (!activePlan) return [];
    const today = new Date();
    const dayOfWeek = today.getDay();
    return activePlan.meals.filter(meal => meal.dayOfWeek === dayOfWeek);
  };

  const getNextMeal = (): MealType => {
    const hour = new Date().getHours();
    if (hour < 11) return 'colazione';
    if (hour < 15) return 'pranzo';
    if (hour < 19) return 'spuntino';
    return 'cena';
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddIngredients.trim()) return;

    const newMeal: Meal = {
      id: Date.now(),
      type: quickAddType,
      ingredients: quickAddIngredients.split(',').map(i => i.trim()),
      date: new Date().toISOString(),
    };

    onAddMeal(newMeal);
    setQuickAddIngredients('');
    setShowQuickAdd(false);
  };

  const handleCompleteMeal = (index: number, meal: PlannedMeal) => {
    // Registra il pasto nel diario
    const completedMeal: Meal = {
      id: Date.now(),
      type: meal.type,
      ingredients: meal.ingredients,
      date: new Date().toISOString(),
    };

    onAddMeal(completedMeal);
    setCompletedMeals(prev => new Set([...prev, index]));
  };

  const todayPlannedMeals = getTodayPlannedMeals();
  const nextMeal = getNextMeal();

  if (!activePlan) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Benvenuto nel tuo Diario Alimentare</h2>
        <p className="text-gray-600 mb-6">
          Per iniziare, crea il tuo piano alimentare personalizzato o carica un piano esistente.
        </p>
        <button
          onClick={onCreatePlan}
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <CalendarPlus className="w-5 h-5 mr-2" />
          Crea Piano Alimentare
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center">
              <Clock className="w-6 h-6 mr-2 text-green-600" />
              Piano Alimentare di Oggi
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Dal piano: {activePlan.name}
            </p>
          </div>
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Registra Variazione
          </button>
        </div>

        {showQuickAdd && (
          <form onSubmit={handleQuickAdd} className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo di Pasto
                </label>
                <select
                  value={quickAddType}
                  onChange={(e) => setQuickAddType(e.target.value as MealType)}
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
                <input
                  type="text"
                  value={quickAddIngredients}
                  onChange={(e) => setQuickAddIngredients(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  placeholder="Es: pasta 100g, pomodoro 50g"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowQuickAdd(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Registra
              </button>
            </div>
          </form>
        )}

        <div className="space-y-6">
          {todayPlannedMeals.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600 mb-4">
                Nessun pasto pianificato per oggi
              </p>
              <p className="text-sm text-gray-500">
                Prossimo pasto consigliato: <span className="font-medium text-green-600">{nextMeal}</span>
              </p>
            </div>
          ) : (
            todayPlannedMeals.map((meal, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium text-lg capitalize">{meal.type}</h3>
                  <button
                    onClick={() => handleCompleteMeal(index, meal)}
                    disabled={completedMeals.has(index)}
                    className={`flex items-center px-3 py-1 rounded-md transition ${
                      completedMeals.has(index)
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {completedMeals.has(index) ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Registrato
                      </>
                    ) : (
                      'Registra nel Diario'
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Ingredienti:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {meal.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Porzioni:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      {meal.portions.map((portion, idx) => (
                        <li key={idx}>{portion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={onViewRecipes}
            className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition"
          >
            <ChefHat className="w-5 h-5 mr-2" />
            Trova Ricette Alternative
          </button>
          <button
            onClick={() => setShowQuickAdd(true)}
            className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition"
          >
            <Search className="w-5 h-5 mr-2" />
            Registra Variazione al Piano
          </button>
        </div>
      </div>
    </div>
  );
}