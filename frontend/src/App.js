// frontend/src/App.js
import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeCreator from './pages/RecipeCreator';

import './App.css'; // optional

function App() {
  // CART: Each item is { id, name, quantity, ... } stored in local state
  const [cart, setCart] = useState([]);

  // We’ll track “token” and “userId” from localStorage to check login
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  // CART Handlers
  const addToCart = (recipe) => {
    const existing = cart.find((item) => item.id === recipe.id);
    if (existing) {
      // Increase quantity
      setCart((prev) =>
        prev.map((item) =>
          item.id === recipe.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...recipe, quantity: 1 }]);
    }
  };

  const removeFromCart = (recipeId) => {
    setCart((prev) => prev.filter((item) => item.id !== recipeId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar gets cart state & removeFromCart action */}
      <Navbar cart={cart} onRemoveFromCart={removeFromCart} />

      {/* Define routes */}
      <Routes>
        <Route
          path="/"
          element={token ? <Home onAddToCart={addToCart} userId={userId} /> : <Navigate to="/login" />}
        />
        <Route
          path="/favorites"
          element={token ? <Favorites /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/create"
          element={token ? <RecipeCreator /> : <Navigate to="/login" />}
        />
        {/* 404 Catch-all */}
        <Route path="*" element={<div className="p-4">404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
