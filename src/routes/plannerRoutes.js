const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/plannerController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

// Planner routes require authentication
router.use(verifyToken);

// GET /api/planner/search - Search food (Nutritionist/Admin)
router.get('/search', authorizeRole(['ADMIN', 'NUTRITIONIST']), plannerController.searchFood);

// GET /api/planner/food/:id/conversions - Get available units
router.get('/food/:id/conversions', authorizeRole(['ADMIN', 'NUTRITIONIST']), plannerController.getFoodConversions);
router.post('/food/:id/conversions', authorizeRole(['ADMIN']), plannerController.addFoodConversion);

// Food Items Management (Phase 1 Gaps)
router.get('/food', authorizeRole(['ADMIN', 'NUTRITIONIST']), plannerController.getAllFood);
router.post('/food', authorizeRole(['ADMIN']), plannerController.createFood);
router.put('/food/:id', authorizeRole(['ADMIN']), plannerController.updateFood);
router.delete('/food/:id', authorizeRole(['ADMIN']), plannerController.deleteFood);

// POST /api/planner/calculate - Calculate meal nutrition
router.post('/calculate', authorizeRole(['ADMIN', 'NUTRITIONIST']), plannerController.calculateMeal);

module.exports = router;
