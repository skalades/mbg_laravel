const db = require('../config/db');

const masterMenuRepository = {
  async getAll() {
    const [rows] = await db.execute('SELECT * FROM master_menus');
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute('SELECT * FROM master_menus WHERE id = ?', [id]);
    return rows[0];
  },

  async getItemsByMasterMenuId(masterMenuId) {
    const [rows] = await db.execute('SELECT * FROM master_menu_items WHERE master_menu_id = ?', [masterMenuId]);
    return rows;
  },

  async create(menuData) {
    const { menu_name, target_group, created_by } = menuData;
    const [result] = await db.execute(
      'INSERT INTO master_menus (menu_name, target_group, created_by) VALUES (?, ?, ?)',
      [menu_name, target_group, created_by]
    );
    return { id: result.insertId, ...menuData };
  },

  async addItem(itemId, masterMenuId, itemData) {
      const { food_item_id, portion_name, weight_small, weight_large, unit_name, unit_quantity } = itemData;
      await db.execute(
          'INSERT INTO master_menu_items (master_menu_id, food_item_id, portion_name, weight_small, weight_large, unit_name, unit_quantity) VALUES (?, ?, ?, ?, ?, ?)',
          [masterMenuId, food_item_id, portion_name, weight_small || 0, weight_large || 0, unit_name, unit_quantity]
      );
  },

  async deleteById(id) {
    const [result] = await db.execute('DELETE FROM master_menus WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = masterMenuRepository;
