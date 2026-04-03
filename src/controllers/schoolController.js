const schoolService = require('../services/schoolService');

exports.getAllSchools = async (req, res) => {
  try {
    const schools = await schoolService.getAllSchools();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSchoolById = async (req, res) => {
  try {
    const school = await schoolService.getSchoolById(req.params.id);
    res.json(school);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

exports.createSchool = async (req, res) => {
  try {
    const schoolId = await schoolService.createSchool(req.body);
    res.status(201).json({ message: 'School created successfully', schoolId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSchool = async (req, res) => {
  try {
    await schoolService.updateSchool(req.params.id, req.body);
    res.json({ message: 'School updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteSchool = async (req, res) => {
  try {
    await schoolService.deleteSchool(req.params.id);
    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const studentProfileRepository = require('../repositories/studentProfileRepository');

exports.getStudentsBySchool = async (req, res) => {
  try {
    const students = await studentProfileRepository.getBySchoolId(req.params.id);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.addStudent = async (req, res) => {
  const { student_name, allergy_notes, last_bb, last_tb } = req.body;
  const school_id = req.params.id;

  if (!student_name) {
    return res.status(400).json({ message: 'Student name is required' });
  }

  try {
    const student = await studentProfileRepository.create({
      school_id,
      student_name,
      allergy_notes,
      last_bb,
      last_tb
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error adding student' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await studentProfileRepository.delete(req.params.studentId);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student' });
  }
};

