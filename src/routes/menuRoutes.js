const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

// All menu routes require authentication
router.use(verifyToken);

// GET /api/menus/master - List all master menu library templates
router.get('/master', authorizeRole(['ADMIN', 'NUTRITIONIST']), menuController.getMasterMenus);

// GET /api/menus/master/:id - Details of a master menu
router.get('/master/:id', authorizeRole(['ADMIN', 'NUTRITIONIST']), menuController.getMasterMenuDetails);

// POST /api/menus/master - Create a new master menu template
router.post('/master', authorizeRole(['ADMIN', 'NUTRITIONIST']), menuController.createMasterMenu);

// POST /api/menus/check-allergies - Check for allergy conflicts
router.post('/check-allergies', authorizeRole(['ADMIN', 'NUTRITIONIST']), menuController.checkAllergies);

// POST /api/menus/daily - Save a daily menu and calculate logistics
router.post('/daily', authorizeRole(['ADMIN', 'NUTRITIONIST']), menuController.createDailyMenu);

// GET /api/menus/daily - List all daily menus for audit dashboard
router.get('/daily', authorizeRole(['ADMIN', 'NUTRITIONIST', 'CHEF']), menuController.getDailyMenus);

// GET /api/menus/daily/logistics/summary - Get logistics summary
router.get('/daily/logistics/summary', authorizeRole(['ADMIN', 'NUTRITIONIST']), menuController.getDailyLogisticsSummary);

// GET /api/menus/daily/:id - Get specific daily menu details for audit
router.get('/daily/:id', authorizeRole(['ADMIN', 'NUTRITIONIST', 'CHEF']), menuController.getDailyMenuDetails);

// POST /api/menus/daily/:id/audit - Submit audit/QC results
router.post('/daily/:id/audit', authorizeRole(['ADMIN', 'NUTRITIONIST', 'CHEF']), menuController.submitAudit);

module.exports = router;
