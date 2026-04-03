const db = require('../config/db');

const seedSchools = async () => {
    console.log('🌱 Seeding schools...');
    const connection = await db.getConnection();
    try {
        await connection.execute(`
            INSERT INTO schools (school_name, target_group, total_beneficiaries, location, calorie_target_min, calorie_target_max) 
            VALUES ('SDN 1 Jakarta', 'SD', 150, 'Jakarta', 600, 800)
        `);
        console.log('✅ successfully inserted SDN 1 Jakarta');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding schools:', error);
        process.exit(1);
    } finally {
        connection.release();
    }
};

seedSchools();
