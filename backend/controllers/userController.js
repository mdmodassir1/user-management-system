const User = require('../models/User');

// @desc    Get all users with pagination, search, filters
// @route   GET /api/users
// @access  Admin/Manager
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const search = req.query.search || '';
    const role = req.query.role || '';
    const status = req.query.status || '';

    let query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (role) {
      query.role = role;
    }
    
    if (status) {
      query.status = status;
    }

    // Normal user can only see their own profile
    if (req.user.role === 'user') {
      query._id = req.user._id;
    }
    
    // Manager can't see admin users
    if (req.user.role === 'manager') {
      query.role = { $ne: 'admin' };
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select('-password')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page: page,
        limit: limit,
        total: total,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin/Manager
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Normal user can only see their own profile
    if (req.user.role === 'user' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own profile.'
      });
    }

    // Manager can't view admin users
    if (req.user.role === 'manager' && user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Managers cannot view admin users.'
      });
    }

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

// @desc    Create new user (Admin only)
// @route   POST /api/users
// @access  Admin
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'Temp@123',
      role: role || 'user',
      status: status || 'active',
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user (Admin can update everything, Manager can update only name/email of non-admin users)
// @route   PUT /api/users/:id
// @access  Admin/Manager
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Manager cannot update admin users
    if (req.user.role === 'manager' && user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Managers cannot update admin users'
      });
    }

    const { name, email, role, status } = req.body;

    // For Admin: Can update everything
    if (req.user.role === 'admin') {
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (status) user.status = status;
    }
    
    // For Manager: Can only update name and email of non-admin users
    if (req.user.role === 'manager') {
      if (name) user.name = name;
      if (email) user.email = email;
      // Manager cannot change role or status
      if (role) {
        return res.status(403).json({
          success: false,
          message: 'Managers cannot change user roles'
        });
      }
      if (status) {
        return res.status(403).json({
          success: false,
          message: 'Managers cannot change user status'
        });
      }
    }
    
    user.updatedBy = req.user._id;
    await user.save();

    const updatedUser = await User.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Deactivate user (Soft delete) - Admin only
// @route   DELETE /api/users/:id/deactivate
// @access  Admin
const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot deactivate admin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot deactivate admin user'
      });
    }

    user.status = 'inactive';
    user.updatedBy = req.user._id;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully. User cannot login now.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete user permanently - Admin only
// @route   DELETE /api/users/:id/permanent
// @access  Admin
const deleteUserPermanently = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot delete admin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted permanently from database'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deactivateUser,
  deleteUserPermanently
};