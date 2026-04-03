const db = require('../config/db');

const dailyMenuRepository = {
  async create(menuData) {
    const { school_id, menu_date, master_menu_id, total_beneficiaries, buffer_portions, organoleptic_portions, total_production, created_by } = menuData;
    const [result] = await db.execute(
      'INSERT INTO daily_menus (school_id, menu_date, master_menu_id, total_beneficiaries, buffer_portions, organoleptic_portions, total_production, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [school_id, menu_date, master_menu_id, total_beneficiaries, buffer_portions, organoleptic_portions, total_production, created_by]
    );
    return { id: result.insertId, ...menuData };
  },

  async addItems(dailyMenuId, items) {
      const results = [];
      for (const item of items) {
          const { food_item_id, portion_name, weight_small, weight_large, unit_name, unit_quantity } = item;
          const [result] = await db.execute(
              'INSERT INTO daily_menu_items (daily_menu_id, food_item_id, portion_name, weight_small, weight_large, unit_name, unit_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [dailyMenuId, food_item_id, portion_name, weight_small || 0, weight_large || 0, unit_name, unit_quantity]
          );
          results.push({ id: result.insertId, ...item });
      }
      return results;
  },

  async getBySchoolAndDate(schoolId, date) {
    const [rows] = await db.execute('SELECT * FROM daily_menus WHERE school_id = ? AND menu_date = ?', [schoolId, date]);
    return rows[0];
  },

  async getById(id) {
    const [rows] = await db.execute('SELECT * FROM daily_menus WHERE id = ?', [id]);
    return rows[0];
  },

  async getAllWithDetails(date) {
    let query = `
      SELECT dm.*, s.school_name 
      FROM daily_menus dm
      JOIN schools s ON dm.school_id = s.id
    `;
    const params = [];

    if (date) {
      query += ` WHERE dm.menu_date = ? `;
      params.push(date);
    }

    query += ` ORDER BY dm.menu_date DESC`;

    const [rows] = await db.execute(query, params);
    return rows;
  },

  async getItemsByDailyMenuId(dailyMenuId) {
    const [rows] = await db.execute(`
      SELECT dmi.*, fi.name AS food_name, fi.category, 
             fi.energy_kcal, fi.protein_g, fi.fat_g, fi.carbs_g, fi.yield_factor 
      FROM daily_menu_items dmi
      JOIN food_items fi ON dmi.food_item_id = fi.id
      WHERE dmi.daily_menu_id = ?
    `, [dailyMenuId]);
    return rows;
  },

  async updateAudit(id, auditData) {
    const { 
      organoleptic_status, 
      warna_skor, 
      aroma_skor, 
      tekstur_skor, 
      rasa_skor, 
      suhu_skor, 
      suhu_pemasakan,
      suhu_distribusi,
      catatan_qc, 
      foto_menu_url, 
      tanda_tangan_digital,
      status 
    } = auditData;

    await db.execute(
      `UPDATE daily_menus SET 
        organoleptic_status = ?, 
        warna_skor = ?, 
        aroma_skor = ?, 
        tekstur_skor = ?, 
        rasa_skor = ?, 
        suhu_skor = ?, 
        suhu_pemasakan = ?,
        suhu_distribusi = ?,
        catatan_qc = ?, 
        foto_menu_url = ?, 
        tanda_tangan_digital = ?,
        status = ?
      WHERE id = ?`,
      [
        organoleptic_status, 
        warna_skor, 
        aroma_skor, 
        tekstur_skor, 
        rasa_skor, 
        suhu_skor, 
        suhu_pemasakan !== undefined ? suhu_pemasakan : null,
        suhu_distribusi !== undefined ? suhu_distribusi : null,
        catatan_qc, 
        foto_menu_url, 
        tanda_tangan_digital,
        status,
        id
      ]
    );
    return this.getById(id);
  },

  async getDailyLogisticsSummary(date) {
    const [rows] = await db.execute(`
      SELECT 
        fi.name AS food_name, 
        fi.category, 
        dmi.unit_name, 
        SUM(dmi.total_raw_weight_gram) AS total_weight_gram
      FROM daily_menu_items dmi
      JOIN daily_menus dm ON dmi.daily_menu_id = dm.id
      JOIN food_items fi ON dmi.food_item_id = fi.id
      WHERE dm.menu_date = ?
      GROUP BY fi.id, dmi.unit_name
      ORDER BY total_weight_gram DESC
    `, [date]);
    return rows;
  }
};

module.exports = dailyMenuRepository;
