require('dotenv').config();
const db = require('../config/db');

async function migrate() {
  const connection = await db.getConnection();

  try {
    console.log('Menambahkan kolom suhu_pemasakan dan suhu_distribusi...');

    await connection.query(`
      ALTER TABLE daily_menus 
      ADD COLUMN suhu_pemasakan DECIMAL(5,2) NULL DEFAULT NULL AFTER rasa_skor,
      ADD COLUMN suhu_distribusi DECIMAL(5,2) NULL DEFAULT NULL AFTER suhu_pemasakan;
    `);

    console.log('✅ Migrasi suhu QC berhasil');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
       console.log('⚠️ Kolom sudah ada di tabel daily_menus, migrasi dilewati.');
    } else {
       console.error('❌ Error migrasi:', error.message);
    }
  } finally {
    connection.release();
    process.exit(0);
  }
}

migrate();
