const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    const [rows] = await connection.execute('DESCRIBE daily_menus');
    console.log('--- daily_menus structure ---');
    console.table(rows);
    
    const [schoolRows] = await connection.execute('DESCRIBE schools');
    console.log('--- schools structure ---');
    console.table(schoolRows);
  } catch (err) {
    console.error(err.message);
  } finally {
    await connection.end();
  }
}

check();
