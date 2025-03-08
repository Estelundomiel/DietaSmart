import React, { useState } from 'react';
import { Cookie, Edit2, Check, X } from 'lucide-react';
import { Meal, NutritionGoals } from '../types';

interface NutritionalInfoProps {
  meals: Meal[];
}

export function NutritionalInfo({ meals }: NutritionalInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [goals, setGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 75,
    carbs: 250,
    fat: 65
  });
  const [tempGoals, setTempGoals] = useState<NutritionGoals>(goals);

  // In una versione reale, questi valori sarebbero calcolati da un database di valori nutrizionali
  const calculateNutrition = () => ({
    calories: 1500,
    protein: 45,
    carbs: 180,
    fat: 40
  });

  const current = calculateNutrition();

  const handleSave = () => {
    setGoals(tempGoals);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempGoals(goals);
    setIsEditing(false);
  };

  const calculatePercentage = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Cookie className="w-6 h-6 mr-2 text-green-600" />
          Valori Nutrizionali Giornalieri
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-600 hover:text-green-600 transition"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-700 transition"
            >
              <Check className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-600 hover:text-red-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Calorie</h3>
          {isEditing ? (
            <input
              type="number"
              value={tempGoals.calories}
              onChange={(e) => setTempGoals({...tempGoals, calories: Number(e.target.value)})}
              className="w-full mt-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          ) : (
            <>
              <p className="text-2xl font-bold text-green-600">
                {current.calories} / {goals.calories} kcal
              </p>
              <div className="mt-2 h-2 bg-green-200 rounded-full">
                <div
                  className="h-full bg-green-600 rounded-full transition-all duration-300"
                  style={{ width: `${calculatePercentage(current.calories, goals.calories)}%` }}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Proteine</h3>
          {isEditing ? (
            <input
              type="number"
              value={tempGoals.protein}
              onChange={(e) => setTempGoals({...tempGoals, protein: Number(e.target.value)})}
              className="w-full mt-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <>
              <p className="text-2xl font-bold text-blue-600">
                {current.protein} / {goals.protein}g
              </p>
              <div className="mt-2 h-2 bg-blue-200 rounded-full">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${calculatePercentage(current.protein, goals.protein)}%` }}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Carboidrati</h3>
          {isEditing ? (
            <input
              type="number"
              value={tempGoals.carbs}
              onChange={(e) => setTempGoals({...tempGoals, carbs: Number(e.target.value)})}
              className="w-full mt-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          ) : (
            <>
              <p className="text-2xl font-bold text-yellow-600">
                {current.carbs} / {goals.carbs}g
              </p>
              <div className="mt-2 h-2 bg-yellow-200 rounded-full">
                <div
                  className="h-full bg-yellow-600 rounded-full transition-all duration-300"
                  style={{ width: `${calculatePercentage(current.carbs, goals.carbs)}%` }}
                />
              </div>
            </>
          )}
        </div>
        
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Grassi</h3>
          {isEditing ? (
            <input
              type="number"
              value={tempGoals.fat}
              onChange={(e) => setTempGoals({...tempGoals, fat: Number(e.target.value)})}
              className="w-full mt-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          ) : (
            <>
              <p className="text-2xl font-bold text-red-600">
                {current.fat} / {goals.fat}g
              </p>
              <div className="mt-2 h-2 bg-red-200 rounded-full">
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${calculatePercentage(current.fat, goals.fat)}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}