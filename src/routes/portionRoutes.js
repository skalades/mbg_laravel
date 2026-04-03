const express = require('express');
const router = express.Router();
const portionController = require('../controllers/portionController');

router.get('/', portionController.getAllPortions);
router.get('/:id', portionController.getPortionById);
router.post('/', portionController.createPortion);
router.put('/:id', portionController.updatePortion);
router.delete('/:id', portionController.deletePortion);

module.exports = router;
