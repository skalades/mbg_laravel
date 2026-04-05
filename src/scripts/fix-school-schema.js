/**
 * fix-school-schema.js
 * 
 * Migration script to add missing columns to the 'schools' table.
 * These columns are required by Phase 3 (Portion counts, logistics, etc).
 */

const db = require('../config/db');

const fixSchema = async () => {
    console.log('👷 Checking and fixing school table schema...');
    
    try {
        // Add total_teachers
        try {
            await db.execute('ALTER TABLE schools ADD COLUMN total_teachers INT DEFAULT 0 AFTER total_beneficiaries');
            console.log('✅ Added total_teachers');
        } catch (e) { console.log('ℹ️ total_teachers already exists or failed'); }

        // Add large_portion_count
        try {
            await db.execute('ALTER TABLE schools ADD COLUMN large_portion_count INT DEFAULT 0 AFTER total_teachers');
            console.log('✅ Added large_portion_count');
        } catch (e) { console.log('ℹ️ large_portion_count already exists or failed'); }

        // Add small_portion_count
        try {
            await db.execute('ALTER TABLE schools ADD COLUMN small_portion_count INT DEFAULT 0 AFTER large_portion_count');
            console.log('✅ Added small_portion_count');
        } catch (e) { console.log('ℹ️ small_portion_count already exists or failed'); }

        // Add location_address
        try {
            await db.execute('ALTER TABLE schools ADD COLUMN location_address TEXT AFTER small_portion_count');
            console.log('✅ Added location_address');
        } catch (e) { console.log('ℹ️ location_address already exists or failed'); }

        // Add kitchen_id
        try {
            await db.execute('ALTER TABLE schools ADD COLUMN kitchen_id INT AFTER location_address');
            console.log('✅ Added kitchen_id');
        } catch (e) { console.log('ℹ️ kitchen_id already exists or failed'); }

        // Add Gender stats
        const genderCols = [
            'siswa_laki_laki INT DEFAULT 0',
            'siswa_perempuan INT DEFAULT 0',
            'guru_laki_laki INT DEFAULT 0',
            'guru_perempuan INT DEFAULT 0'
        ];

        for (const col of genderCols) {
            try {
                await db.execute(`ALTER TABLE schools ADD COLUMN ${col}`);
                console.log(`✅ Added ${col.split(' ')[0]}`);
            } catch (e) { console.log(`ℹ️ ${col.split(' ')[0]} already exists or failed`); }
        }

        console.log('🚀 School schema update completed.');
        process.exit(0);

    } catch (err) {
        console.error('❌ Schema update failed:', err.message);
        process.exit(1);
    }
};

fixSchema();
