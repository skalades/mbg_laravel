const db = require('../config/db');

const migrate = async () => {
  console.log('🚀 Upgrading column sizes for images/signatures...');
  
  const queries = [
    // Change foto_menu_url to LONGTEXT (from TEXT which was 64KB)
    `ALTER TABLE daily_menus MODIFY COLUMN foto_menu_url LONGTEXT`,
    // Ensure tanda_tangan_digital is also LONGTEXT
    `ALTER TABLE daily_menus MODIFY COLUMN tanda_tangan_digital LONGTEXT`
  ];

  try {
    const connection = await db.getConnection();
    try {
      for (const query of queries) {
        console.log(`⏳ Executing: ${query}...`);
        await connection.execute(query);
      }
      console.log('✅ Migration completed successfully!');
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
