const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Route Imports
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const menuRoutes = require('./routes/menuRoutes');
const portionRoutes = require('./routes/portionRoutes');

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/portions', portionRoutes);

// Basic Route for Health Check
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Nutrizi API - Nutritionist Module',
    status: 'Running',
    version: '1.4.0 (Phase 4: Operations & Audit)'
  });
});

// Error Handling Middleware (Basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Nutrizi Server is running on http://localhost:${PORT}`);
});

module.exports = app;
