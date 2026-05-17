const Wishlist = require('../models/Wishlist');
const Song = require('../models/Song');
const ApiError = require('../utils/ApiError');

const addToWishlist = async (req, res, next) => {
  try {
    const { songId } = req.body;

    // Verify song exists
    const song = await Song.findById(songId);
    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    let wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({
        userId: req.user.id,
        songs: [{ songId }]
      });
    } else {
      // Check if song already in wishlist
      const exists = wishlist.songs.find(s => s.songId.toString() === songId);
      if (exists) {
        return next(ApiError.conflict('Song already in wishlist'));
      }
      wishlist.songs.push({ songId });
    }

    await wishlist.save();
    await wishlist.populate('songs.songId');

    res.status(200).json({
      success: true,
      message: 'Song added to wishlist',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return next(ApiError.notFound('Wishlist not found'));
    }

    wishlist.songs = wishlist.songs.filter(s => s.songId.toString() !== songId);
    await wishlist.save();
    await wishlist.populate('songs.songId');

    res.status(200).json({
      success: true,
      message: 'Song removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate({
        path: 'songs.songId',
        populate: { path: 'artistId', select: 'firstName lastName avatar' }
      });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        message: 'Wishlist is empty',
        data: { songs: [] }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

const isInWishlist = async (req, res, next) => {
  try {
    const { songId } = req.params;

    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { isInWishlist: false }
      });
    }

    const exists = wishlist.songs.find(s => s.songId.toString() === songId);

    res.status(200).json({
      success: true,
      data: { isInWishlist: !!exists }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isInWishlist
};
