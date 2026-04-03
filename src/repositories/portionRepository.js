const db = require('../config/db');

class PortionRepository {
    async getAll() {
        const [rows] = await db.execute("SELECT * FROM portion_configs ORDER BY id ASC");
        return rows;
    }

    async getById(id) {
        const [rows] = await db.execute("SELECT * FROM portion_configs WHERE id = ?", [id]);
        return rows[0];
    }

    async create(data) {
        const { name, daily_energy, daily_protein, daily_fat, daily_carbs, adequacy_percent, meal_energy, meal_protein, meal_fat, meal_carbs, multiplier } = data;
        const [result] = await db.execute(
            `INSERT INTO portion_configs 
            (name, daily_energy, daily_protein, daily_fat, daily_carbs, adequacy_percent, meal_energy, meal_protein, meal_fat, meal_carbs, multiplier) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, daily_energy, daily_protein, daily_fat, daily_carbs, adequacy_percent, meal_energy, meal_protein, meal_fat, meal_carbs, multiplier]
        );
        return result.insertId;
    }

    async update(id, data) {
        const { name, daily_energy, daily_protein, daily_fat, daily_carbs, adequacy_percent, meal_energy, meal_protein, meal_fat, meal_carbs, multiplier } = data;
        await db.execute(
            `UPDATE portion_configs SET 
            name = ?, daily_energy = ?, daily_protein = ?, daily_fat = ?, daily_carbs = ?, 
            adequacy_percent = ?, meal_energy = ?, meal_protein = ?, meal_fat = ?, meal_carbs = ?, multiplier = ? 
            WHERE id = ?`,
            [name, daily_energy, daily_protein, daily_fat, daily_carbs, adequacy_percent, meal_energy, meal_protein, meal_fat, meal_carbs, multiplier, id]
        );
    }

    async delete(id) {
        await db.execute("DELETE FROM portion_configs WHERE id = ?", [id]);
    }
}

module.exports = new PortionRepository();
