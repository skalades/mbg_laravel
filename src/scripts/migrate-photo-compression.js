const db = require('../config/db');

const migrate = async () => {
  console.log('🚀 Migrating daily_menus for Photo Compression support...');
  
  const queries = [
    // Change foto_menu_url from TEXT to LONGTEXT to support Base64 images without truncation
    `ALTER TABLE daily_menus MODIFY COLUMN foto_menu_url LONGTEXT NULL`
  ];

  try {
    const [rows] = await db.query('SELECT DATABASE() as db_name');
    console.log(`📡 Connected to database: ${rows[0].db_name}`);

    for (const query of queries) {
      console.log(`⏳ Executing: ${query}...`);
      await db.execute(query);
    }
    
    console.log('✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
