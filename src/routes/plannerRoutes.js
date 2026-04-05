const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');

// Public access mode — auth disabled

// GET /api/planner/search - Search food
router.get('/search', plannerController.searchFood);

// GET /api/planner/food/:id/conversions - Get available units
router.get('/food/:id/conversions', plannerController.getFoodConversions);
router.post('/food/:id/conversions', plannerController.addFoodConversion);

// Food Items Management
router.get('/food', plannerController.getAllFood);
router.post('/food', plannerController.createFood);
router.put('/food/:id', plannerController.updateFood);
router.delete('/food/:id', plannerController.deleteFood);

// POST /api/planner/calculate - Calculate meal nutrition
router.post('/calculate', plannerController.calculateMeal);

module.exports = router;
