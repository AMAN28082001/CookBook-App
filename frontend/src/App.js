import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Favorites from './pages/Favorites';
import RecipeCreator from './pages/RecipeCreator';

function App() {
  const token = localStorage.getItem('token');

  return (
    <div>
      {/* Navbar is inside the Router context */}
      <Navbar />

      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" />}
        />
        <Route
          path="/favorites"
          element={token ? <Favorites /> : <Navigate to="/login" />}
        />
        <Route
          path="/create"
          element={token ? <RecipeCreator /> : <Navigate to="/login" />}
        />
        {/* Catch-all 404 */}
        <Route path="*" element={<div className="container">404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;
