const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchenController');

// Public access mode — auth disabled

// GET /api/kitchens - List all central kitchens
router.get('/', kitchenController.getAllKitchens);

// GET /api/kitchens/:id - Get kitchen details
router.get('/:id', kitchenController.getKitchenById);

// POST /api/kitchens - Create kitchen
router.post('/', kitchenController.createKitchen);

// PUT /api/kitchens/:id - Update kitchen
router.put('/:id', kitchenController.updateKitchen);

// DELETE /api/kitchens/:id - Delete kitchen
router.delete('/:id', kitchenController.deleteKitchen);

module.exports = router;
