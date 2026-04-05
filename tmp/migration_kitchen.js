const db = require('../src/config/db');

const migrate = async () => {
  console.log('🚀 Migrating database for Kitchen Support...');
  
  const queries = [
    `CREATE TABLE IF NOT EXISTS kitchens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        kitchen_name VARCHAR(100) NOT NULL,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS kitchen_id INT NULL;`,
    `ALTER TABLE users ADD FOREIGN KEY IF NOT EXISTS (kitchen_id) REFERENCES kitchens(id) ON DELETE SET NULL;`,
    `ALTER TABLE schools ADD COLUMN IF NOT EXISTS kitchen_id INT NULL;`,
    `ALTER TABLE schools ADD FOREIGN KEY IF NOT EXISTS (kitchen_id) REFERENCES kitchens(id) ON DELETE SET NULL;`
  ];

  for (const query of queries) {
    try {
      console.log(`⏳ Executing: ${query.split('\n')[0]}...`);
      await db.execute(query);
      console.log('✅ Success');
    } catch (err) {
      console.error(`❌ Error executing query: ${err.message}`);
    }
  }

  console.log('✅ Migration completed!');
  process.exit(0);
};

migrate();
