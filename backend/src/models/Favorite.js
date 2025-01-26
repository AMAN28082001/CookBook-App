// models/Favorite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Recipe = require('./Recipe');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  recipeId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Recipe,
      key: 'id',
    },
  },
}, {
  tableName: 'favorites',
  timestamps: true,
  indexes: [
    { fields: ['userId'] },
    { fields: ['recipeId'] },
    {
      unique: true,
      fields: ['userId', 'recipeId'],
      name: 'unique_user_recipe', // Optional: Name your index for clarity
    },
  ],
});

Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Favorite.belongsTo(Recipe, { foreignKey: 'recipeId', as: 'recipe' });
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Recipe.hasMany(Favorite, { foreignKey: 'recipeId', as: 'favorites' });


module.exports = Favorite;
