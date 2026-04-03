const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nutrizi_db',
});

async function migrate() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to database.');

    // 1. Add missing columns
    console.log('--- Adding portion_count columns to schools ---');
    await connection.execute(`
      ALTER TABLE schools 
      ADD COLUMN large_portion_count INT DEFAULT 0 AFTER total_teachers,
      ADD COLUMN small_portion_count INT DEFAULT 0 AFTER large_portion_count;
    `);
    console.log('✅ Columns added.');

    // 2. Remove legacy columns (if they exist)
    console.log('--- Removing legacy calorie targets ---');
    try {
      await connection.execute(`ALTER TABLE schools DROP COLUMN calorie_target_min;`);
      await connection.execute(`ALTER TABLE schools DROP COLUMN calorie_target_max;`);
      console.log('✅ Legacy columns removed.');
    } catch (e) {
      console.log('⚠️ Legacy columns already removed or not found.');
    }

    connection.release();
    console.log('🚀 Migration successful.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

migrate();
