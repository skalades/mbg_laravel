const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nutrizi',
});

async function checkPortionConfigs() {
  const [rows] = await pool.execute('SELECT * FROM portion_configs');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

checkPortionConfigs();
