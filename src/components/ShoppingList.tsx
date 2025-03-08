import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Meal } from '../types';

interface ShoppingListProps {
  meals: Meal[];
}

export function ShoppingList({ meals }: ShoppingListProps) {
  const generateShoppingList = () => {
    const ingredients = meals.flatMap(meal => meal.ingredients);
    const uniqueIngredients = Array.from(new Set(ingredients));
    return uniqueIngredients.sort();
  };

  const shoppingList = generateShoppingList();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <ShoppingCart className="w-6 h-6 mr-2 text-green-600" />
        Lista della Spesa
      </h2>

      {shoppingList.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          Aggiungi dei pasti per generare la lista della spesa
        </p>
      ) : (
        <ul className="space-y-2">
          {shoppingList.map((item, index) => (
            <li
              key={index}
              className="flex items-center p-2 hover:bg-gray-50 rounded-md"
            >
              <input
                type="checkbox"
                className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
              />
              <span className="ml-3 text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}