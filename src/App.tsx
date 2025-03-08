import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Cookie, ChefHat, Calendar, BookOpen } from 'lucide-react';
import { MealEntry } from './components/MealEntry';
import { NutritionalInfo } from './components/NutritionalInfo';
import { ShoppingList } from './components/ShoppingList';
import { RecipeSuggestions } from './components/RecipeSuggestions';
import { DietPlanView } from './components/DietPlan';
import { DailyOverview } from './components/DailyOverview';
import { RecipeManagement } from './components/RecipeManagement';
import { BlogAdmin } from './components/BlogAdmin';
import { BlogPost } from './components/BlogPost';
import { Meal, DietPlan, BlogPost as BlogPostType } from './types';
import { getLatestPost } from './services/blogService';

function App() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [activePlan, setActivePlan] = useState<DietPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'diary' | 'shopping' | 'recipes' | 'plan' | 'myrecipes' | 'blog' | 'blog-admin'>('home');
  const [username, setUsername] = useState('Utente');
  const [latestPost, setLatestPost] = useState<BlogPostType | null>(null);
  const [isAdmin] = useState(true); // In una versione reale, questo verrebbe gestito dall'autenticazione

  useEffect(() => {
    loadLatestPost();
  }, []);

  const loadLatestPost = async () => {
    const post = await getLatestPost();
    setLatestPost(post);
  };

  const addMeal = (meal: Meal) => {
    setMeals([...meals, meal]);
  };

  const handlePlanCreated = (plan: DietPlan) => {
    setActivePlan(plan);
    setActiveTab('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Diario Alimentare</h1>
          <p className="mt-2 opacity-90">Il tuo assistente personale per una dieta equilibrata</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'home'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Cookie className="inline-block w-5 h-5 mr-2" />
              Home
            </button>
            <button
              onClick={() => setActiveTab('diary')}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'diary'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Calendar className="inline-block w-5 h-5 mr-2" />
              Diario
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'plan'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Cookie className="inline-block w-5 h-5 mr-2" />
              Piano Dietetico
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'shopping'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ShoppingCart className="inline-block w-5 h-5 mr-2" />
              Lista Spesa
            </button>
            <button
              onClick={() => setActiveTab('recipes')}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'recipes'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <ChefHat className="inline-block w-5 h-5 mr-2" />
              Ricette
            </button>
            <button
              onClick={() => setActiveTab('myrecipes')}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'myrecipes'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <Plus className="inline-block w-5 h-5 mr-2" />
              Le Mie Ricette
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                activeTab === 'blog'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-green-600'
              }`}
            >
              <BookOpen className="inline-block w-5 h-5 mr-2" />
              Blog
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('blog-admin')}
                className={`px-4 py-3 font-medium transition whitespace-nowrap ${
                  activeTab === 'blog-admin'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-green-600'
                }`}
              >
                <BookOpen className="inline-block w-5 h-5 mr-2" />
                Gestione Blog
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-6">
            <DailyOverview 
              activePlan={activePlan}
              meals={meals} 
              onAddMeal={addMeal}
              onViewRecipes={() => setActiveTab('recipes')}
              onCreatePlan={() => setActiveTab('plan')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NutritionalInfo meals={meals} />
              <RecipeSuggestions meals={meals} compact />
            </div>
            {latestPost && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Dal Blog</h2>
                <BlogPost post={latestPost} isPreview />
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'diary' && (
          <div className="space-y-6">
            <MealEntry onAddMeal={addMeal} />
            <NutritionalInfo meals={meals} />
          </div>
        )}
        
        {activeTab === 'plan' && <DietPlanView onPlanCreated={handlePlanCreated} />}
        
        {activeTab === 'shopping' && <ShoppingList meals={meals} />}
        
        {activeTab === 'recipes' && <RecipeSuggestions meals={meals} />}
        
        {activeTab === 'myrecipes' && <RecipeManagement username={username} />}

        {activeTab === 'blog' && latestPost && <BlogPost post={latestPost} />}

        {activeTab === 'blog-admin' && isAdmin && <BlogAdmin />}
      </main>
    </div>
  );
}

export default App;