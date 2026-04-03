const masterMenuRepository = require('../repositories/masterMenuRepository');
const dailyMenuRepository = require('../repositories/dailyMenuRepository');
const studentProfileRepository = require('../repositories/studentProfileRepository');
const schoolRepository = require('../repositories/schoolRepository');

const menuService = {
  /**
   * Check for allergy conflicts in a school given a list of food item names.
   * Logic: If any food item name (or portion name) contains an allergen matching any student's notes.
   */
  async checkAllergies(schoolId, foodItems) {
    const studentsWithAllergies = await studentProfileRepository.getStudentAllergyMap(schoolId);
    const warnings = [];

    studentsWithAllergies.forEach(student => {
      const studentAllergies = student.allergy_notes.split(',').map(a => a.trim().toLowerCase());
      
      foodItems.forEach(item => {
        const itemLower = (item.name || item.portion_name).toLowerCase();
        
        studentAllergies.forEach(allergy => {
          if (allergy && itemLower.includes(allergy)) {
            warnings.push({
              student_name: student.student_name,
              allergen_match: allergy,
              conflicting_food: item.name || item.portion_name
            });
          }
        });
      });
    });

    return warnings;
  },

  /**
   * Calculate logistics for a daily menu and save with transactions.
   */
  async createDailyMenu(menuData) {
    const { school_id, menu_date, master_menu_id, buffer_portions, organoleptic_portions, items, created_by } = menuData;

    const school = await schoolRepository.findById(school_id);
    if (!school) throw new Error('Sekolah tidak ditemukan di database.');

    const smallCount = parseInt(school.small_portion_count) || 0;
    const largeCount = parseInt(school.large_portion_count) || 0;
    const buffer = parseInt(buffer_portions) || 0;
    const sampling = parseInt(organoleptic_portions) || 2;
    const total_production = smallCount + largeCount + buffer + sampling;

    const db = require('../config/db');
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Create Daily Menu header
      const [dmResult] = await connection.execute(
        'INSERT INTO daily_menus (school_id, menu_date, master_menu_id, total_beneficiaries, buffer_portions, organoleptic_portions, total_production, created_by, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [school_id, menu_date, master_menu_id || null, smallCount + largeCount, buffer, sampling, total_production, created_by || null, 'DRAFT']
      );
      const dailyMenuId = dmResult.insertId;

      // 2. Add Items
      for (const item of items) {
        const wSmall = parseFloat(item.weight_small) || 0;
        const wLarge = parseFloat(item.weight_large) || 0;
        
        // Logistics Calculation: (Small * Count) + (Large * (Count + Buffer + Sampling))
        const totalWeight = (wSmall * smallCount) + (wLarge * (largeCount + buffer + sampling));
        
        await connection.execute(
          'INSERT INTO daily_menu_items (daily_menu_id, food_item_id, portion_name, weight_small, weight_large, unit_name, unit_quantity, total_raw_weight_gram) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [dailyMenuId, item.food_item_id, item.portion_name, wSmall, wLarge, item.unit_name || null, item.unit_quantity || null, totalWeight]
        );
      }

      await connection.commit();
      
      return {
        id: dailyMenuId,
        message: 'Menu berhasil dikirim ke dapur',
        logistics: { smallCount, largeCount, buffer, sampling, total_production }
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  async getDailyMenus(date) {
    return await dailyMenuRepository.getAllWithDetails(date);
  },

  async getDailyMenuById(id) {
    const menu = await dailyMenuRepository.getById(id);
    if (!menu) return null;
    
    const items = await dailyMenuRepository.getItemsByDailyMenuId(id);
    const school = await schoolRepository.findById(menu.school_id);
    
    return { 
      ...menu, 
      items, 
      school_name: school?.school_name,
      school: school || null
    };
  },

  async submitAudit(id, auditData) {
    return await dailyMenuRepository.updateAudit(id, auditData);
  },

  async getDailyLogisticsSummary(date) {
    const targetDate = date || new Date().toISOString().split('T')[0];
    return await dailyMenuRepository.getDailyLogisticsSummary(targetDate);
  }
};

module.exports = menuService;
