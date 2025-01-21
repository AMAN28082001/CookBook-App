import React, { useState } from 'react';
import { dummyCreateRecipe } from '../services/dummyData';

function RecipeCreator() {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [ingredients, setIngredients] = useState('');

  const userId = localStorage.getItem('userId');

  const handleCreate = () => {
    if (!userId) {
      alert('You must log in to create a recipe.');
      return;
    }
    if (!name.trim()) {
      alert('Recipe name is required.');
      return;
    }
    dummyCreateRecipe({
      name,
      instructions,
      thumbnail,
      ingredients,
      userId,
    });
    alert('Recipe created (dummy)!');
    setName('');
    setInstructions('');
    setThumbnail('');
    setIngredients('');
  };

  return (
    <div className="px-4 py-8">
      {/* Center the form with a max width for desktop */}
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Recipe</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Instructions Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Instructions (HTML allowed):
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </div>

        {/* Thumbnail URL Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail URL:
          </label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
          />
        </div>

        {/* Ingredients Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients (comma separated):
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 h-20 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleCreate}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-500 font-medium"
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default RecipeCreator;
