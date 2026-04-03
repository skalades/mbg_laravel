const db = require('../config/db');

const migrate = async () => {
  console.log('🚀 Migrating Daily Menus table for Kitchen-Ready Dashboard...');
  
  const queries = [
    // Update ENUM for Status to support production workflow
    // Ensure status column exists and has the correct ENUM values
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS status ENUM('DRAFT', 'PRODUKSI', 'SIAP_AUDIT', 'DISETUJUI', 'DIPUBLIKASIKAN') DEFAULT 'DRAFT'`,
    `ALTER TABLE daily_menus MODIFY COLUMN status ENUM('DRAFT', 'PRODUKSI', 'SIAP_AUDIT', 'DISETUJUI', 'DIPUBLIKASIKAN') DEFAULT 'DRAFT'`,
    
    // Ensure audit fields exist (idempotent)
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS organoleptic_status ENUM('TERTUNDA', 'LULUS', 'GAGAL') DEFAULT 'TERTUNDA'`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS warna_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS aroma_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS tekstur_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS rasa_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS suhu_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS catatan_qc TEXT`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS foto_menu_url TEXT`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS tanda_tangan_digital LONGTEXT`
  ];

  try {
    const connection = await db.getConnection();
    try {
      for (const query of queries) {
        console.log(`⏳ Executing: ${query.substring(0, 60)}...`);
        await connection.execute(query);
      }
      console.log('✅ Migration Kitchen-Ready completed successfully!');
    } finally {
      connection.release();
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
