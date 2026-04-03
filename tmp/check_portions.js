const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nutrizi_db',
});

async function checkPortions() {
  const [rows] = await pool.execute('SELECT * FROM portions');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

checkPortions();
