const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Public access mode — auth disabled

// GET /api/admin/users - List all users
router.get('/users', adminController.getAllUsers);

// POST /api/admin/users - Create new user
router.post('/users', adminController.createUser);

// PUT /api/admin/users/:id - Update user
router.put('/users/:id', adminController.updateUser);

// DELETE /api/admin/users/:id - Delete user
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
