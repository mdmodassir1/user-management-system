const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get own profile
// @route   GET /api/profile/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update own profile
// @route   PUT /api/profile/me
// @access  Private
const updateMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, currentPassword, newPassword } = req.body;

    if (name) {
      user.name = name;
    }

    if (currentPassword && newPassword) {
      const isPasswordMatch = await user.comparePassword(currentPassword);
      
      if (!isPasswordMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      user.password = newPassword;
    }

    user.updatedBy = req.user._id;
    await user.save();

    const updatedUser = await User.findById(req.user._id).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getMyProfile, updateMyProfile };