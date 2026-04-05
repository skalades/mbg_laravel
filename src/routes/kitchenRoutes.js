const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchenController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

// All kitchen routes require authentication and ADMIN role
router.use(verifyToken);
router.use(authorizeRole(['ADMIN']));

router.get('/', kitchenController.getAllKitchens);
router.get('/:id', kitchenController.getKitchenById);
router.post('/', kitchenController.createKitchen);
router.put('/:id', kitchenController.updateKitchen);
router.delete('/:id', kitchenController.deleteKitchen);

module.exports = router;
