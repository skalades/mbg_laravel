/**
 * mockAuthMiddleware.js
 * 
 * This middleware replaces the real verifyToken for public access mode.
 * It injects a hardcoded "Anissa, SKM" user into req.user to prevent
 * controllers from crashing and to satisfy data isolation logic.
 */

const mockAuthMiddleware = (req, res, next) => {
  // Mock User Object (Anissa, SKM)
  req.user = {
    id: 1, // Default ID (Ensure this matches an existing user or is handled by repo)
    username: 'anissa_skm',
    full_name: 'Anissa, SKM',
    title: 'Ahli Gizi',
    role: 'ADMIN' // Set to ADMIN to bypass all role checks
  };

  // Default kitchenId for data isolation (NULL means see all, or set a specific ID)
  req.kitchenId = null;

  next();
};

module.exports = mockAuthMiddleware;
