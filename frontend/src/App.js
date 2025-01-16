import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import RecipeCreator from './components/RecipeCreator';
import Favorites from './components/Favorites';
import LoginRegister from './components/LoginRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegister />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create" element={<RecipeCreator />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;