const User = require('../models/User');
const Song = require('../models/Song');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalSongs,
      totalArtists,
      totalCategories,
      activeUsers,
      pendingApprovals,
      approvedSongs,
      rejectedSongs,
      totalPlays
    ] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      User.countDocuments({ role: 'artist' }),
      Category.countDocuments(),
      User.countDocuments({ status: 'active' }),
      Song.countDocuments({ 'approvalStatus.status': 'pending' }),
      Song.countDocuments({ 'approvalStatus.status': 'approved' }),
      Song.countDocuments({ 'approvalStatus.status': 'rejected' }),
      Song.aggregate([{ $group: { _id: null, total: { $sum: '$plays' } } }])
    ]);

    const recentSongs = await Song.find()
      .populate('artistId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title artist approvalStatus status createdAt');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email role createdAt');

    const recentActivities = [
      ...recentSongs.map((song) => ({
        type: 'song_upload',
        title: song.title,
        subtitle: song.artist,
        status: song.approvalStatus?.status || song.status,
        createdAt: song.createdAt
      })),
      ...recentUsers.map((user) => ({
        type: 'user_register',
        title: `${user.firstName} ${user.lastName}`,
        subtitle: user.email,
        status: user.role,
        createdAt: user.createdAt
      }))
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched',
      data: {
        totalUsers,
        totalSongs,
        totalArtists,
        totalCategories,
        activeUsers,
        pendingApprovals,
        approvedSongs,
        rejectedSongs,
        totalPlays: totalPlays[0]?.total || 0,
        recentActivities
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, role, status, search, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort(sort)
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

const getArtists = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, sort = '-createdAt', status } = req.query;
    const skip = (page - 1) * limit;

    const filter = { role: 'artist' };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const artists = await User.find(filter)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const artistIds = artists.map((a) => a._id);
    const songStats = await Song.aggregate([
      { $match: { artistId: { $in: artistIds } } },
      {
        $group: {
          _id: '$artistId',
          totalSongs: { $sum: 1 },
          approvedSongs: {
            $sum: { $cond: [{ $eq: ['$approvalStatus.status', 'approved'] }, 1, 0] }
          },
          pendingSongs: {
            $sum: { $cond: [{ $eq: ['$approvalStatus.status', 'pending'] }, 1, 0] }
          },
          rejectedSongs: {
            $sum: { $cond: [{ $eq: ['$approvalStatus.status', 'rejected'] }, 1, 0] }
          },
          totalPlays: { $sum: '$plays' },
          totalLikes: { $sum: '$likes' }
        }
      }
    ]);

    const statsMap = Object.fromEntries(songStats.map((s) => [s._id.toString(), s]));

    const artistsWithStats = artists.map((artist) => {
      const stats = statsMap[artist._id.toString()] || {
        totalSongs: 0,
        approvedSongs: 0,
        pendingSongs: 0,
        rejectedSongs: 0,
        totalPlays: 0,
        totalLikes: 0
      };
      return { ...artist.toObject(), stats };
    });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Artists fetched successfully',
      data: {
        artists: artistsWithStats,
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

const getArtistById = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const artist = await User.findOne({ _id: artistId, role: 'artist' }).select('-password');

    if (!artist) {
      return next(ApiError.notFound('Artist not found'));
    }

    const songFilter = { artistId: artist._id };
    if (status && status !== 'all') {
      songFilter['approvalStatus.status'] = status;
    }

    const skip = (page - 1) * limit;
    const songs = await Song.find(songFilter)
      .populate('category', 'name')
      .populate('approvalStatus.approvedBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalSongs = await Song.countDocuments(songFilter);

    const [approvedSongs, pendingSongs, rejectedSongs, engagement] = await Promise.all([
      Song.countDocuments({ artistId: artist._id, 'approvalStatus.status': 'approved' }),
      Song.countDocuments({ artistId: artist._id, 'approvalStatus.status': 'pending' }),
      Song.countDocuments({ artistId: artist._id, 'approvalStatus.status': 'rejected' }),
      Song.aggregate([
        { $match: { artistId: artist._id } },
        {
          $group: {
            _id: null,
            totalPlays: { $sum: '$plays' },
            totalLikes: { $sum: '$likes' }
          }
        }
      ])
    ]);

    const recentActivity = await Song.find({ artistId: artist._id })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title approvalStatus updatedAt createdAt');

    res.status(200).json({
      success: true,
      message: 'Artist details fetched',
      data: {
        artist,
        stats: {
          totalSongs: approvedSongs + pendingSongs + rejectedSongs,
          approvedSongs,
          pendingSongs,
          rejectedSongs,
          totalPlays: engagement[0]?.totalPlays || 0,
          totalLikes: engagement[0]?.totalLikes || 0
        },
        songs,
        recentActivity,
        pagination: {
          total: totalSongs,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(totalSongs / limit)
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
    ).select('-password');

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

const updateUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (req.user.id === userId) {
      return next(ApiError.badRequest('You cannot change your own status'));
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(ApiError.notFound('User not found'));
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user.id === userId) {
      return next(ApiError.badRequest('You cannot delete your own account'));
    }

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

module.exports = {
  getDashboardStats,
  getUsers,
  getArtists,
  getArtistById,
  updateUserRole,
  updateUserStatus,
  deleteUser
};
