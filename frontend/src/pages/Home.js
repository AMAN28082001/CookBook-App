import React, { useState, useEffect } from 'react';
import {
  dummyGetRecipes,
  dummyAddToFavorites,
  dummyDeleteRecipe
} from '../services/dummyData';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    const data = dummyGetRecipes(search);
    setRecipes(data);
  };

  const handleSearch = () => {
    fetchRecipes();
  };

  const handleFavorite = (recipeId) => {
    if (!token) return alert('Please log in first');
    dummyAddToFavorites(userId, recipeId);
    alert('Recipe added to favorites!');
  };

  const handleDelete = (recipeId) => {
    try {
      dummyDeleteRecipe(userId, recipeId);
      fetchRecipes();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!token) {
    return <div className="container">Please log in to view recipes.</div>;
  }

  return (
    <div className="container">
      <h2>Home</h2>
      <div>
        <input
          placeholder="Search recipes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="recipe-cards-container">
        {recipes.map((r) => (
          <div key={r.id} className="recipe-card">
            <img src={r.thumbnail} alt={r.name} />
            <h4>{r.name}</h4>
            <p>Posted By: {r.postedBy}</p>
            <button onClick={() => handleFavorite(r.id)}>Favorite</button>
            {r.postedBy === userId && (
              <button onClick={() => handleDelete(r.id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
