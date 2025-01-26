// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db'); // Sequelize instance
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes'); // Import favoriteRoutes

// Initialize express app
const app = express();

// Middleware for CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Middleware for parsing request body
app.use(bodyParser.json());

// Define routes
app.use('/auth', userRoutes);
app.use('/recipes', recipeRoutes);
app.use('/recipes', favoriteRoutes); // Prefix favoriteRoutes with /recipes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server and connect to the database
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate(); // Test database connection
    console.log('Database connected successfully.');

    // Sync database models (use cautiously in production)
    await sequelize.sync({ alter: true }); // `alter` adjusts tables without dropping

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit process if database connection fails
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server...');
  sequelize.close().then(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});

// Start the server
startServer();
