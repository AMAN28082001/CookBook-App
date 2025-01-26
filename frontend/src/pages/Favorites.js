import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

function Favorites({ onToggleFavorite }) {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [notification, setNotification] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchFavorites();
    }
  }, [token]);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:5000/recipes/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFavoriteRecipes(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setNotification('Session expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/login';
      } else {
        showNotification('Error fetching favorites.');
      }
    }
  };

  const handleToggleFavorite = async (recipeId, isFavorite) => {
    try {
      const url = `http://localhost:5000/recipes/${recipeId}/favorite`;

      // If it's currently favorite, we'll remove it:
      if (isFavorite) {
        await axios.delete(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification('Recipe removed from favorites.');
      } else {
        // Otherwise, add it
        await axios.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showNotification('Recipe added to favorites.');
      }

      // Refresh the favorites list
      fetchFavorites();

      // This notifies Home (if we have it loaded) to flip the heart icon
      if (onToggleFavorite) {
        // onToggleFavorite(recipeId, !isFavorite)
        onToggleFavorite(recipeId, !isFavorite);
      }
    } catch (error) {
      showNotification('Error toggling favorite status.');
    }
  };

  const handleViewDetails = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  if (!token) {
    return <div className="p-4">Please log in to view favorites.</div>;
  }

  return (
    <div className="p-4 relative">
      {/* Notification container */}
      {notification && (
        <div className="absolute right-4 top-4 bg-blue-600 text-white px-4 py-2 rounded shadow z-50 animate-fadeIn">
          {notification}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
      {favoriteRecipes.length === 0 ? (
        <p>
          You have no favorite recipes yet.{' '}
          <a href="/" className="text-blue-600 hover:underline">
            Explore recipes
          </a>{' '}
          to add to your favorites!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {favoriteRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border rounded shadow p-3 flex flex-col"
            >
              <img
                src={recipe.thumbnail}
                alt={`Thumbnail of ${recipe.name}`}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h4 className="text-lg font-medium">{recipe.name}</h4>
              <p className="text-sm text-gray-500">
                Posted By: {recipe.user?.name || 'Unknown'} <br />
                Posted At: {new Date(recipe.postedAt).toLocaleDateString()}
              </p>
              <div className="mt-auto pt-2 flex justify-between items-center">
                <button
                  onClick={() => handleViewDetails(recipe)}
                  className="text-blue-600 hover:underline text-sm text-left"
                >
                  View Details
                </button>
                {/* This is always a filled heart, since it's in favorites list */}
                <button
                  onClick={() => handleToggleFavorite(recipe.id, true)}
                  className="text-xl text-red-500 hover:text-red-600"
                  aria-label="Remove from favorites"
                >
                  <AiFillHeart />
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
                dangerouslySetInnerHTML={{
                  __html: selectedRecipe.instructions,
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
