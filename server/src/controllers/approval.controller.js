const Song = require('../models/Song');
const ApiError = require('../utils/ApiError');

const getPendingSongs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const songs = await Song.find({ 'approvalStatus.status': 'pending' })
      .populate('artistId', 'firstName lastName email avatar')
      .populate('category', 'name')
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

const approveSong = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const song = await Song.findById(songId);

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    song.approvalStatus.status = 'approved';
    song.approvalStatus.approvedBy = req.user.id;
    song.approvalStatus.approvedAt = new Date();
    song.isPublished = true;

    await song.save();

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
    const { rejectionReason } = req.body;

    const song = await Song.findById(songId);

    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    song.approvalStatus.status = 'rejected';
    song.approvalStatus.approvedBy = req.user.id;
    song.approvalStatus.rejectionReason = rejectionReason || 'No reason provided';
    song.approvalStatus.approvedAt = new Date();
    song.isPublished = false;

    await song.save();

    res.status(200).json({
      success: true,
      message: 'Song rejected successfully',
      data: song
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
  approveSong,
  rejectSong,
  getApprovalStats
};
