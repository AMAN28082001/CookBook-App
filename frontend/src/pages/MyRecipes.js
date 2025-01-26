// src/pages/MyRecipes.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

// 1) Import ReactQuill + its CSS
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function MyRecipes() {
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const token = localStorage.getItem("token");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fields for editing
  const [editName, setEditName] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editThumbnail, setEditThumbnail] = useState("");

  // Quill modules configuration (toolbar, etc.)
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  useEffect(() => {
    if (!token) {
      window.location.href = ROUTES.LOGIN;
    } else {
      fetchMyRecipes();
    }
  }, [token]);

  const fetchMyRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/recipes/my-recipes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyRecipes(response.data);
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to load your recipes."
      );
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Open modal for editing
  const handleViewEdit = (recipe) => {
    setSelectedRecipe(recipe);
    setEditName(recipe.name || "");
    setEditInstructions(recipe.instructions || "");
    setEditIngredients(recipe.ingredients || "");
    setEditThumbnail(recipe.thumbnail || "");
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRecipe(null);
  };

  // PUT update
  const handleUpdateRecipe = async () => {
    if (!selectedRecipe) return;

    try {
      await axios.put(
        `http://localhost:5000/recipes/${selectedRecipe.id}`,
        {
          name: editName,
          instructions: editInstructions,
          ingredients: editIngredients,
          thumbnail: editThumbnail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showNotification("Recipe updated successfully!");
      // Close modal and reload data
      handleCloseModal();
      fetchMyRecipes();
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Error updating recipe."
      );
    }
  };

  return (
    <div className="p-4">
      {/* Notification */}
      {notification && (
        <div className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
          {notification}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Recipes</h2>
        <Link
          to="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-500"
        >
          Create New
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : myRecipes.length === 0 ? (
        <p>No recipes found. Click "Create New" to add your first recipe!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {myRecipes.map((recipe) => (
            <div key={recipe.id} className="border rounded shadow p-3 flex flex-col">
              <img
                src={recipe.thumbnail || "/fallback-image.jpg"}
                alt={recipe.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h4 className="text-lg font-semibold">{recipe.name}</h4>
              <p className="text-sm text-gray-500 mb-2">
                Posted At: {new Date(recipe.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <button
                  onClick={() => handleViewEdit(recipe)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View/Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showModal && selectedRecipe && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative
                       max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Close "X" icon in the top-right corner */}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">Update Recipe</h2>

            {/* Name */}
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            {/* Instructions (ReactQuill) */}
            <label className="block mb-1 font-medium">Instructions</label>
            <ReactQuill
              theme="snow"
              value={editInstructions}
              onChange={setEditInstructions}
              modules={quillModules}
              className="mb-4"
            />

            {/* Ingredients (ReactQuill) */}
            <label className="block mb-1 font-medium">Ingredients</label>
            <ReactQuill
              theme="snow"
              value={editIngredients}
              onChange={setEditIngredients}
              modules={quillModules}
              className="mb-4"
            />

            {/* Thumbnail */}
            <label className="block mb-1 font-medium">Thumbnail URL</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full mb-4"
              value={editThumbnail}
              onChange={(e) => setEditThumbnail(e.target.value)}
            />
            {editThumbnail && (
              <img
                src={editThumbnail}
                alt="Preview"
                className="w-full h-40 object-cover rounded mb-4"
              />
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRecipe}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRecipes;
