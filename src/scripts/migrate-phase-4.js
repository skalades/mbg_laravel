const db = require('../config/db');

const migrate = async () => {
  console.log('🚀 Migrating Daily Menus table for Phase 4...');
  
  const queries = [
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS organoleptic_status ENUM('TERTUNDA', 'LULUS', 'GAGAL') DEFAULT 'TERTUNDA'`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS warna_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS aroma_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS tekstur_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS rasa_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS suhu_skor INT DEFAULT 0`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS catatan_qc TEXT`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS foto_menu_url TEXT`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS tanda_tangan_digital LONGTEXT`,
    `ALTER TABLE daily_menus ADD COLUMN IF NOT EXISTS status ENUM('DRAFT', 'DISETUJUI', 'DIPUBLIKASIKAN') DEFAULT 'DRAFT'`
  ];

  try {
    const connection = await db.getConnection();
    try {
      for (const query of queries) {
        console.log(`⏳ Executing: ${query.substring(0, 50)}...`);
        await connection.execute(query);
      }
      console.log('✅ Migration Phase 4 completed successfully!');
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
