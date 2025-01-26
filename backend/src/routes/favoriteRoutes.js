const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure the path is correct
const { addFavorite, getUserFavorites, removeFavorite } = require('../controllers/favoriteController');

const router = express.Router();

// Route to add a recipe to favorites
router.post('/:recipeId/favorite', authMiddleware, addFavorite);

// Route to get user's favorite recipes
router.get('/favorites', authMiddleware, getUserFavorites);

// Route to remove a recipe from favorites
router.delete('/:recipeId/favorite', authMiddleware, removeFavorite);

module.exports = router;
