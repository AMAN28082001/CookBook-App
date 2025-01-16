import React, { useState, useEffect } from 'react';

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);

  const staticData = [
    {
      id: 1,
      name: 'Spaghetti Carbonara',
      instructions: 'Cook spaghetti. Fry pancetta. Mix with eggs and cheese.',
      thumbnail: 'https://www.sipandfeast.com/wp-content/uploads/2022/09/spaghetti-carbonara-recipe-snippet.jpg',
      postedBy: 'Chef John',
      postedAt: '2023-01-01',
      ingredients: ['Spaghetti', 'Pancetta', 'Eggs', 'Cheese', 'Black Pepper'],
    },
    {
      id: 2,
      name: 'Chicken Alfredo',
      instructions: 'Cook pasta. Make Alfredo sauce. Add chicken and combine.',
      thumbnail: 'https://ifoodreal.com/wp-content/uploads/2021/08/fg-healthy-chicken-alfredo.jpg',
      postedBy: 'Chef Jane',
      postedAt: '2023-02-01',
      ingredients: ['Pasta', 'Chicken', 'Butter', 'Cream', 'Parmesan Cheese'],
    },
  ];

  const handleSearch = () => {
    // Filter recipes based on search query
    const filteredRecipes = staticData.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setRecipes(filteredRecipes);
  };

  const addToFavorites = (recipe) => {
    // Avoid adding duplicates to favorites
    if (!favorites.some((fav) => fav.id === recipe.id)) {
      setFavorites([...favorites, recipe]);
    }
  };

  useEffect(() => {
    // Load all recipes initially
    setRecipes(staticData);
  }, []);

  return (
    <div>
      <h2>{showFavorites ? 'Favorites' : 'Home'}</h2>
      {!showFavorites && (
        <>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </>
      )}

      <div className="recipe-cards">
        {(showFavorites ? favorites : recipes).map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <img src={recipe.thumbnail} alt={recipe.name} />
            <h3>{recipe.name}</h3>
            <p><strong>Posted By:</strong> {recipe.postedBy}</p>
            <p><strong>Posted At:</strong> {recipe.postedAt}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            {!showFavorites && (
              <button onClick={() => addToFavorites(recipe)}>
                Add to Favorites
              </button>
            )}
          </div>
        ))}
        {showFavorites && favorites.length === 0 && <p>No favorites yet!</p>}
      </div>

      <button onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? 'Back to Home' : 'Go to Favorites'}
      </button>
    </div>
  );
}

export default Home;
