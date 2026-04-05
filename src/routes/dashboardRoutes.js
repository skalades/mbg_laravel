const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Public access mode — auth disabled

// GET /api/dashboard/summary - Comprehensive dashboard overview
router.get('/summary', dashboardController.getSummary);

module.exports = router;
