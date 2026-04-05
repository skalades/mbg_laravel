const db = require('../config/db');

class KitchenRepository {
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM kitchens ORDER BY created_at DESC');
    return rows;
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM kitchens WHERE id = ?', [id]);
    return rows[0];
  }

  async create(kitchen) {
    const { kitchen_name, address } = kitchen;
    const [result] = await db.execute(
      'INSERT INTO kitchens (kitchen_name, address) VALUES (?, ?)',
      [kitchen_name, address]
    );
    return result.insertId;
  }

  async update(id, kitchen) {
    const { kitchen_name, address } = kitchen;
    await db.execute(
      'UPDATE kitchens SET kitchen_name = ?, address = ? WHERE id = ?',
      [kitchen_name, address, id]
    );
  }

  async delete(id) {
    await db.execute('DELETE FROM kitchens WHERE id = ?', [id]);
  }

  async findSchoolsByKitchenId(kitchenId) {
    const [rows] = await db.execute('SELECT * FROM schools WHERE kitchen_id = ?', [kitchenId]);
    return rows;
  }

  async findNutritionistsByKitchenId(kitchenId) {
    const [rows] = await db.execute(
      'SELECT id, username, role FROM users WHERE kitchen_id = ? AND role = "NUTRITIONIST"',
      [kitchenId]
    );
    return rows;
  }
}

module.exports = new KitchenRepository();
