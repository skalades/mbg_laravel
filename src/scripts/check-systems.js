const mysql = require('mysql2/promise');
const { createClient } = require('redis');
const dotenv = require('dotenv');
const path = require('path');

// Load environment from root
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function checkSystems() {
  console.log('\n🔍 --- NUTRIZI SYSTEM DIAGNOSTIC ---');
  console.log('Time:', new Date().toLocaleString());
  console.log('Environment:', process.env.NODE_ENV || 'Not Set');
  console.log('------------------------------------\n');

  // 1. Check Port
  const port = process.env.PORT || 3000;
  console.log(`📡 [SERVER] Configured Port: ${port}`);

  // 2. Check Database
  console.log('🗄️ [DATABASE] Checking connection...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    console.log('✅ [DATABASE] Connection: SUCCESS');
    const [rows] = await connection.execute('SELECT 1 + 1 AS result');
    console.log('✅ [DATABASE] Query Test: SUCCESS (Result: 2)');
    await connection.end();
  } catch (err) {
    console.error('❌ [DATABASE] Connection: FAILED');
    console.error(`   Error message: ${err.message}`);
    console.log('   💡 TIP: Check your DB_USER, DB_PASS, and DB_NAME in the .env file.');
  }

  // 3. Check Redis
  console.log('\n⚡ [REDIS] Checking connection...');
  const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
  const redisClient = createClient({ url: redisUrl });
  
  try {
    await redisClient.connect();
    console.log('✅ [REDIS] Connection: SUCCESS');
    await redisClient.set('health-check-test', 'ok');
    const val = await redisClient.get('health-check-test');
    console.log(`✅ [REDIS] Write/Read Test: SUCCESS (Value: ${val})`);
    await redisClient.quit();
  } catch (err) {
    console.error('❌ [REDIS] Connection: FAILED');
    console.error(`   Error message: ${err.message}`);
    console.log('   💡 TIP: Make sure Redis/Memurai is running on the VPS.');
  }

  // 4. Check JWT Secret
  console.log('\n🔒 [SECURITY] Checking JWT Configuration...');
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length > 20) {
    console.log('✅ [SECURITY] JWT_SECRET: Valid and secure length');
  } else {
    console.log('⚠️ [SECURITY] JWT_SECRET: Too short or not set!');
  }

  console.log('\n------------------------------------');
  console.log('🏁 Diagnostic Complete.');
  console.log('------------------------------------\n');
  process.exit(0);
}

checkSystems().catch(err => {
  console.error('CRITICAL DIAGNOSTIC ERROR:', err);
  process.exit(1);
});
