const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Mock Auth Middleware for Public Mode
const mockAuth = require('./middlewares/mockAuthMiddleware');

// Middlewares
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:3000', 
    'http://localhost:3001',
    'https://nutrizi.skalades.biz.id'
  ],
  credentials: true
}));
app.use(mockAuth);
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Route Imports
const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const plannerRoutes = require('./routes/plannerRoutes');
const menuRoutes = require('./routes/menuRoutes');
const portionRoutes = require('./routes/portionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const kitchenRoutes = require('./routes/kitchenRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/planner', plannerRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/portions', portionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/kitchens', kitchenRoutes);
app.use('/api/admin', adminRoutes);

// Basic Route for Health Check
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Nutrizi API - (Root)',
    status: 'Running'
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Nutrizi API - Nutritionist Module',
    status: 'Running',
    version: '1.4.0 (Phase 4: Operations & Audit)'
  });
});

// SYSTEM HEALTH CHECK (For Debugging)
app.get('/api/health', async (req, res) => {
  const db = require('./config/db');
  const redisClient = require('./config/redisClient');
  
  let mysqlStatus = 'Checking...';
  let redisStatus = 'Checking...';

  try {
    const [rows] = await db.execute('SELECT 1 + 1 AS result');
    mysqlStatus = 'Connected (OK)';
  } catch (err) {
    mysqlStatus = `Connection Error: ${err.message}`;
  }

  try {
    const isRedisOpen = redisClient.isOpen;
    redisStatus = isRedisOpen ? 'Connected (OK)' : 'Reconnecting...';
  } catch (err) {
    redisStatus = `Connection Error: ${err.message}`;
  }

  res.json({
    service: 'Nutrizi API',
    status: 'Running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV,
    checks: {
      mysql: mysqlStatus,
      redis: redisStatus,
      port: process.env.PORT || 3000
    }
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
