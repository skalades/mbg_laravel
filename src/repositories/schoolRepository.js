const db = require('../config/db');

class SchoolRepository {
  async getAll() {
    const [rows] = await db.execute('SELECT * FROM schools ORDER BY created_at DESC');
    return rows;
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM schools WHERE id = ?', [id]);
    return rows[0];
  }

  async create(schoolData) {
    const { school_name, target_group, total_beneficiaries, total_teachers, large_portion_count, small_portion_count, location_address } = schoolData;
    const [result] = await db.execute(
      'INSERT INTO schools (school_name, target_group, total_beneficiaries, total_teachers, large_portion_count, small_portion_count, location_address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [school_name, target_group, total_beneficiaries || 0, total_teachers || 0, large_portion_count || 0, small_portion_count || 0, location_address]
    );
    return { id: result.insertId, ...schoolData };
  }

  async update(id, school) {
    const { school_name, target_group, total_beneficiaries, total_teachers, large_portion_count, small_portion_count, location_address } = school;
    await db.execute(
      'UPDATE schools SET school_name = ?, target_group = ?, total_beneficiaries = ?, total_teachers = ?, large_portion_count = ?, small_portion_count = ?, location_address = ? WHERE id = ?',
      [school_name, target_group, total_beneficiaries || 0, total_teachers || 0, large_portion_count || 0, small_portion_count || 0, location_address, id]
    );
  }

  async delete(id) {
    await db.execute('DELETE FROM schools WHERE id = ?', [id]);
  }
}

module.exports = new SchoolRepository();
