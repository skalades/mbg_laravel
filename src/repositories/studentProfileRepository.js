const db = require('../config/db');

const studentProfileRepository = {
  async getBySchoolId(schoolId) {
    const [rows] = await db.query('SELECT * FROM student_profiles WHERE school_id = ?', [schoolId]);
    return rows;
  },

  async getAllergiesBySchoolId(schoolId) {
    const [rows] = await db.query('SELECT allergy_notes FROM student_profiles WHERE school_id = ?', [schoolId]);
    return rows.map(row => row.allergy_notes).filter(notes => notes);
  },

  async getStudentAllergyMap(schoolId) {
    const [rows] = await db.query('SELECT student_name, allergy_notes FROM student_profiles WHERE school_id = ?', [schoolId]);
    return rows.filter(row => row.allergy_notes);
  },

  async create(studentData) {
    const { school_id, student_name, allergy_notes, last_bb, last_tb } = studentData;
    const [result] = await db.execute(
      'INSERT INTO student_profiles (school_id, student_name, allergy_notes, last_bb, last_tb) VALUES (?, ?, ?, ?, ?)',
      [school_id, student_name, allergy_notes, last_bb || 0, last_tb || 0]
    );
    return { id: result.insertId, ...studentData };
  },

  async delete(id) {
    await db.execute('DELETE FROM student_profiles WHERE id = ?', [id]);
  }
};


module.exports = studentProfileRepository;
