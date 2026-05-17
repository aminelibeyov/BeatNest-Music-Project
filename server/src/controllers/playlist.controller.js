const Playlist = require('../models/Playlist');
const Song = require('../models/Song');
const ApiError = require('../utils/ApiError');

const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    if (!name) {
      return next(ApiError.badRequest('Playlist name is required'));
    }

    const playlist = new Playlist({
      name,
      description,
      isPublic: isPublic || false,
      userId: req.user.id
    });

    await playlist.save();

    res.status(201).json({
      success: true,
      message: 'Playlist created successfully',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
};

const getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ userId: req.user.id })
      .populate('songs');

    res.status(200).json({
      success: true,
      message: 'Playlists fetched successfully',
      data: playlists
    });
  } catch (error) {
    next(error);
  }
};

const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return next(ApiError.notFound('Playlist not found'));
    }

    if (playlist.userId.toString() !== req.user.id) {
      return next(ApiError.forbidden('You can only add songs to your own playlists'));
    }

    const song = await Song.findById(songId);
    if (!song) {
      return next(ApiError.notFound('Song not found'));
    }

    if (playlist.songs.includes(songId)) {
      return next(ApiError.conflict('Song already in playlist'));
    }

    playlist.songs.push(songId);
    await playlist.save();
    await playlist.populate('songs');

    res.status(200).json({
      success: true,
      message: 'Song added to playlist',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
};

const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return next(ApiError.notFound('Playlist not found'));
    }

    if (playlist.userId.toString() !== req.user.id) {
      return next(ApiError.forbidden('You can only manage your own playlists'));
    }

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();
    await playlist.populate('songs');

    res.status(200).json({
      success: true,
      message: 'Song removed from playlist',
      data: playlist
    });
  } catch (error) {
    next(error);
  }
};

const deletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return next(ApiError.notFound('Playlist not found'));
    }

    if (playlist.userId.toString() !== req.user.id) {
      return next(ApiError.forbidden('You can only delete your own playlists'));
    }

    await Playlist.findByIdAndDelete(playlistId);

    res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlaylist,
  getUserPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
};
