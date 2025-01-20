import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { dummyCreateRecipe } from '../services/dummyData';

function RecipeCreator() {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [ingredients, setIngredients] = useState('');

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  if (!token) {
    return <div className="container">Please log in first.</div>;
  }

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Please enter a recipe name');
      return;
    }
    dummyCreateRecipe({
      name,
      instructions,
      thumbnail,
      ingredients,
      userId
    });
    alert('Recipe created!');
    setName('');
    setInstructions('');
    setThumbnail('');
    setIngredients('');
  };

  return (
    <div className="container">
      <h2>Create Recipe</h2>

      <div className="input-group">
        <label>Name:</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: 'block' }}
        />
      </div>

      <div className="input-group">
        <label>Instructions:</label>
        <ReactQuill
          theme="snow"
          value={instructions}
          onChange={setInstructions}
          style={{ height: '120px', marginBottom: '1rem' }}
        />
      </div>

      <div className="input-group">
        <label>Thumbnail URL:</label>
        <input
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          style={{ display: 'block' }}
        />
      </div>

      <div className="input-group">
        <label>Ingredients (comma-separated):</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
      </div>

      <button onClick={handleCreate}>Create</button>
    </div>
  );
}

export default RecipeCreator;
