const nutritionService = require('../services/nutritionService');
const foodRepository = require('../repositories/foodRepository');
const redisClient = require('../config/redisClient');

const CACHE_TTL = 86400; // 24 hours in seconds

const clearFoodCache = async () => {
  try {
    // Clear all food search caches
    const keys = await redisClient.keys('search:food:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log('🧹 Food Cache cleared for: ', keys);
    }
  } catch (err) {
    console.error('Failed to clear food cache:', err);
  }
};

exports.calculateMeal = async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ message: 'Items array is required for calculation' });
  }

  try {
    const result = await nutritionService.calculateMealNutrition(items);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.searchFood = async (req, res) => {
  const { name } = req.query;
  const cacheKey = `search:food:${name || 'all'}`;

  try {
    // 1. Try to get from cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('⚡ Cache Hit: ', cacheKey);
      return res.json(JSON.parse(cachedData));
    }

    // 2. Fetch from DB
    const foods = await foodRepository.searchByName(name || '');

    // 3. Save to cache
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(foods));

    res.json(foods);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Error searching food' });
  }
};

exports.getFoodConversions = async (req, res) => {
  const { id } = req.params;
  const cacheKey = `food:conversions:${id}`;

  try {
    // 1. Try cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        console.log('⚡ Cache Hit: ', cacheKey);
        return res.json(JSON.parse(cachedData));
    }

    // 2. Fetch DB
    const conversions = await foodRepository.getConversionsByFoodId(id);

    // 3. Store cache
    await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(conversions));

    res.json(conversions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversions' });
  }
};

exports.getAllFood = async (req, res) => {
  try {
    const foods = await foodRepository.getAll();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all foods' });
  }
};

exports.createFood = async (req, res) => {
  const { conversions, ...foodData } = req.body;
  try {
    const food = await foodRepository.create(foodData);
    
    // Clear search cache
    await clearFoodCache();
    
    if (conversions && Array.isArray(conversions)) {
      for (const conv of conversions) {
        await foodRepository.addConversion({ 
          food_item_id: food.id, 
          unit_name: conv.unit_name, 
          weight_gram_standard: conv.weight_gram_standard 
        });
      }
    }
    
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Error creating food item', error: error.message });
  }
};

exports.updateFood = async (req, res) => {
  const { conversions, ...foodData } = req.body;
  try {
    await foodRepository.update(req.params.id, foodData);
    
    // Clear cache
    await clearFoodCache();
    await redisClient.del(`food:conversions:${req.params.id}`);
    
    // For simplicity in update, we could sync conversions (delete existing and re-add or smart sync)
    // For now, let's just update the main data. SRT management can also be handled by the separate SRT modal 
    // but we will allow basic sync here.
    
    res.json({ message: 'Food item updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating food item', error: error.message });
  }
};


exports.deleteFood = async (req, res) => {
  try {
    await foodRepository.delete(req.params.id);
    
    // Clear cache
    await clearFoodCache();
    await redisClient.del(`food:conversions:${req.params.id}`);
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting food item' });
  }
};

exports.addFoodConversion = async (req, res) => {
  const { unit_name, weight_gram_standard } = req.body;
  const food_item_id = req.params.id;

  if (!unit_name || !weight_gram_standard) {
    return res.status(400).json({ message: 'Unit name and weight are required' });
  }

  try {
    await foodRepository.addConversion({ food_item_id, unit_name, weight_gram_standard });
    res.status(201).json({ message: 'Conversion added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding conversion' });
  }
};



