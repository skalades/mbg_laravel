const foodRepository = require('../repositories/foodRepository');

class NutritionService {
  /**
   * Calculate nutrients for a single food item based on quantity and unit.
   * @param {Object} itemData - { food_id, quantity, unit, cooking_method }
   */
  async calculateItemNutrition(itemData) {
    const { food_id, quantity, unit, cooking_method } = itemData;

    const food = await foodRepository.findById(food_id);
    if (!food) throw new Error(`Food item with ID ${food_id} not found`);

    const conversions = await foodRepository.getConversionsByFoodId(food_id);
    
    let weightInGrams = quantity;
    let yieldFactor = 1.0;

    // 1. Handle SRT Conversion
    if (unit !== 'gram') {
      const conversion = conversions.find(c => c.unit_name === unit);
      if (!conversion) {
        throw new Error(`Unit ${unit} not found for food ${food.name}`);
      }
      weightInGrams = quantity * parseFloat(conversion.weight_gram_standard);
      yieldFactor = parseFloat(conversion.yield_factor) || 1.0;
    }

    // 2. Yield Factor Logic (Raw to Cooked)
    // If user inputs "cooked weight", we might need to know "raw weight" for inventory (Phase 3)
    // For nutrition, TKPI usually refers to "Berat Bersih" (Edible Portion).
    const rawWeight = weightInGrams / yieldFactor;

    // 3. Nutrient Loss Logic (Simplified for Phase 2)
    // Based on perencanaan.md: Kukus: 5-10% loss, Goreng: 20-30% loss
    let lossFactor = 1.0;
    if (cooking_method === 'KUKUS') lossFactor = 0.92; // 8% loss
    if (cooking_method === 'GORENG') lossFactor = 0.75; // 25% loss
    if (cooking_method === 'REBUS') lossFactor = 0.85; // 15% loss

    // 4. Final Calculation (Nutrients per 100g)
    const result = {
      food_name: food.name,
      weight_cooked: weightInGrams,
      weight_raw: rawWeight,
      nutrients: {
        energy_kcal: (weightInGrams / 100) * parseFloat(food.energy_kcal),
        protein_g: (weightInGrams / 100) * parseFloat(food.protein_g),
        fat_g: (weightInGrams / 100) * parseFloat(food.fat_g),
        carbs_g: (weightInGrams / 100) * parseFloat(food.carbs_g),
        iron_mg: (weightInGrams / 100) * parseFloat(food.iron_mg || 0) * lossFactor
      }
    };

    return result;
  }

  /**
   * Calculate total nutrition for a list of items (Meal)
   */
  async calculateMealNutrition(items) {
    const results = [];
    const totals = {
      energy_kcal: 0,
      protein_g: 0,
      fat_g: 0,
      carbs_g: 0,
      iron_mg: 0
    };

    for (const item of items) {
      const calculated = await this.calculateItemNutrition(item);
      results.push(calculated);

      totals.energy_kcal += calculated.nutrients.energy_kcal;
      totals.protein_g += calculated.nutrients.protein_g;
      totals.fat_g += calculated.nutrients.fat_g;
      totals.carbs_g += calculated.nutrients.carbs_g;
      totals.iron_mg += calculated.nutrients.iron_mg;
    }

    return {
      items: results,
      totals
    };
  }
}

module.exports = new NutritionService();
