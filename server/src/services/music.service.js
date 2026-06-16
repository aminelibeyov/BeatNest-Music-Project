const Song = require('../models/Song');
const Category = require('../models/Category');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary } = require('../config/cloudinary');

const parseDuration = (value) => {
  if (!value) return 180;
  const num = Number(value);
  if (!Number.isNaN(num) && num > 0) return Math.round(num);
  const parts = String(value).split(':').map(Number);
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 180;
};

const resolveFileUrl = async (file) => {
  if (!file) return null;

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const result = await uploadToCloudinary(file.path, 'beatnest/songs');
      return result.secure_url;
    } catch (err) {
      console.warn('Cloudinary upload failed, using local file:', err.message);
    }
  }

  const baseUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${baseUrl}/uploads/${file.filename}`;
};

const resolveCategory = async (genre) => {
  if (genre) {
    const byGenre = await Category.findOne({
      name: { $regex: new RegExp(`^${genre}$`, 'i') }
    });
    if (byGenre) return byGenre._id;
  }

  const category = await Category.findOne({ status: 'active' }).sort({ createdAt: 1 });
  if (!category) {
    throw ApiError.badRequest('No category available. Please contact administrator.');
  }
  return category._id;
};

const createSong = async (songData, userId) => {
  const song = new Song({
    ...songData,
    artistId: userId,
    status: 'pending',
    approvalStatus: {
      status: 'pending',
      approvedBy: null,
      rejectionReason: null,
      approvedAt: null
    },
    isPublished: false
  });

  await song.save();
  return song.populate('category', 'name');
};

const createSongFromUpload = async (body, files, userId) => {
  const title = body.title?.trim();
  if (!title || title.length < 2) {
    throw ApiError.badRequest('Song title is required');
  }

  const audioFile = files?.audioFile?.[0] || files?.audio?.[0];
  if (!audioFile) {
    throw ApiError.badRequest('Audio file is required');
  }

  const user = await User.findById(userId).select('firstName lastName');
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const artistName = body.artist?.trim() || `${user.firstName} ${user.lastName}`.trim();
  const genre = body.genre?.trim() || 'Pop';
  const categoryId = await resolveCategory(genre);
  const audioUrl = await resolveFileUrl(audioFile);
  const coverFile = files?.coverImage?.[0] || files?.cover?.[0];
  const coverImage = coverFile ? await resolveFileUrl(coverFile) : null;

  return createSong({
    title,
    artist: artistName,
    category: categoryId,
    genre,
    duration: parseDuration(body.duration),
    description: body.description || '',
    lyrics: body.lyrics || '',
    audioUrl,
    coverImage
  }, userId);
};

const getArtistSongs = async (userId, query = {}) => {
  const { page = 1, limit = 20, sort = '-createdAt' } = query;
  const skip = (page - 1) * limit;

  const filter = { artistId: userId };
  const songs = await Song.find(filter)
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

const getSongs = async (query) => {
  const { page = 1, limit = 10, search, sort = '-createdAt', category, genre } = query;

  const skip = (page - 1) * limit;
  const filter = { isPublished: true };

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

  if (!song.isPublished) {
    throw ApiError.forbidden('Song is not yet approved for public access');
  }

  return song;
};

const updateSong = async (songId, updateData, userId, userRole) => {
  const song = await Song.findById(songId);

  if (!song) {
    throw ApiError.notFound('Song not found');
  }

  if (song.artistId.toString() !== userId && userRole !== 'admin') {
    throw ApiError.forbidden('You can only update your own songs');
  }

  Object.assign(song, updateData);
  await song.save();

  return song.populate('category', 'name');
};

const deleteSong = async (songId, userId, userRole) => {
  const song = await Song.findById(songId);

  if (!song) {
    throw ApiError.notFound('Song not found');
  }

  if (song.artistId.toString() !== userId && userRole !== 'admin') {
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
  createSongFromUpload,
  getArtistSongs,
  getSongs,
  getSongById,
  updateSong,
  deleteSong,
  likeSong,
  incrementPlayCount
};
