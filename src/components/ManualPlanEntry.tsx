import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { DietPlan, MealType, PlannedMeal } from '../types';

interface ManualPlanEntryProps {
  onPlanCreated: (plan: DietPlan) => void;
  onCancel: () => void;
}

const DAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
const MEAL_TYPES: MealType[] = ['colazione', 'pranzo', 'cena', 'spuntino'];

interface DayMeals {
  [key: number]: PlannedMeal[];
}

export function ManualPlanEntry({ onPlanCreated, onCancel }: ManualPlanEntryProps) {
  const [planName, setPlanName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dayMeals, setDayMeals] = useState<DayMeals>({});

  const addMealToDay = (dayIndex: number) => {
    const newMeal: PlannedMeal = {
      type: 'colazione',
      dayOfWeek: dayIndex,
      ingredients: [''],
      portions: ['']
    };

    setDayMeals(prev => ({
      ...prev,
      [dayIndex]: [...(prev[dayIndex] || []), newMeal]
    }));
  };

  const updateMeal = (dayIndex: number, mealIndex: number, updates: Partial<PlannedMeal>) => {
    setDayMeals(prev => ({
      ...prev,
      [dayIndex]: prev[dayIndex].map((meal, i) =>
        i === mealIndex ? { ...meal, ...updates } : meal
      )
    }));
  };

  const removeMeal = (dayIndex: number, mealIndex: number) => {
    setDayMeals(prev => ({
      ...prev,
      [dayIndex]: prev[dayIndex].filter((_, i) => i !== mealIndex)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const meals = Object.entries(dayMeals).flatMap(([day, dayMeals]) =>
      dayMeals.map(meal => ({
        ...meal,
        dayOfWeek: parseInt(day)
      }))
    );

    const plan: DietPlan = {
      id: Date.now(),
      name: planName,
      startDate,
      endDate,
      meals
    };

    onPlanCreated(plan);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Crea Piano Dietetico</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome del Piano
            </label>
            <input
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inizio
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fine
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          {DAYS.map((day, dayIndex) => (
            <div key={dayIndex} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">{day}</h3>
                <button
                  type="button"
                  onClick={() => addMealToDay(dayIndex)}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Aggiungi Pasto
                </button>
              </div>

              <div className="space-y-4">
                {(dayMeals[dayIndex] || []).map((meal, mealIndex) => (
                  <div key={mealIndex} className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="flex justify-between items-start mb-3">
                      <select
                        value={meal.type}
                        onChange={(e) => updateMeal(dayIndex, mealIndex, { type: e.target.value as MealType })}
                        className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                      >
                        {MEAL_TYPES.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeMeal(dayIndex, mealIndex)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ingredienti
                        </label>
                        <textarea
                          value={meal.ingredients.join('\n')}
                          onChange={(e) => updateMeal(dayIndex, mealIndex, {
                            ingredients: e.target.value.split('\n').filter(i => i.trim())
                          })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                          rows={3}
                          placeholder="Un ingrediente per riga"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Porzioni
                        </label>
                        <textarea
                          value={meal.portions.join('\n')}
                          onChange={(e) => updateMeal(dayIndex, mealIndex, {
                            portions: e.target.value.split('\n').filter(p => p.trim())
                          })}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                          rows={3}
                          placeholder="Una porzione per riga"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
          >
            Annulla
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Save className="w-5 h-5 mr-2" />
            Salva Piano
          </button>
        </div>
      </form>
    </div>
  );
}