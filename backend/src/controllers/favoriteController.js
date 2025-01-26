const { Op } = require('sequelize');
const Favorite = require('../models/Favorite');
const Recipe = require('../models/Recipe');
const User = require('../models/User'); // Import User model

// Helper: Standardized error response
const errorResponse = (res, message, status = 500) =>
  res.status(status).json({ error: message });

// Add a recipe to favorites
exports.addFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    // Validate `recipeId` (assume UUID format)
    if (!recipeId || typeof recipeId !== 'string') {
      return errorResponse(res, 'Invalid recipe ID.', 400);
    }

    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found.' });
    }

    // Use findOrCreate to optimize performance
    const [favorite, created] = await Favorite.findOrCreate({
      where: { userId: req.userId, recipeId },
      defaults: { userId: req.userId, recipeId },
    });

    if (!created) {
      return res.status(400).json({ message: 'Recipe already favorited.' });
    }

    await Recipe.update(
      { favoriteCount: recipe.favoriteCount + 1 },
      { where: { id: recipeId } }
    );

    res.status(201).json({
      message: 'Recipe added to favorites.',
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    next(error); // Use middleware for handling unexpected errors
  }
};

// Get user's favorites
exports.getUserFavorites = async (req, res, next) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const favorites = await Favorite.findAll({
      where: { userId: req.userId },
      include: [
        {
          model: Recipe,
          as: 'recipe',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
          ],
          attributes: [
            'id',
            'name',
            'thumbnail',
            'instructions',
            'ingredients',
            'postedBy',
            'postedAt',
          ],
        },
      ],
    });

    // Transform favorites to return recipes only
    const formattedFavorites = favorites.map((fav) => fav.recipe);
    res.status(200).json(formattedFavorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    next(error);
  }
};

// Remove a recipe from favorites
exports.removeFavorite = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    // Validate `recipeId`
    if (!recipeId || typeof recipeId !== 'string') {
      return errorResponse(res, 'Invalid recipe ID.', 400);
    }

    const favorite = await Favorite.findOne({
      where: { userId: req.userId, recipeId },
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found.' });
    }

    await favorite.destroy();
    res.status(200).json({ message: 'Recipe removed from favorites.' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    next(error);
  }
};
