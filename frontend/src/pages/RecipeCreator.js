import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function RecipeCreator() {
  const [name, setName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [notification, setNotification] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const dropdownRef = useRef(null);

  // Debounce user input for "name"
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only fetch if there's something typed
      if (name.trim()) {
        fetchSuggestions(name);
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [name]);

  // Close suggestions if clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const fetchSuggestions = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}`
      );
      const results = response.data?.data?.recipes || [];
      setSuggestions(results);
      // Show suggestions immediately if we got results
      setShowSuggestions(results.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle the dropdown without re-fetching
  const handleToggleSuggestions = () => {
    if (!suggestions.length) return; // If no suggestions, do nothing
    setShowSuggestions(!showSuggestions);
  };

  // Pick a suggestion => fill, close, and clear them so we don't re-open old data
  const handleSuggestionClick = (suggestion) => {
    setName(suggestion.title);
    setThumbnail(suggestion.image_url);
    setShowSuggestions(false);
    // Clear out suggestions so user can't re-toggle the same search
    setSuggestions([]);
  };

  // Create recipe
  const handleCreate = async () => {
    if (!token) {
      showNotification('You must log in to create a recipe.', 'error');
      return;
    }
    if (!name.trim() || !stripHtml(instructions) || !stripHtml(ingredients)) {
      showNotification('All fields are required!', 'error');
      return;
    }
    try {
      setCreating(true);
      await axios.post(
        'http://localhost:5000/recipes',
        { name, instructions, ingredients, thumbnail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showNotification('Recipe created successfully!', 'success');
      // Clear form
      setName('');
      setInstructions('');
      setIngredients('');
      setThumbnail('');
      setSuggestions([]);
      navigate('/');
    } catch (error) {
      showNotification(
        error.response?.data?.message || 'Error creating recipe.',
        'error'
      );
    } finally {
      setCreating(false);
    }
  };

  // Remove HTML tags/spaces to check if there's content
  const stripHtml = (html) => html.replace(/<[^>]+>/g, '').trim();

  const showNotification = (msg, type) => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div className="px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Recipe</h2>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`px-4 py-2 mb-4 rounded text-white ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {notification.msg}
          </div>
        )}

        {/* Name + Suggestions */}
        <div className="mb-4 relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700">
            Name:
          </label>
          <div className="flex items-center">
            <input
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2
                         focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Recipe Name"
            />
            <button
              type="button"
              onClick={handleToggleSuggestions}
              className="ml-2 p-2 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
              title="Show/Hide suggestions"
            >
              ▼
            </button>
          </div>
          {loading && <p className="text-sm text-gray-500 mt-2">Loading...</p>}

          {/* Dropdown: show only if we have suggestions and showSuggestions is true */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-40 overflow-y-auto">
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSuggestionClick(item)}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {item.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Instructions (Quill) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Instructions:
          </label>
          <ReactQuill
            theme="snow"
            value={instructions}
            onChange={setInstructions}
            className="mt-1 border border-gray-300 rounded"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>

        {/* Ingredients (Quill) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Ingredients:
          </label>
          <ReactQuill
            theme="snow"
            value={ingredients}
            onChange={setIngredients}
            className="mt-1 border border-gray-300 rounded"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </div>

        {/* Thumbnail URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail URL:
          </label>
          <input
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            aria-label="Thumbnail URL"
          />
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Thumbnail Preview"
              className="mt-2 w-full h-40 object-cover rounded"
            />
          )}
        </div>

        {/* Create Button */}
        <button
          onClick={handleCreate}
          disabled={creating}
          className={`w-full bg-green-600 text-white py-2 px-4 rounded font-medium ${
            creating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500'
          }`}
        >
          {creating ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
}

export default RecipeCreator;
