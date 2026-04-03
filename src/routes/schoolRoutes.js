const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');

// All school routes require authentication
router.use(verifyToken);

// GET /api/schools - List all schools (Nutritionist/Admin)
router.get('/', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.getAllSchools);

// GET /api/schools/:id - Get school details
router.get('/:id', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.getSchoolById);

// POST /api/schools - Create school (Admin only)
router.post('/', authorizeRole(['ADMIN']), schoolController.createSchool);

// PUT /api/schools/:id - Update school (Admin only)
router.put('/:id', authorizeRole(['ADMIN']), schoolController.updateSchool);

// DELETE /api/schools/:id - Delete school (Admin only)
router.delete('/:id', authorizeRole(['ADMIN']), schoolController.deleteSchool);

// Student Management per School
router.get('/:id/students', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.getStudentsBySchool);
router.post('/:id/students', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.addStudent);
router.delete('/:id/students/:studentId', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.deleteStudent);

module.exports = router;

