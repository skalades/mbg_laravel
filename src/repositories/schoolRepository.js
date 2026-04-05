const db = require('../config/db');

class SchoolRepository {
  async getAll(kitchenId = null) {
    if (kitchenId) {
      const [rows] = await db.execute('SELECT * FROM schools WHERE kitchen_id = ? ORDER BY created_at DESC', [kitchenId]);
      return rows;
    }
    const [rows] = await db.execute('SELECT s.*, k.kitchen_name FROM schools s LEFT JOIN kitchens k ON s.kitchen_id = k.id ORDER BY s.created_at DESC');
    return rows;
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM schools WHERE id = ?', [id]);
    return rows[0];
  }

  async create(schoolData) {
    const { school_name, target_group, total_beneficiaries, total_teachers, large_portion_count, small_portion_count, location_address, kitchen_id, siswa_laki_laki, siswa_perempuan, guru_laki_laki, guru_perempuan } = schoolData;
    const [result] = await db.execute(
      'INSERT INTO schools (school_name, target_group, total_beneficiaries, total_teachers, large_portion_count, small_portion_count, location_address, kitchen_id, siswa_laki_laki, siswa_perempuan, guru_laki_laki, guru_perempuan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [school_name, target_group, total_beneficiaries || 0, total_teachers || 0, large_portion_count || 0, small_portion_count || 0, location_address, kitchen_id || null, siswa_laki_laki || 0, siswa_perempuan || 0, guru_laki_laki || 0, guru_perempuan || 0]
    );
    return { id: result.insertId, ...schoolData };
  }

  async update(id, school) {
    const { school_name, target_group, total_beneficiaries, total_teachers, large_portion_count, small_portion_count, location_address, kitchen_id, siswa_laki_laki, siswa_perempuan, guru_laki_laki, guru_perempuan } = school;
    await db.execute(
      'UPDATE schools SET school_name = ?, target_group = ?, total_beneficiaries = ?, total_teachers = ?, large_portion_count = ?, small_portion_count = ?, location_address = ?, kitchen_id = ?, siswa_laki_laki = ?, siswa_perempuan = ?, guru_laki_laki = ?, guru_perempuan = ? WHERE id = ?',
      [school_name, target_group, total_beneficiaries || 0, total_teachers || 0, large_portion_count || 0, small_portion_count || 0, location_address, kitchen_id || null, siswa_laki_laki || 0, siswa_perempuan || 0, guru_laki_laki || 0, guru_perempuan || 0, id]
    );
  }

  async delete(id) {
    await db.execute('DELETE FROM schools WHERE id = ?', [id]);
  }
}

module.exports = new SchoolRepository();
