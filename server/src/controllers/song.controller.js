const musicService = require('../services/music.service');
const { createSongSchema, updateSongSchema, paginationSchema } = require('../validations/song.validation');
const ApiError = require('../utils/ApiError');

const createSong = async (req, res, next) => {
  try {
    const { error, value } = createSongSchema.validate(req.body);

    if (error) {
      return next(ApiError.badRequest(error.details[0].message));
    }

    const song = await musicService.createSong(value, req.user.id);

    res.status(201).json({
      success: true,
      message: 'Song created successfully',
      data: song
    });
  } catch (error) {
    next(error);
  }
};

const getSongs = async (req, res, next) => {
  try {
    const { error, value } = paginationSchema.validate(req.query);

    if (error) {
      return next(ApiError.badRequest(error.details[0].message));
    }

    const result = await musicService.getSongs(value);

    res.status(200).json({
      success: true,
      message: 'Songs fetched successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await musicService.getSongById(id);

    res.status(200).json({
      success: true,
      message: 'Song fetched successfully',
      data: song
    });
  } catch (error) {
    next(error);
  }
};

const updateSong = async (req, res, next) => {
  try {
    const { error, value } = updateSongSchema.validate(req.body);

    if (error) {
      return next(ApiError.badRequest(error.details[0].message));
    }

    const song = await musicService.updateSong(req.params.id, value, req.user.id, req.user.role);

    res.status(200).json({
      success: true,
      message: 'Song updated successfully',
      data: song
    });
  } catch (error) {
    next(error);
  }
};

const deleteSong = async (req, res, next) => {
  try {
    const result = await musicService.deleteSong(req.params.id, req.user.id, req.user.role);

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const likeSong = async (req, res, next) => {
  try {
    const song = await musicService.likeSong(req.params.id, req.user.id);

    res.status(200).json({
      success: true,
      message: 'Like action successful',
      data: song
    });
  } catch (error) {
    next(error);
  }
};

const incrementPlayCount = async (req, res, next) => {
  try {
    const song = await musicService.incrementPlayCount(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Play count incremented',
      data: song
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSong,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
  likeSong,
  incrementPlayCount
};
