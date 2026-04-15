const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const userValidation = {
  createUser: [
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['admin', 'manager', 'user']).withMessage('Invalid role'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
  ],
  updateUser: [
    body('name').optional().trim(),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('role').optional().isIn(['admin', 'manager', 'user']).withMessage('Invalid role'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
  ],
  updateProfile: [
    body('name').optional().trim(),
    body('currentPassword').optional(),
    body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
  ],
  login: [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

module.exports = { validateRequest, userValidation };