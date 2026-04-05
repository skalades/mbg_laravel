const db = require('../config/db');

const dashboardRepository = {
  /**
   * Get overall summary stats, filtered by period for time-sensitive data.
   * @param {string} period - 'daily', 'weekly', 'monthly'
   */
  async getSummaryStats(period, kitchenId = null) {
    let dateFilter = '';
    if (period === 'daily') {
      dateFilter = 'AND menu_date = CURDATE()';
    } else if (period === 'weekly') {
      dateFilter = 'AND YEARWEEK(menu_date, 1) = YEARWEEK(CURDATE(), 1)';
    } else if (period === 'monthly') {
      dateFilter = 'AND MONTH(menu_date) = MONTH(CURDATE()) AND YEAR(menu_date) = YEAR(CURDATE())';
    }

    const params = [];
    let kitchenFilter = '';
    if (kitchenId) {
      kitchenFilter = 'WHERE kitchen_id = ?';
      params.push(kitchenId);
    }

    // 1. Basic counts (Always current total)
    const [schoolStats] = await db.execute(`SELECT COUNT(*) as activeSchools, SUM(total_beneficiaries) as totalStudents FROM schools ${kitchenFilter}`, params);
    
    // 2. Published menus in period
    let menuKitchenFilter = '';
    const menuParams = [period === 'daily' || period === 'weekly' || period === 'monthly' ? undefined : undefined].filter(x => x !== undefined); // placeholder
    
    // Better way: Join with schools to filter daily_menus by kitchen_id
    const [menuStats] = await db.execute(`
      SELECT COUNT(dm.id) as publishedMenus 
      FROM daily_menus dm
      JOIN schools s ON dm.school_id = s.id
      WHERE dm.status = 'PUBLISHED' 
      ${dateFilter}
      ${kitchenId ? 'AND s.kitchen_id = ?' : ''}
    `, kitchenId ? [kitchenId] : []);
    
    // 3. QC Pass Rate
    const [qcStats] = await db.execute(`
      SELECT 
        COUNT(dm.id) as totalAudits,
        SUM(CASE WHEN dm.status = 'DISETUJUI' THEN 1 ELSE 0 END) as passedAudits,
        AVG((dm.warna_skor + dm.aroma_skor + dm.tekstur_skor + dm.rasa_skor + dm.suhu_skor) / 5) * 20 as avgScorePercent
      FROM daily_menus dm
      JOIN schools s ON dm.school_id = s.id
      WHERE dm.status IN ('DISETUJUI', 'BUTUH_PERBAIKAN') 
      ${dateFilter}
      ${kitchenId ? 'AND s.kitchen_id = ?' : ''}
    `, kitchenId ? [kitchenId] : []);

    return {
      activeSchools: schoolStats[0].activeSchools || 0,
      totalStudents: schoolStats[0].totalStudents || 0,
      publishedMenus: menuStats[0].publishedMenus || 0,
      qcScore: Math.round(qcStats[0].avgScorePercent || 0),
      passedAudits: qcStats[0].passedAudits || 0
    };
  },

  /**
   * Get recent activities from multiple sources.
   */
  async getRecentActivity(limit = 5, kitchenId = null) {
    const params = kitchenId ? [kitchenId, limit] : [limit];
    const kitchenFilter = kitchenId ? 'AND s.kitchen_id = ?' : '';

    const [menuActivities] = await db.execute(`
      SELECT 
        'MENU_PUBLISHED' as type,
        dm.id,
        dm.menu_date as activity_date,
        s.school_name as title,
        CONCAT('Menu ', dm.status, ' untuk sekolah ini.') as description,
        dm.created_at
      FROM daily_menus dm
      JOIN schools s ON dm.school_id = s.id
      WHERE 1=1 ${kitchenFilter}
      ORDER BY dm.created_at DESC
      LIMIT ?
    `, params);

    const [schoolActivities] = await db.execute(`
      SELECT 
        'SCHOOL_ADDED' as type,
        id,
        created_at as activity_date,
        school_name as title,
        'Sekolah baru telah ditambahkan ke sistem.' as description,
        created_at
      FROM schools s
      WHERE 1=1 ${kitchenId ? 'AND s.kitchen_id = ?' : ''}
      ORDER BY created_at DESC
      LIMIT ?
    `, params);

    // Combine and sort by created_at
    const combined = [...menuActivities, ...schoolActivities]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    return combined;
  },

  /**
   * Get today's upcoming menu.
   */
  async getTodaySchedule(kitchenId = null) {
    const [rows] = await db.execute(`
      SELECT dm.*, s.school_name, mm.menu_name
      FROM daily_menus dm
      JOIN schools s ON dm.school_id = s.id
      LEFT JOIN master_menus mm ON dm.master_menu_id = mm.id
      WHERE dm.menu_date = CURDATE()
      ${kitchenId ? 'AND s.kitchen_id = ?' : ''}
      LIMIT 1
    `, kitchenId ? [kitchenId] : []);
    
    if (rows.length === 0) return null;

    // Get items for this menu
    const [items] = await db.execute(`
      SELECT portion_name, unit_name, unit_quantity 
      FROM daily_menu_items 
      WHERE daily_menu_id = ?
    `, [rows[0].id]);

    return { ...rows[0], items };
  },

  /**
   * Get allergy alerts for today.
   */
  async getAllergyAlerts(kitchenId = null) {
    // Cross-reference today's menu items with student allergy profiles
    const [rows] = await db.execute(`
      SELECT 
        COUNT(DISTINCT sp.id) as studentCount
      FROM daily_menus dm
      JOIN daily_menu_items dmi ON dm.id = dmi.daily_menu_id
      JOIN student_profiles sp ON dm.school_id = sp.school_id
      JOIN schools s ON dm.school_id = s.id
      WHERE dm.menu_date = CURDATE()
      ${kitchenId ? 'AND s.kitchen_id = ?' : ''}
      AND (
        LOWER(dmi.portion_name) LIKE CONCAT('%', LOWER(sp.allergy_notes), '%')
        OR LOWER(sp.allergy_notes) LIKE CONCAT('%', LOWER(dmi.portion_name), '%')
      )
    `, kitchenId ? [kitchenId] : []);
    
    return rows[0].studentCount || 0;
  }
};

module.exports = dashboardRepository;
