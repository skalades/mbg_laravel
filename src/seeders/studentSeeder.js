const db = require('../config/db');

const seedStudents = async () => {
  console.log('🌱 Seeding student profiles...');
  const connection = await db.getConnection();
  try {
    // 1. Get first school ID
    const [schools] = await connection.execute('SELECT id FROM schools LIMIT 1');
    if (schools.length === 0) {
      console.log('❌ No school found. Run school seeder first or insert a school manually.');
      process.exit(1);
    }
    const schoolId = schools[0].id;

    // 2. Insert dummy student profile with egg allergy
    await connection.execute(`
      INSERT INTO student_profiles (school_id, student_name, allergy_notes, last_bb, last_tb) 
      VALUES (?, ?, ?, ?, ?)
    `, [schoolId, 'Budi Santoso', 'Telur, Seafood', 30.5, 120.0]);

    console.log(`✅ successfully inserted Budi Santoso with allergy: Telur, Seafood to school ${schoolId}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding students:', error);
    process.exit(1);
  } finally {
    connection.release();
  }
};

seedStudents();
