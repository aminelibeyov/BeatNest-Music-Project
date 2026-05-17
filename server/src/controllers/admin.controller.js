const User = require('../models/User');
const Song = require('../models/Song');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSongs = await Song.countDocuments();
    const totalCategories = await Category.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched',
      data: {
        totalUsers,
        totalSongs,
        totalCategories,
        activeUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, status } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: {
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const approveSong = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const song = await Song.findByIdAndUpdate(
      songId,
      { status: 'published' },
      { new: true }
    );

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Song approved successfully',
      data: song
    });
  } catch (error) {
    next(error);
  }
};

const rejectSong = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const song = await Song.findByIdAndDelete(songId);

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Song rejected successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserRole,
  deleteUser,
  approveSong,
  rejectSong
};
