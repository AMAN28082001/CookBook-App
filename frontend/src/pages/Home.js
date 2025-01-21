// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import {
  dummyGetRecipes,
  dummyAddToFavorites
  // We removed dummyRemoveFromFavorites, dummyDeleteRecipe, etc.
} from '../services/dummyData';

function Home({ userId }) {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Token needed for favorites
  const token = localStorage.getItem('token');

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line
  }, []);

  const handleSearch = () => {
    const data = dummyGetRecipes(search);
    setRecipes(data);
  };

  const handleViewDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const handleFavorite = (recipeId) => {
    if (!token) {
      alert('Please log in first');
      return;
    }
    try {
      dummyAddToFavorites(userId, recipeId);
      alert('Favorited!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Home</h2>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-64"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border rounded shadow p-3 flex flex-col"
          >
            <img
              src={recipe.thumbnail}
              alt={recipe.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h4 className="text-lg font-medium">{recipe.name}</h4>
            <p className="text-sm text-gray-500 mb-2">
              By: {recipe.postedBy} <br />
              Posted At: {new Date(recipe.postedAt).toLocaleDateString()}
            </p>

            <div className="mt-auto pt-2 flex flex-col space-y-2">
              <button
                onClick={() => handleViewDetails(recipe)}
                className="text-blue-600 hover:underline text-sm text-left"
              >
                View Details
              </button>
              <button
                onClick={() => handleFavorite(recipe.id)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-400 text-xs"
              >
                Favorite
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for selected recipe details */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-md max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-3">{selectedRecipe.name}</h2>
            <img
              src={selectedRecipe.thumbnail}
              alt={selectedRecipe.name}
              className="w-full h-48 object-cover rounded mb-2"
            />
            {selectedRecipe.ingredients && (
              <p className="mb-2">
                <strong>Ingredients:</strong> {selectedRecipe.ingredients}
              </p>
            )}
            {selectedRecipe.instructions && (
              <div
                className="text-sm text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
              />
            )}
            <div className="text-right">
              <button
                onClick={handleCloseModal}
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
