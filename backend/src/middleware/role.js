const { error } = require('../utils/response');

/**
 * Middleware to check if the authenticated user has the required role(s).
 * Must be used AFTER authMiddleware.
 * 
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'farmer')
 */
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return error(res, 'Access denied. User role not found.', 403);
    }

    if (!roles.includes(req.user.role)) {
      return error(res, `Access denied. Requires one of: ${roles.join(', ')}`, 403);
    }

    next();
  };
};

module.exports = requireRole;
