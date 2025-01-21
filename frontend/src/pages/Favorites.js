import React, { useEffect, useState } from 'react';
import {
  dummyGetFavorites,
  dummyRemoveFromFavorites
} from '../services/dummyData';

function Favorites() {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null); // for modal

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && userId) {
      fetchFavorites();
    }
    // eslint-disable-next-line
  }, [token, userId]);

  const fetchFavorites = () => {
    const data = dummyGetFavorites(userId);
    setFavoriteRecipes(data);
  };

  const handleRemove = (recipeId) => {
    try {
      dummyRemoveFromFavorites(userId, recipeId);
      fetchFavorites();
    } catch (err) {
      alert(err.message);
    }
  };

  // Open modal to view recipe details
  const handleViewDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  if (!token) {
    return <div className="p-4">Please log in to view favorites.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
      {favoriteRecipes.length === 0 ? (
        <p>No favorite recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favoriteRecipes.map((recipe) => (
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
              <p className="text-sm text-gray-500">
                Posted By: {recipe.postedBy} <br />
                Posted At:{' '}
                {new Date(recipe.postedAt).toLocaleDateString()}
              </p>
              <div className="mt-auto pt-2 flex flex-col space-y-2">
                <button
                  onClick={() => handleViewDetails(recipe)}
                  className="text-blue-600 hover:underline text-sm text-left"
                >
                  View Details
                </button>
                <button
                  onClick={() => handleRemove(recipe.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL for viewing details */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded shadow-md max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-3">
              {selectedRecipe.name}
            </h2>
            <img
              src={selectedRecipe.thumbnail}
              alt={selectedRecipe.name}
              className="w-full h-48 object-cover rounded mb-2"
            />
            {selectedRecipe.ingredients && (
              <p className="mb-2">
                <strong>Ingredients:</strong>{' '}
                {selectedRecipe.ingredients}
              </p>
            )}
            {selectedRecipe.instructions && (
              <div
                className="text-sm text-gray-700 mb-4"
                dangerouslySetInnerHTML={{
                  __html: selectedRecipe.instructions
                }}
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

export default Favorites;
