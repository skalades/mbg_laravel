const db = require('../config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
  console.log('🌱 Seeding administrative account...');
  try {
    // Check if admin exists
    const [existingAdmin] = await db.execute('SELECT id FROM users WHERE role = ?', ['ADMIN']);
    
    if (existingAdmin.length > 0) {
      console.log('⚠️ Admin user already exists. Skipping...');
      process.exit(0);
    }

    const username = process.env.INITIAL_ADMIN_USERNAME || 'admin_nutrizi';
    const password = process.env.INITIAL_ADMIN_PASSWORD || 'Nutrizi123!';
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await db.execute(
      'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, passwordHash, 'ADMIN']
    );

    console.log(`✅ Admin account created: ${username}`);
    console.log(`🔑 Initial password: ${password} (Change this immediately!)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Admin seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
