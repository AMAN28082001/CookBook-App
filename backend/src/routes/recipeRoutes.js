// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Import controllers
const {
  createRecipe,
  getAllRecipes,
  getUserRecipes,
} = require('../controllers/recipeController');

// POST /recipes => create a new recipe (protected)
router.post('/', authMiddleware, createRecipe);

// GET /recipes => get all recipes (Home) (protected)
router.get('/', authMiddleware, getAllRecipes);

// GET /recipes/my-recipes => get only user's recipes (protected)
router.get('/my-recipes', authMiddleware, getUserRecipes);

module.exports = router;
