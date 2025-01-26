const { Op } = require('sequelize');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const Favorite = require('../models/Favorite');

// Create a new recipe
exports.createRecipe = async (req, res) => {
  try {
    const { name, instructions, thumbnail, ingredients } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
    }

    const recipe = await Recipe.create({
      name,
      instructions,
      thumbnail,
      ingredients,
      postedBy: req.userId,
    });

    return res.status(201).json({
      message: 'Recipe created successfully',
      recipe,
    });
  } catch (error) {
    console.error('Error creating recipe:', error);
    return res.status(500).json({
      message: 'Failed to create recipe.',
      error: error.message,
    });
  }
};

// Get ALL recipes (Home) with isFavorite
exports.getAllRecipes = async (req, res) => {
  try {
    console.log('userid:', req.userId);
    console.log('search query:', req.query.search);

    // 1) Find which recipe IDs this user has favorited
    let userFavoriteIds = [];
    if (req.userId) {
      const userFavorites = await Favorite.findAll({
        where: { userId: req.userId },
        attributes: ['recipeId'],
      });
      userFavoriteIds = userFavorites.map((fav) => fav.recipeId);
    }

    // 2) Fetch all recipes, optionally filtering by search
    const recipes = await Recipe.findAll({
      where: {
        ...(req.query.search && {
          name: { [Op.iLike]: `%${req.query.search.toLowerCase()}%` },
        }),
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // 3) Attach isFavorite
    const responseData = recipes.map((recipe) => {
      const plainRecipe = recipe.get({ plain: true });
      plainRecipe.isFavorite = userFavoriteIds.includes(plainRecipe.id);
      return plainRecipe;
    });

    // 4) Return updated list
    return res.json(responseData);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get ONLY user's own recipes (My Recipes) + optional search + isFavorite
exports.getUserRecipes = async (req, res) => {
  try {
    console.log("userid:", req.userId);
    console.log("search:", req.query.search);

    // 1) Find which recipe IDs this user has favorited (if we want isFavorite here too)
    let userFavoriteIds = [];
    if (req.userId) {
      const userFavorites = await Favorite.findAll({
        where: { userId: req.userId },
        attributes: ['recipeId'],
      });
      userFavoriteIds = userFavorites.map((fav) => fav.recipeId);
    }

    // 2) Fetch recipes created by the current user + optional search
    const recipes = await Recipe.findAll({
      where: {
        postedBy: req.userId,
        ...(req.query.search && {
          name: { [Op.iLike]: `%${req.query.search.toLowerCase()}%` },
        }),
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // 3) Attach isFavorite to each (optional, if you want to see favorites among your own recipes)
    const responseData = recipes.map((recipe) => {
      const plainRecipe = recipe.get({ plain: true });
      plainRecipe.isFavorite = userFavoriteIds.includes(plainRecipe.id);
      return plainRecipe;
    });

    // 4) Return only user's own recipes
    return res.json(responseData);
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
