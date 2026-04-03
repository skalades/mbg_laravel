const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nutrizi',
});

async function migrate() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to database.');

    // 1. Add missing columns to daily_menu_items
    console.log('--- migrating daily_menu_items ---');
    try {
      await connection.execute(`
        ALTER TABLE daily_menu_items 
        ADD COLUMN weight_small DECIMAL(10,2) DEFAULT 0 AFTER portion_name,
        ADD COLUMN weight_large DECIMAL(10,2) DEFAULT 0 AFTER weight_small,
        MODIFY COLUMN raw_weight_gram DECIMAL(10,2) NULL,
        MODIFY COLUMN total_raw_weight_gram DECIMAL(10,2) NULL;
      `);
      console.log('✅ daily_menu_items updated.');
    } catch (e) {
      console.log('⚠️ daily_menu_items already updated or failed:', e.message);
    }

    // 2. Add missing columns to master_menu_items
    console.log('--- migrating master_menu_items ---');
    try {
      await connection.execute(`
        ALTER TABLE master_menu_items 
        ADD COLUMN weight_small DECIMAL(10,2) DEFAULT 0 AFTER portion_name,
        ADD COLUMN weight_large DECIMAL(10,2) DEFAULT 0 AFTER weight_small,
        MODIFY COLUMN raw_weight_gram DECIMAL(10,2) NULL;
      `);
      console.log('✅ master_menu_items updated.');
    } catch (e) {
      console.log('⚠️ master_menu_items already updated or failed:', e.message);
    }

    connection.release();
    console.log('🚀 Items migration successful.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
