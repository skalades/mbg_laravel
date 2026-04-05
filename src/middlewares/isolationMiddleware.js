/**
 * Middleware to enforce data isolation between kitchens.
 * It extracts kitchen_id from the authenticated user (JWT)
 * and attaches it to req.kitchenId for use in controllers/repositories.
 */
const isolationMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - No user context' });
  }

  // Admins can see everything (kitchenId = null)
  // Nutritionists are restricted to their kitchenId
  if (req.user.role === 'ADMIN') {
    req.kitchenId = null; 
  } else {
    req.kitchenId = req.user.kitchen_id || -1; // -1 to ensure no data is found if not assigned
  }

  next();
};

module.exports = isolationMiddleware;
