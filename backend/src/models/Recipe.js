const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Recipe = sequelize.define(
  'Recipe',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ingredients: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    postedBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'recipes',
    timestamps: true,
  }
);

Recipe.belongsTo(User, { foreignKey: 'postedBy', as: 'user' }); // Ensure proper alias is used
User.hasMany(Recipe, { foreignKey: 'postedBy', as: 'recipes' });

module.exports = Recipe;
