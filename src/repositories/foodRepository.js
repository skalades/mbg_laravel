const db = require('../config/db');

class FoodRepository {
  async getAll(limit = 100) {
    const [rows] = await db.execute('SELECT * FROM food_items ORDER BY id DESC LIMIT ?', [limit]);
    return rows;
  }

  async searchByName(name) {
    const [rows] = await db.execute('SELECT * FROM food_items WHERE name LIKE ?', [`%${name}%`]);
    return rows;
  }

  async findById(id) {
    const [rows] = await db.execute('SELECT * FROM food_items WHERE id = ?', [id]);
    return rows[0];
  }

  async getConversionsByFoodId(foodId) {
    const [rows] = await db.execute('SELECT * FROM food_conversions WHERE food_item_id = ?', [foodId]);
    return rows;
  }

  async create(foodData) {
    const { name, category, energy_kcal, protein_g, fat_g, carbs_g, yield_factor } = foodData;
    const [result] = await db.execute(
      'INSERT INTO food_items (name, category, energy_kcal, protein_g, fat_g, carbs_g, yield_factor) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, category, energy_kcal, protein_g, fat_g, carbs_g, yield_factor || 1.00]
    );
    return { id: result.insertId, ...foodData };
  }

  async update(id, foodData) {
    const { name, category, energy_kcal, protein_g, fat_g, carbs_g, yield_factor } = foodData;
    await db.execute(
      'UPDATE food_items SET name = ?, category = ?, energy_kcal = ?, protein_g = ?, fat_g = ?, carbs_g = ?, yield_factor = ? WHERE id = ?',
      [name, category, energy_kcal, protein_g, fat_g, carbs_g, yield_factor || 1.00, id]
    );
  }

  async delete(id) {
    await db.execute('DELETE FROM food_items WHERE id = ?', [id]);
  }

  async addConversion(convData) {
    const { food_item_id, unit_name, weight_gram_standard } = convData;
    await db.execute(
      'INSERT INTO food_conversions (food_item_id, unit_name, weight_gram_standard) VALUES (?, ?, ?)',
      [food_item_id, unit_name, weight_gram_standard]
    );
  }
}

module.exports = new FoodRepository();

