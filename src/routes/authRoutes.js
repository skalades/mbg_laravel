const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

// @route POST api/auth/register
// @desc Register user (Only Admin)
// @access Private (Admin)
router.post('/register', verifyToken, authorizeRole(['ADMIN']), authController.register);

// @route GET api/auth/status
// @desc Check API status
// @access Public
router.get('/status', authController.status);

// @route POST api/auth/login
// @desc Login user & set cookies
// @access Public
router.post('/login', authController.login);

// @route POST api/auth/logout
// @desc Logout user & clear cookies
// @access Private
router.post('/logout', verifyToken, authController.logout);

// @route POST api/auth/refresh
// @desc Refresh access token
// @access Public (Requires Refresh Cookie)
router.post('/refresh', authController.refresh);

// @route GET api/auth/me
// @desc Get current user profile
// @access Private
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
