// src/pages/MyRecipes.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ROUTES } from "../constants/routes";

function MyRecipes() {
  const [myRecipes, setMyRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const token = localStorage.getItem("token");

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
      showNotification(error.response?.data?.message || "Failed to load your recipes.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
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

        {/* Button to navigate to a separate "create" form (optional) */}
        {/* If you want a single-page approach, you can open a modal instead */}
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
                Posted At: {new Date(recipe.postedAt).toLocaleDateString()}
              </p>

              <div className="mt-auto flex items-center justify-between">
                {/* Example: link to an edit page, or open details */}
                <button
                  onClick={() => console.log("View/Edit details for:", recipe.name)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View/Edit
                </button>

                {/* Show a heart if you want to indicate favorites */}
                {recipe.isFavorite ? (
                  <AiFillHeart className="text-red-500 text-xl" />
                ) : (
                  <AiOutlineHeart className="text-gray-400 text-xl" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyRecipes;
