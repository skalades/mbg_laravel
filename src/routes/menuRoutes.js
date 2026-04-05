const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Public access mode — auth disabled

// GET /api/menus/master - List all master menu library templates
router.get('/master', menuController.getMasterMenus);

// GET /api/menus/master/:id - Details of a master menu
router.get('/master/:id', menuController.getMasterMenuDetails);

// POST /api/menus/master - Create a new master menu template
router.post('/master', menuController.createMasterMenu);

// DELETE /api/menus/master/:id - Delete a master menu template
router.delete('/master/:id', menuController.deleteMasterMenu);

// POST /api/menus/check-allergies - Check for allergy conflicts
router.post('/check-allergies', menuController.checkAllergies);

// POST /api/menus/daily - Save a daily menu and calculate logistics
router.post('/daily', menuController.createDailyMenu);

// GET /api/menus/daily - List all daily menus for audit dashboard
router.get('/daily', menuController.getDailyMenus);

// GET /api/menus/daily/logistics/summary - Get logistics summary
router.get('/daily/logistics/summary', menuController.getDailyLogisticsSummary);

// GET /api/menus/daily/:id - Get specific daily menu details for audit
router.get('/daily/:id', menuController.getDailyMenuDetails);

// POST /api/menus/daily/:id/audit - Submit audit/QC results
router.post('/daily/:id/audit', menuController.submitAudit);

module.exports = router;
