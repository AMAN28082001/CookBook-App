import React, { useEffect, useState } from 'react';
import {
  dummyGetFavorites,
  dummyRemoveFromFavorites
} from '../services/dummyData';

function Favorites() {
  const [favs, setFavs] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const loadFavorites = () => {
    if (!userId) return;
    const data = dummyGetFavorites(userId);
    setFavs(data);
  };

  useEffect(() => {
    if (token) {
      loadFavorites();
    }
  }, [token]);

  const handleUnfav = (recipeId) => {
    try {
      dummyRemoveFromFavorites(userId, recipeId);
      loadFavorites(); // refresh
    } catch (error) {
      alert(error.message);
    }
  };

  if (!token) {
    return <div className="container">Please log in to view favorites.</div>;
  }

  return (
    <div className="container">
      <h2>Your Favorites</h2>
      <div className="recipe-cards-container">
        {favs.map((r) => (
          <div key={r.id} className="recipe-card">
            <img src={r.thumbnail} alt={r.name} />
            <h4>{r.name}</h4>
            <button onClick={() => handleUnfav(r.id)}>Unfavorite</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
