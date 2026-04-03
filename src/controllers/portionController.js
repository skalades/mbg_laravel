const portionRepository = require('../repositories/portionRepository');

exports.getAllPortions = async (req, res) => {
    try {
        const result = await portionRepository.getAll();
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPortionById = async (req, res) => {
    try {
        const result = await portionRepository.getById(req.params.id);
        if (!result) return res.status(404).json({ message: 'Portion not found' });
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPortion = async (req, res) => {
    try {
        const data = req.body;
        // Auto-calculate meal values if not provided
        if (!data.meal_energy && data.daily_energy) {
            const perc = (data.adequacy_percent || 30) / 100;
            data.meal_energy = data.daily_energy * perc;
            data.meal_protein = data.daily_protein * perc;
            data.meal_fat = data.daily_fat * perc;
            data.meal_carbs = data.daily_carbs * perc;
        }

        const id = await portionRepository.create(data);
        res.status(201).json({ message: 'Portion created', id });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updatePortion = async (req, res) => {
    try {
        const data = req.body;
        // Recalculate meal values
        const perc = (data.adequacy_percent || 30) / 100;
        data.meal_energy = data.daily_energy * perc;
        data.meal_protein = data.daily_protein * perc;
        data.meal_fat = data.daily_fat * perc;
        data.meal_carbs = data.daily_carbs * perc;

        await portionRepository.update(req.params.id, data);
        res.json({ message: 'Portion updated' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deletePortion = async (req, res) => {
    try {
        await portionRepository.delete(req.params.id);
        res.json({ message: 'Portion deleted' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
