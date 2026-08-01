const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const productsRoutes = require('./routes/productsRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/users', usersRoutes);

// 404 Handler for undefined API routes
app.use('/api/*splat', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
    data: {}
  });
});
// Global Error Handler
app.use(errorHandler);

module.exports = app;
