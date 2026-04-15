const { ROLES, PERMISSIONS } = require('../config/roles');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role is not authorized for this action`
      });
    }

    next();
  };
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const hasPermission = PERMISSIONS[userRole]?.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${permission} permission required`
      });
    }

    next();
  };
};

module.exports = { authorize, checkPermission };