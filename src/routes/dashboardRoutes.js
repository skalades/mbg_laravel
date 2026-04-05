const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../middlewares/authMiddleware');
const isolationMiddleware = require('../middlewares/isolationMiddleware');

// All dashboard routes require authentication and isolation scoping
router.use(verifyToken);
router.use(isolationMiddleware);

// GET /api/dashboard/summary - Comprehensive dashboard overview
router.get('/summary', dashboardController.getSummary);

module.exports = router;
