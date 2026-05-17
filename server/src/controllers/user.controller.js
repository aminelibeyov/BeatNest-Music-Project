const User = require('../models/User');
const ApiError = require('../utils/ApiError');

// Get user profile
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetPasswordToken');
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }
    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, bio, avatar },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken');

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};

// Delete user account
exports.deleteAccount = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
  }
};

