const fs = require('fs');
const path = require('path');
const db = require('../config/db');

const initializeDatabase = async () => {
  console.log('🚀 Initializing Nutrizi Database Schema...');
  
  try {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Splitting by semicolon but ignoring comments and empty results
    const queries = schemaSql
      .split(';')
      .map(query => {
        // Remove multiline comments and single line comments
        return query
          .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '')
          .trim();
      })
      .filter(query => query.length > 0);

    console.log(`📑 Found ${queries.length} queries to execute.`);

    const connection = await db.getConnection();
    try {
      for (let i = 0; i < queries.length; i++) {
        const query = queries[i];
        if (query.toUpperCase().startsWith('CREATE DATABASE') || query.toUpperCase().startsWith('USE')) {
          console.log(`⏩ Skipping system query: ${query.split('\n')[0]}...`);
          continue;
        }
        console.log(`⏳ Executing query ${i + 1}/${queries.length}...`);
        await connection.execute(query);
      }
      console.log('✅ Database schema initialized successfully!');
    } finally {
      connection.release();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
};

initializeDatabase();
