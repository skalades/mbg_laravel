const db = require('../config/db');

async function seed() {
    const portions = [
        {
            name: 'Porsi Kecil',
            daily_energy: 1566.4,
            daily_protein: 35.0,
            daily_fat: 53.3,
            daily_carbs: 240.0,
            adequacy_percent: 30,
            meal_energy: 469.9,
            meal_protein: 10.5,
            meal_fat: 16.0,
            meal_carbs: 72.0,
            multiplier: 0.8
        },
        {
            name: 'Porsi Besar',
            daily_energy: 2148.2,
            daily_protein: 60.8,
            daily_fat: 71.0,
            daily_carbs: 317.7,
            adequacy_percent: 30,
            meal_energy: 644.5,
            meal_protein: 18.3,
            meal_fat: 21.3,
            meal_carbs: 95.3,
            multiplier: 1.2
        },
        {
            name: 'Standard (SD)',
            daily_energy: 1900.0,
            daily_protein: 50.0,
            daily_fat: 60.0,
            daily_carbs: 280.0,
            adequacy_percent: 30,
            meal_energy: 570.0,
            meal_protein: 15.0,
            meal_fat: 18.0,
            meal_carbs: 84.0,
            multiplier: 1.0
        }
    ];

    try {
        console.log("🌱 Seeding portion configs...");
        await db.execute("DELETE FROM portion_configs");
        
        for (const p of portions) {
            await db.execute(
                `INSERT INTO portion_configs 
                (name, daily_energy, daily_protein, daily_fat, daily_carbs, adequacy_percent, meal_energy, meal_protein, meal_fat, meal_carbs, multiplier)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [p.name, p.daily_energy, p.daily_protein, p.daily_fat, p.daily_carbs, p.adequacy_percent, p.meal_energy, p.meal_protein, p.meal_fat, p.meal_carbs, p.multiplier]
            );
        }

        console.log("✅ Portion configs seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding failed:", err.message);
        process.exit(1);
    }
}

seed();
