import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

function Home({ onToggleFavoriteExternally }) {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingFavorite, setUpdatingFavorite] = useState(false);

  // For the modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const token = localStorage.getItem("token");

  // Check auth
  useEffect(() => {
    if (!token) {
      window.location.href = "/login";
    }
  }, [token]);

  // Debounce search
  useEffect(() => {
    if (!token) return;
    const delayDebounceFn = setTimeout(() => {
      fetchRecipes(search);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, token]);

  const fetchRecipes = async (searchTerm = "") => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/recipes", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search: searchTerm },
      });
      setRecipes(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const handleFavoriteToggle = async (recipeId, currentIsFavorite) => {
    if (updatingFavorite) return;
    setUpdatingFavorite(true);

    try {
      const url = `http://localhost:5000/recipes/${recipeId}/favorite`;
      const method = currentIsFavorite ? "delete" : "post";

      await axios({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
      });

      // Flip the isFavorite flag in local state
      setRecipes((prevRecipes) =>
        prevRecipes.map((r) =>
          r.id === recipeId ? { ...r, isFavorite: !currentIsFavorite } : r
        )
      );

      // If you need to notify a parent about changes
      if (onToggleFavoriteExternally) {
        onToggleFavoriteExternally(recipeId, !currentIsFavorite);
      }

      showNotification(
        `Recipe ${currentIsFavorite ? "removed from" : "added to"} favorites.`
      );
    } catch (error) {
      showNotification("Error updating favorite status.");
    } finally {
      setUpdatingFavorite(false);
    }
  };

  // Handle errors (e.g., token expired)
  const handleError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      showNotification("Session expired. Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } else {
      showNotification(error.response?.data?.message || "Something went wrong!");
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // View Details -> open modal with that recipe’s data
  const handleViewDetails = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="p-4 relative bg-gray-50 min-h-screen">
      {/* Notification */}
      {notification && (
        <div className="absolute right-4 top-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow z-50">
          {notification}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4 text-gray-800">Home</h2>

      {/* Search */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:ring-2 focus:ring-blue-500"
        />
        {/* 
          Optional manual "Search" button
          <button
            onClick={() => fetchRecipes(search)}
            className={`bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-500"
            }`}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        */}
      </div>

      {/* Recipe Cards */}
      {loading ? (
        <p>Loading recipes...</p>
      ) : recipes.length === 0 ? (
        <p>No recipes found. Try adjusting your search query.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border rounded-2xl shadow-md p-3 flex flex-col bg-white"
            >
              <img
                src={recipe.thumbnail || "/fallback-image.jpg"}
                alt={`Thumbnail of ${recipe.name}`}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h4 className="text-lg font-semibold text-gray-800">
                {recipe.name}
              </h4>
              <p className="text-sm text-gray-500 mb-2">
                By: {recipe.user?.name || "Unknown"} <br />
                Posted At: {new Date(recipe.postedAt).toLocaleDateString()}
              </p>
              <div className="mt-auto flex items-center justify-between">
                <button
                  onClick={() => handleViewDetails(recipe)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View Details
                </button>
                <button
                  onClick={() =>
                    handleFavoriteToggle(recipe.id, recipe.isFavorite)
                  }
                  className={`text-xl ${
                    updatingFavorite
                      ? "opacity-50 cursor-not-allowed"
                      : "text-red-500 hover:text-red-600"
                  }`}
                  disabled={updatingFavorite}
                  aria-label={
                    recipe.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {recipe.isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedRecipe && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          {/* Stop click from closing if we click inside the modal itself */}
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title and Image */}
            <h2 className="text-xl font-semibold mb-4">
              {selectedRecipe.name}
            </h2>
            <img
              src={selectedRecipe.thumbnail || "/fallback-image.jpg"}
              alt={`Thumbnail of ${selectedRecipe.name}`}
              className="w-full h-52 object-cover rounded-lg mb-4"
            />

            {/* Ingredients & Instructions with HTML rendering */}
            <h3 className="font-bold mb-2">Ingredients:</h3>
            <div
              className="mb-4 prose" 
              dangerouslySetInnerHTML={{ __html: selectedRecipe.ingredients }}
            />

            <h3 className="font-bold mb-2">Instructions:</h3>
            <div
              className="mb-4 prose"
              dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
            />

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
