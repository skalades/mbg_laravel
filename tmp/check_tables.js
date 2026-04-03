const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nutrizi',
});

async function checkTables() {
  const [rows] = await pool.execute('SHOW TABLES');
  console.log(JSON.stringify(rows, null, 2));
  process.exit(0);
}

checkTables();
