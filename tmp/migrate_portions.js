const db = require('../src/config/db');

async function migrate() {
    const query = `
    CREATE TABLE IF NOT EXISTS portion_configs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        daily_energy DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        daily_protein DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        daily_fat DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        daily_carbs DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        adequacy_percent DECIMAL(5,2) NOT NULL DEFAULT 30.00,
        meal_energy DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        meal_protein DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        meal_fat DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        meal_carbs DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        multiplier DECIMAL(5,2) DEFAULT 1.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
    `;

    try {
        const [result] = await db.execute(query);
        console.log("✅ Table portion_configs created successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err.message);
        process.exit(1);
    }
}

migrate();
