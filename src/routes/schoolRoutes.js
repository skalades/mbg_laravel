const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');
const { verifyToken, authorizeRole } = require('../middlewares/authMiddleware');
const isolationMiddleware = require('../middlewares/isolationMiddleware');

// All school routes require authentication
router.use(verifyToken);

// GET /api/schools - List all schools (Nutritionist/Admin)
router.get('/', authorizeRole(['ADMIN', 'NUTRITIONIST']), isolationMiddleware, schoolController.getAllSchools);

// GET /api/schools/:id - Get school details
router.get('/:id', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.getSchoolById);

// POST /api/schools - Create school (Admin/Nutritionist)
router.post('/', authorizeRole(['ADMIN', 'NUTRITIONIST']), isolationMiddleware, schoolController.createSchool);

// PUT /api/schools/:id - Update school (Admin/Nutritionist)
router.put('/:id', authorizeRole(['ADMIN', 'NUTRITIONIST']), isolationMiddleware, schoolController.updateSchool);

// DELETE /api/schools/:id - Delete school (Admin only)
router.delete('/:id', authorizeRole(['ADMIN']), schoolController.deleteSchool);

// Student Management per School
router.get('/:id/students', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.getStudentsBySchool);
router.post('/:id/students', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.addStudent);
router.delete('/:id/students/:studentId', authorizeRole(['ADMIN', 'NUTRITIONIST']), schoolController.deleteStudent);

module.exports = router;

