import React, { useState } from 'react';
import { Calendar, Plus, FileText, ChevronDown, ChevronUp, Trash2, Edit2, Save } from 'lucide-react';
import { DietPlan, PlannedMeal, MealType } from '../types';
import { PdfUploader } from './PdfUploader';
import { ManualPlanEntry } from './ManualPlanEntry';

const DAYS = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];

interface DietPlanViewProps {
  onPlanCreated: (plan: DietPlan) => void;
}

export function DietPlanView({ onPlanCreated }: DietPlanViewProps) {
  const [activePlan, setActivePlan] = useState<DietPlan | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  const toggleDay = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const getMealsForDay = (day: number): PlannedMeal[] => {
    return activePlan?.meals.filter(meal => meal.dayOfWeek === day) || [];
  };

  const renderMealType = (type: MealType) => {
    switch (type) {
      case 'colazione': return 'Colazione';
      case 'pranzo': return 'Pranzo';
      case 'cena': return 'Cena';
      case 'spuntino': return 'Spuntino';
    }
  };

  const handlePlanCreated = (plan: DietPlan) => {
    setActivePlan(plan);
    setIsManualEntry(false);
    onPlanCreated(plan);
  };

  return (
    <div className="space-y-6">
      {!activePlan && !isManualEntry ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-green-600" />
            Piano Dietetico
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setIsManualEntry(true)}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-green-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
            >
              <Edit2 className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-medium text-green-700">Inserimento Manuale</h3>
              <p className="text-sm text-gray-500 text-center mt-2">
                Crea il tuo piano dietetico inserendo manualmente i pasti e le porzioni
              </p>
            </button>

            <PdfUploader onPlanCreated={handlePlanCreated} />
          </div>
        </div>
      ) : isManualEntry ? (
        <ManualPlanEntry onPlanCreated={handlePlanCreated} onCancel={() => setIsManualEntry(false)} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-green-600" />
              Piano Dietetico
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setActivePlan(null);
                  onPlanCreated(null);
                }}
                className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition"
              >
                <Trash2 className="w-5 h-5 mr-1" />
                Elimina Piano
              </button>
              <button
                onClick={() => {
                  setIsManualEntry(true);
                  setActivePlan(null);
                }}
                className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-md transition"
              >
                <Edit2 className="w-5 h-5 mr-1" />
                Modifica
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-lg">{activePlan.name}</h3>
              <span className="text-sm text-gray-500">
                {new Date(activePlan.startDate).toLocaleDateString()} - {new Date(activePlan.endDate).toLocaleDateString()}
              </span>
            </div>

            {DAYS.map((day, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition"
                  onClick={() => toggleDay(index)}
                >
                  <span className="font-medium">{day}</span>
                  {expandedDay === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>

                {expandedDay === index && (
                  <div className="p-4 space-y-4">
                    {getMealsForDay(index).map((meal, mealIndex) => (
                      <div key={mealIndex} className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-medium text-green-700 mb-2">
                          {renderMealType(meal.type)}
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-1">Ingredienti</h5>
                            <ul className="text-sm space-y-1">
                              {meal.ingredients.map((ingredient, i) => (
                                <li key={i}>{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-gray-600 mb-1">Porzioni</h5>
                            <ul className="text-sm space-y-1">
                              {meal.portions.map((portion, i) => (
                                <li key={i}>{portion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}