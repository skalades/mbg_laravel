const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    const [dbs] = await c.execute('SHOW DATABASES');
    const dbNames = dbs.map(d => d.Database);
    console.log('Databases:', dbNames);

    for (const dbName of ['nutrizi', 'nutrizi_db']) {
      if (dbNames.includes(dbName)) {
        console.log(`\nTables in ${dbName}:`);
        const [tabs] = await c.execute(`SHOW TABLES FROM ${dbName}`);
        console.log(tabs.map(t => Object.values(t)[0]));
      }
    }
  } catch (err) {
    console.error(err.message);
  } finally {
    await c.end();
  }
}

check();
