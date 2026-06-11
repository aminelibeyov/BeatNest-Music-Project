const Song = require('../models/Song');
const ApiError = require('../utils/ApiError');

const getPendingSongs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const songs = await Song.find({ 'approvalStatus.status': 'pending' })
      .populate('artistId', 'firstName lastName email avatar')
      .populate('category', 'name')
      .populate('approvalStatus.approvedBy', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Song.countDocuments({ 'approvalStatus.status': 'pending' });

    res.status(200).json({
      success: true,
      message: 'Pending songs fetched',
      data: {
        songs,
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

const getSongsByStatus = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = 'all', sort = '-createdAt', search } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status && status !== 'all') {
      filter['approvalStatus.status'] = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } }
      ];
    }

    const songs = await Song.find(filter)
      .populate('artistId', 'firstName lastName email avatar')
      .populate('category', 'name')
      .populate('approvalStatus.approvedBy', 'firstName lastName')
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sort);

    const total = await Song.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Songs fetched successfully',
      data: {
        songs,
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

const getSongById = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const song = await Song.findById(songId)
      .populate('artistId', 'firstName lastName email avatar bio')
      .populate('category', 'name')
      .populate('approvalStatus.approvedBy', 'firstName lastName email');

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    res.status(200).json({
      success: true,
      message: 'Song details fetched',
      data: song
    });
  } catch (error) {
    next(error);
  }
};

const approveSong = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const song = await Song.findById(songId);

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    song.status = 'approved';
    song.approvalStatus.status = 'approved';
    song.approvalStatus.approvedBy = req.user.id;
    song.approvalStatus.approvedAt = new Date();
    song.approvalStatus.rejectionReason = null;
    song.isPublished = true;

    await song.save();

    const populated = await Song.findById(song._id)
      .populate('artistId', 'firstName lastName email avatar')
      .populate('category', 'name')
      .populate('approvalStatus.approvedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Song approved successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

const rejectSong = async (req, res, next) => {
  try {
    const { songId } = req.params;
    const { rejectionReason } = req.body;

    const song = await Song.findById(songId);

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    song.status = 'rejected';
    song.approvalStatus.status = 'rejected';
    song.approvalStatus.approvedBy = req.user.id;
    song.approvalStatus.rejectionReason = rejectionReason || 'No reason provided';
    song.approvalStatus.approvedAt = new Date();
    song.isPublished = false;

    await song.save();

    const populated = await Song.findById(song._id)
      .populate('artistId', 'firstName lastName email avatar')
      .populate('category', 'name')
      .populate('approvalStatus.approvedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Song rejected successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

const getApprovalStats = async (req, res, next) => {
  try {
    const pending = await Song.countDocuments({ 'approvalStatus.status': 'pending' });
    const approved = await Song.countDocuments({ 'approvalStatus.status': 'approved' });
    const rejected = await Song.countDocuments({ 'approvalStatus.status': 'rejected' });

    res.status(200).json({
      success: true,
      message: 'Approval statistics fetched',
      data: {
        pending,
        approved,
        rejected,
        total: pending + approved + rejected
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingSongs,
  getSongsByStatus,
  getSongById,
  approveSong,
  rejectSong,
  getApprovalStats
};
