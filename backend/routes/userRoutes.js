const express = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  deleteUserPermanently
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { userValidation, validateRequest } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Admin only routes
router.post('/', authorize('admin'), userValidation.createUser, validateRequest, createUser);
router.delete('/:id/deactivate', authorize('admin'), deactivateUser);
router.delete('/:id/permanent', authorize('admin'), deleteUserPermanently);

// Admin and Manager can update (controller will handle restrictions)
router.put('/:id', authorize('admin', 'manager'), userValidation.updateUser, validateRequest, updateUser);

// Admin and Manager can view users
router.get('/', authorize('admin', 'manager'), getUsers);
router.get('/:id', authorize('admin', 'manager'), getUserById);

module.exports = router;