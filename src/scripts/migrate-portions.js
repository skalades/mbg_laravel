require('dotenv').config();
const db = require('../config/db');

async function migrate() {
  const connection = await db.getConnection();

  try {
    console.log('⏳ Memulai Migrasi Skema Porsi Ganda (Kecil & Besar)...');

    // 1. Modifikasi tabel `schools`
    console.log('[1/3] Menyesuaikan tabel schools...');
    try {
      await connection.query(`
        ALTER TABLE schools 
        ADD COLUMN small_portion_count INT DEFAULT 0 AFTER total_beneficiaries,
        ADD COLUMN large_portion_count INT DEFAULT 0 AFTER small_portion_count;
      `);
      console.log('✅ schools berhasil di-update.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') console.log('⚠️ Kolom porsi sudah ada di schools.');
      else throw e;
    }

    // 2. Modifikasi tabel `master_menu_items`
    console.log('[2/3] Menyesuaikan tabel master_menu_items...');
    try {
      await connection.query(`
        ALTER TABLE master_menu_items 
        CHANGE COLUMN raw_weight_gram weight_small DECIMAL(10,2) NOT NULL DEFAULT 0,
        ADD COLUMN weight_large DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER weight_small;
      `);
      console.log('✅ master_menu_items berhasil di-update.');
    } catch (e) {
      if (e.code === 'ER_BAD_FIELD_ERROR') console.log('⚠️ Kolom raw_weight_gram mungkin sudah dihapus di master_menu_items.');
      else if (e.code === 'ER_DUP_FIELDNAME') console.log('⚠️ Kolom weight_large sudah ada di master_menu_items.');
      else throw e;
    }

    // 3. Modifikasi tabel `daily_menu_items`
    console.log('[3/3] Menyesuaikan tabel daily_menu_items...');
    try {
      await connection.query(`
        ALTER TABLE daily_menu_items 
        CHANGE COLUMN raw_weight_gram weight_small DECIMAL(10,2) NOT NULL DEFAULT 0,
        ADD COLUMN weight_large DECIMAL(10,2) NOT NULL DEFAULT 0 AFTER weight_small;
      `);
      console.log('✅ daily_menu_items berhasil di-update.');
    } catch (e) {
      if (e.code === 'ER_BAD_FIELD_ERROR') console.log('⚠️ Kolom raw_weight_gram mungkin sudah dihapus di daily_menu_items.');
      else if (e.code === 'ER_DUP_FIELDNAME') console.log('⚠️ Kolom weight_large sudah ada di daily_menu_items.');
      else throw e;
    }

    console.log('🚀 Migrasi database selesai!');

  } catch (error) {
    console.error('❌ Error fatal migrasi:', error);
  } finally {
    connection.release();
    process.exit(0);
  }
}

migrate();
