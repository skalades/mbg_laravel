const express = require('express');
const router = express.Router();
const schoolController = require('../controllers/schoolController');

// Public access mode — auth disabled

// GET /api/schools - List all schools
router.get('/', schoolController.getAllSchools);

// GET /api/schools/:id - Get school details
router.get('/:id', schoolController.getSchoolById);

// POST /api/schools - Create school
router.post('/', schoolController.createSchool);

// PUT /api/schools/:id - Update school
router.put('/:id', schoolController.updateSchool);

// DELETE /api/schools/:id - Delete school
router.delete('/:id', schoolController.deleteSchool);

// Student Management per School
router.get('/:id/students', schoolController.getStudentsBySchool);
router.post('/:id/students', schoolController.addStudent);
router.delete('/:id/students/:studentId', schoolController.deleteStudent);

module.exports = router;
