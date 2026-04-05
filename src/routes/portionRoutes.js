const express = require('express');
const router = express.Router();
const portionController = require('../controllers/portionController');

// Public access mode — auth disabled

// GET /api/portions - List all portion configurations
router.get('/', portionController.getAllPortions);

// POST /api/portions - Create new portion config
router.post('/', portionController.createPortion);

// PUT /api/portions/:id - Update portion config
router.put('/:id', portionController.updatePortion);

// DELETE /api/portions/:id - Delete portion config
router.delete('/:id', portionController.deletePortion);

module.exports = router;
