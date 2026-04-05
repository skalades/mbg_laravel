const menuService = require('../services/menuService');
const masterMenuRepository = require('../repositories/masterMenuRepository');

exports.checkAllergies = async (req, res) => {
  const { school_id, items } = req.body;
  
  if (!school_id || !items) {
    return res.status(400).json({ message: 'School ID and items are required' });
  }

  try {
    const warnings = await menuService.checkAllergies(school_id, items);
    res.json({ warnings });
  } catch (error) {
    res.status(500).json({ message: 'Error checking allergies', error: error.message });
  }
};

exports.createDailyMenu = async (req, res) => {
  const { school_id, menu_date, master_menu_id, buffer_portions, organoleptic_portions, items } = req.body;
  const created_by = req.user?.id;

  if (!school_id || !menu_date || !items || !created_by) {
    console.error('❌ Missing required menu data:', { school_id, menu_date, itemCount: items?.length, created_by });
    return res.status(400).json({ message: 'Missing required menu data or user session is invalid' });
  }

  try {
    const result = await menuService.createDailyMenu({
      school_id,
      menu_date,
      master_menu_id,
      buffer_portions: parseInt(buffer_portions) || 0,
      organoleptic_portions: parseInt(organoleptic_portions) || 2,
      items,
      created_by
    });
    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Create Daily Menu Error:', error);
    res.status(500).json({ 
      message: 'Gagal mengirim menu ke dapur. Cek kelengkapan data.', 
      error: error.message 
    });
  }
};

exports.getMasterMenus = async (req, res) => {
  try {
    const menus = await masterMenuRepository.getAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching master menus' });
  }
};

exports.getMasterMenuDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const menu = await masterMenuRepository.getById(id);
        if (!menu) return res.status(404).json({ message: 'Master menu not found' });
        
        const items = await masterMenuRepository.getItemsByMasterMenuId(id);
        res.json({ ...menu, items });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching master menu details' });
    }
};

exports.createMasterMenu = async (req, res) => {
  const { menu_name, target_group, items } = req.body;
  const created_by = req.user.id;

  if (!menu_name || !target_group || !items) {
    return res.status(400).json({ message: 'Menu name, target group, and items are required' });
  }

  const db = require('../config/db');
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [mResult] = await connection.execute(
      'INSERT INTO master_menus (menu_name, target_group, created_by) VALUES (?, ?, ?)',
      [menu_name, target_group, created_by]
    );
    const masterMenuId = mResult.insertId;

    for (const item of items) {
      const { food_item_id, portion_name, weight_small, weight_large, unit_name, unit_quantity } = item;
      await connection.execute(
        'INSERT INTO master_menu_items (master_menu_id, food_item_id, portion_name, weight_small, weight_large, unit_name, unit_quantity) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [masterMenuId, food_item_id, portion_name, weight_small || 0, weight_large || 0, unit_name, unit_quantity]
      );
    }

    await connection.commit();
    res.status(201).json({ 
      message: 'Master menu template created successfully', 
      masterMenuId 
    });
  } catch (error) {
    await connection.rollback();
    console.error('❌ Template Save Error:', error);
    res.status(500).json({ 
      message: 'Gagal menyimpan templat. Silakan cek koneksi database.', 
      error: error.message 
    });
  } finally {
    connection.release();
  }
};

exports.deleteMasterMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const success = await masterMenuRepository.deleteById(id);
    if (!success) {
      return res.status(404).json({ message: 'Templat menu tidak ditemukan atau sudah terhapus.' });
    }
    res.json({ message: 'Templat menu berhasil dihapus.' });
  } catch (error) {
    console.error('❌ Delete Master Menu Error:', error);
    res.status(500).json({ message: 'Gagal menghapus templat menu.', error: error.message });
  }
};

exports.getDailyMenus = async (req, res) => {
  const { date } = req.query;
  try {
    const menus = await menuService.getDailyMenus(date, req.kitchenId);
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily menus' });
  }
};

exports.getDailyMenuDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const menu = await menuService.getDailyMenuById(id);
    if (!menu) return res.status(404).json({ message: 'Daily menu not found' });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily menu details' });
  }
};

exports.submitAudit = async (req, res) => {
  const { id } = req.params;
  const auditData = req.body;
  try {
    const result = await menuService.submitAudit(id, auditData);
    res.json({ message: 'Audit submitted successfully', menu: result });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting audit', error: error.message });
  }
};

exports.getDailyLogisticsSummary = async (req, res) => {
  const { date } = req.query;
  try {
    const summary = await menuService.getDailyLogisticsSummary(date, req.kitchenId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logistics summary', error: error.message });
  }
};

