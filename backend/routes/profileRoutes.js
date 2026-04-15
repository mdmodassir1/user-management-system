const express = require('express');
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const { userValidation, validateRequest } = require('../middleware/validation');

const router = express.Router();

router.use(protect);
router.get('/me', getMyProfile);
router.put('/me', userValidation.updateProfile, validateRequest, updateMyProfile);

module.exports = router;