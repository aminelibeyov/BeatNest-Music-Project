const Song = require('../models/Song');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');

const createSong = async (songData, userId) => {
  const song = new Song({
    ...songData,
    artistId: userId
  });

  await song.save();
  return song.populate('category', 'name');
};

const getSongs = async (query) => {
  const { page = 1, limit = 10, search, sort = '-createdAt', category, genre } = query;

  const skip = (page - 1) * limit;
  const filter = { status: 'published' };

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category;
  }

  if (genre) {
    filter.genre = genre;
  }

  const songs = await Song.find(filter)
    .populate('artistId', 'firstName lastName avatar')
    .populate('category', 'name')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Song.countDocuments(filter);

  return {
    songs,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  };
};

const getSongById = async (songId) => {
  const song = await Song.findById(songId)
    .populate('artistId', 'firstName lastName avatar bio')
    .populate('category', 'name');

  if (!song) {
    throw ApiError.notFound('Song not found');
  }

  return song;
};

const updateSong = async (songId, updateData, userId) => {
  const song = await Song.findById(songId);

  if (!song) {
    throw ApiError.notFound('Song not found');
  }

  if (song.artistId.toString() !== userId && req.user.role !== 'admin') {
    throw ApiError.forbidden('You can only update your own songs');
  }

  Object.assign(song, updateData);
  await song.save();

  return song.populate('category', 'name');
};

const deleteSong = async (songId, userId) => {
  const song = await Song.findById(songId);

  if (!song) {
    throw ApiError.notFound('Song not found');
  }

  if (song.artistId.toString() !== userId && req.user.role !== 'admin') {
    throw ApiError.forbidden('You can only delete your own songs');
  }

  await Song.findByIdAndDelete(songId);
  return { message: 'Song deleted successfully' };
};

const likeSong = async (songId, userId) => {
  const song = await Song.findById(songId);

  if (!song) {
    throw ApiError.notFound('Song not found');
  }

  if (song.likedBy.includes(userId)) {
    song.likedBy = song.likedBy.filter(id => id.toString() !== userId);
    song.likes -= 1;
  } else {
    song.likedBy.push(userId);
    song.likes += 1;
  }

  await song.save();
  return song;
};

const incrementPlayCount = async (songId) => {
  const song = await Song.findById(songId);

  if (!song) {
    throw ApiError.notFound('Song not found');
  }

  song.plays += 1;
  await song.save();
  return song;
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
