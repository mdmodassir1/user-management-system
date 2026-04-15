const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { userValidation, validateRequest } = require('../middleware/validation');

const router = express.Router();

router.post('/register', userValidation.createUser, validateRequest, register);
router.post('/login', userValidation.login, validateRequest, login);
router.get('/me', protect, getMe);

module.exports = router;