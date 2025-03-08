import React, { useState, useEffect } from 'react';
import { PenSquare, Trash2, Plus, Save, ChefHat, ShoppingBag } from 'lucide-react';
import { BlogPost, SponsoredProduct } from '../types';
import { getAllPosts, createPost, updatePost, deletePost } from '../services/blogService';
import { addRecipe } from '../services/recipeService';

export function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({});
  const [error, setError] = useState<string | null>(null);
  const [includeRecipe, setIncludeRecipe] = useState(false);
  const [includeProducts, setIncludeProducts] = useState(false);
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    calories: 0,
    cookingTime: '',
    image: ''
  });
  const [products, setProducts] = useState<SponsoredProduct[]>([{
    name: '',
    description: '',
    price: '',
    image: '',
    url: ''
  }]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    const loadedPosts = await getAllPosts();
    setPosts(loadedPosts);
  };

  // Recipe handlers
  const handleAddIngredient = () => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    setRecipeData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const handleAddInstruction = () => {
    setRecipeData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const handleRemoveInstruction = (index: number) => {
    setRecipeData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    setRecipeData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  // Product handlers
  const handleAddProduct = () => {
    setProducts([...products, {
      name: '',
      description: '',
      price: '',
      image: '',
      url: ''
    }]);
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length > 1) {
      setProducts(products.filter((_, i) => i !== index));
    }
  };

  const handleProductChange = (index: number, field: keyof SponsoredProduct, value: string) => {
    setProducts(products.map((product, i) => 
      i === index ? { ...product, [field]: value } : product
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (!currentPost.title?.trim() || !currentPost.content?.trim()) {
        setError('Titolo e contenuto sono obbligatori');
        return;
      }

      const excerpt = currentPost.content
        .split('\n')[0]
        .slice(0, 150)
        .trim() + '...';

      // Se è inclusa una ricetta, salvala prima
      let recipeId = null;
      if (includeRecipe) {
        if (!recipeData.title || !recipeData.description || recipeData.ingredients.some(i => !i.trim())) {
          setError('Tutti i campi della ricetta sono obbligatori');
          return;
        }

        const recipeResult = await addRecipe({
          ...recipeData,
          author: 'Admin',
          approved: true
        });

        if (!recipeResult.success) {
          setError(recipeResult.error || 'Errore nel salvare la ricetta');
          return;
        }

        recipeId = recipeResult.recipe?.id;
      }

      // Valida i prodotti sponsorizzati
      let sponsoredProducts = null;
      if (includeProducts) {
        const validProducts = products.filter(p => 
          p.name.trim() && p.description.trim() && p.price.trim() && p.url.trim()
        );
        if (validProducts.length === 0) {
          setError('Inserisci almeno un prodotto valido con tutti i campi compilati');
          return;
        }
        sponsoredProducts = validProducts;
      }

      // Aggiorna o crea il post
      if (currentPost.id) {
        await updatePost(currentPost.id, { 
          ...currentPost, 
          excerpt,
          recipeId,
          sponsoredProducts 
        });
      } else {
        await createPost({
          title: currentPost.title,
          content: currentPost.content,
          image: currentPost.image,
          excerpt,
          recipeId,
          sponsoredProducts
        });
      }

      setIsEditing(false);
      setCurrentPost({});
      setIncludeRecipe(false);
      setIncludeProducts(false);
      setRecipeData({
        title: '',
        description: '',
        ingredients: [''],
        instructions: [''],
        calories: 0,
        cookingTime: '',
        image: ''
      });
      setProducts([{
        name: '',
        description: '',
        price: '',
        image: '',
        url: ''
      }]);
      loadPosts();
    } catch (err) {
      setError('Si è verificato un errore durante il salvataggio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo post?')) return;

    try {
      await deletePost(id);
      loadPosts();
    } catch (err) {
      setError('Si è verificato un errore durante l\'eliminazione');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Blog</h2>
        {!isEditing && (
          <button
            onClick={() => {
              setIsEditing(true);
              setCurrentPost({});
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuovo Post
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titolo
              </label>
              <input
                type="text"
                value={currentPost.title || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Immagine URL (opzionale)
              </label>
              <input
                type="url"
                value={currentPost.image || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, image: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenuto
              </label>
              <textarea
                value={currentPost.content || ''}
                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                rows={10}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
              />
            </div>
          </div>

          <div className="border-t pt-6 space-y-6">
            {/* Checkbox per ricetta */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeRecipe"
                checked={includeRecipe}
                onChange={(e) => setIncludeRecipe(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="includeRecipe" className="flex items-center text-sm font-medium text-gray-700">
                <ChefHat className="w-4 h-4 mr-1" />
                Includi una ricetta in questo post
              </label>
            </div>

            {/* Form ricetta */}
            {includeRecipe && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-lg">Dettagli Ricetta</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titolo Ricetta
                  </label>
                  <input
                    type="text"
                    value={recipeData.title}
                    onChange={(e) => setRecipeData({ ...recipeData, title: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrizione Ricetta
                  </label>
                  <textarea
                    value={recipeData.description}
                    onChange={(e) => setRecipeData({ ...recipeData, description: e.target.value })}
                    rows={2}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Calorie
                    </label>
                    <input
                      type="number"
                      value={recipeData.calories}
                      onChange={(e) => setRecipeData({ ...recipeData, calories: parseInt(e.target.value) || 0 })}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tempo di Preparazione
                    </label>
                    <input
                      type="text"
                      value={recipeData.cookingTime}
                      onChange={(e) => setRecipeData({ ...recipeData, cookingTime: e.target.value })}
                      placeholder="es: 30 minuti"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Immagine Ricetta URL
                  </label>
                  <input
                    type="url"
                    value={recipeData.image}
                    onChange={(e) => setRecipeData({ ...recipeData, image: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                    placeholder="https://example.com/recipe-image.jpg"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Ingredienti
                    </label>
                    <button
                      type="button"
                      onClick={handleAddIngredient}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      + Aggiungi ingrediente
                    </button>
                  </div>
                  {recipeData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder="es: 100g di farina"
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                      />
                      {recipeData.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Istruzioni
                    </label>
                    <button
                      type="button"
                      onClick={handleAddInstruction}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      + Aggiungi istruzione
                    </button>
                  </div>
                  {recipeData.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <textarea
                        value={instruction}
                        onChange={(e) => handleInstructionChange(index, e.target.value)}
                        placeholder={`Passo ${index + 1}`}
                        rows={2}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                      />
                      {recipeData.instructions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveInstruction(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Checkbox per prodotti sponsorizzati */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="includeProducts"
                checked={includeProducts}
                onChange={(e) => setIncludeProducts(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="includeProducts" className="flex items-center text-sm font-medium text-gray-700">
                <ShoppingBag className="w-4 h-4 mr-1" />
                Includi prodotti sponsorizzati
              </label>
            </div>

            {/* Form prodotti sponsorizzati */}
            {includeProducts && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-lg">Prodotti Sponsorizzati</h3>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="text-sm text-green-600 hover:text-green-700 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Aggiungi Prodotto
                  </button>
                </div>

                {products.map((product, index) => (
                  <div key={index} className="border-t pt-4 first:border-t-0 first:pt-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Prodotto {index + 1}</h4>
                      {products.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Prodotto
                        </label>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descrizione
                        </label>
                        <textarea
                          value={product.description}
                          onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prezzo
                          </label>
                          <input
                            type="text"
                            value={product.price}
                            onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                            placeholder="es: €29.99"
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL Acquisto
                          </label>
                          <input
                            type="url"
                            value={product.url}
                            onChange={(e) => handleProductChange(index, 'url', e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Immagine URL
                        </label>
                        <input
                          type="url"
                          value={product.image}
                          onChange={(e) => handleProductChange(index, 'image', e.target.value)}
                          placeholder="https://example.com/product-image.jpg"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring focus:ring-green-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setCurrentPost({});
                setIncludeRecipe(false);
                setIncludeProducts(false);
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <Save className="w-5 h-5 mr-2" />
              Salva
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setCurrentPost(post);
                      setIsEditing(true);
                      setIncludeRecipe(!!post.recipeId);
                      setIncludeProducts(!!post.sponsoredProducts?.length);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition"
                  >
                    <PenSquare className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
              <div className="mt-2 flex items-center space-x-4">
                {post.recipeId && (
                  <div className="flex items-center text-green-600">
                    <ChefHat className="w-4 h-4 mr-1" />
                    <span className="text-sm">Contiene una ricetta</span>
                  </div>
                )}
                {post.sponsoredProducts && post.sponsoredProducts.length > 0 && (
                  <div className="flex items-center text-blue-600">
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    <span className="text-sm">{post.sponsoredProducts.length} prodotti sponsorizzati</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}