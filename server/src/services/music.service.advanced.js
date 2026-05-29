// Enhanced music.service.js with advanced search and filtering
// This file contains improved implementations for better search capabilities

const getSongsAdvanced = async (query) => {
  const { 
    page = 1, 
    limit = 10, 
    search, 
    sort = '-createdAt', 
    category, 
    genre,
    artist,
    status = 'published',
    minPlays,
    maxPlays,
    minLikes,
    maxLikes,
    dateFrom,
    dateTo
  } = query;

  const skip = (page - 1) * limit;
  const filter = {};

  // Status filter
  if (status) {
    filter.status = status;
  }

  // Text search on title, artist, and genre
  if (search) {
    filter.$text = { $search: search };
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Genre filter (case-insensitive)
  if (genre) {
    filter.genre = { $regex: genre, $options: 'i' };
  }

  // Artist filter
  if (artist) {
    filter.artist = { $regex: artist, $options: 'i' };
  }

  // Play count range filter
  if (minPlays || maxPlays) {
    filter.plays = {};
    if (minPlays) filter.plays.$gte = parseInt(minPlays);
    if (maxPlays) filter.plays.$lte = parseInt(maxPlays);
  }

  // Likes count range filter
  if (minLikes || maxLikes) {
    filter.likes = {};
    if (minLikes) filter.likes.$gte = parseInt(minLikes);
    if (maxLikes) filter.likes.$lte = parseInt(maxLikes);
  }

  // Date range filter
  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(dateTo);
  }

  // Execute query with aggregation for better performance
  const songs = await Song.aggregate([
    { $match: filter },
    {
      $lookup: {
        from: 'users',
        localField: 'artistId',
        foreignField: '_id',
        as: 'artistDetails'
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    { $sort: parseSortObject(sort) },
    { $skip: skip },
    { $limit: parseInt(limit) }
  ]);

  const total = await Song.countDocuments(filter);

  return {
    songs,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    },
    filters: {
      status,
      category,
      genre,
      artist,
      search
    }
  };
};

// Helper function to parse sort object
const parseSortObject = (sortStr) => {
  const sortObj = {};
  const fields = sortStr.split(',').map(f => f.trim());
  
  fields.forEach(field => {
    if (field.startsWith('-')) {
      sortObj[field.substring(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  });

  return sortObj;
};

// Get trending songs with analytics
const getTrendingSongs = async (timeFrame = '7days', limit = 10) => {
  const dateFrom = new Date();
  
  switch(timeFrame) {
    case '24hours':
      dateFrom.setHours(dateFrom.getHours() - 24);
      break;
    case '7days':
      dateFrom.setDate(dateFrom.getDate() - 7);
      break;
    case '30days':
      dateFrom.setDate(dateFrom.getDate() - 30);
      break;
    case 'all':
      dateFrom.setFullYear(2000);
      break;
  }

  const trendingSongs = await Song.aggregate([
    {
      $match: {
        status: 'published',
        createdAt: { $gte: dateFrom }
      }
    },
    {
      $addFields: {
        trendScore: {
          $add: [
            { $multiply: ['$plays', 1] },
            { $multiply: ['$likes', 10] },
            { $cond: [{ $gte: ['$plays', 100] }, 50, 0] }
          ]
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'artistId',
        foreignField: '_id',
        as: 'artistDetails'
      }
    },
    { $sort: { trendScore: -1 } },
    { $limit: limit },
    {
      $project: {
        title: 1,
        artist: 1,
        genre: 1,
        plays: 1,
        likes: 1,
        coverImage: 1,
        trendScore: 1,
        artistDetails: { $arrayElemAt: ['$artistDetails', 0] }
      }
    }
  ]);

  return trendingSongs;
};

// Get recommendations based on user preferences
const getRecommendations = async (userId, limit = 10) => {
  // Get user's liked songs to understand preferences
  const userLikedSongs = await Wishlist.find({ userId }).populate('songId');
  
  if (!userLikedSongs || userLikedSongs.length === 0) {
    // If no liked songs, return trending songs
    return getTrendingSongs('7days', limit);
  }

  // Extract genres and artists from liked songs
  const likedGenres = [...new Set(userLikedSongs.map(w => w.songId.genre))];
  const likedArtists = [...new Set(userLikedSongs.map(w => w.songId.artistId))];

  // Find similar songs
  const recommendations = await Song.find({
    $and: [
      { status: 'published' },
      {
        $or: [
          { genre: { $in: likedGenres } },
          { artistId: { $in: likedArtists } }
        ]
      },
      {
        _id: {
          $nin: userLikedSongs.map(w => w.songId._id)
        }
      }
    ]
  })
    .populate('artistId', 'firstName lastName avatar')
    .populate('category', 'name')
    .sort('-plays')
    .limit(limit);

  return recommendations;
};

// Get featured songs for homepage
const getFeaturedSongs = async (limit = 8) => {
  const featured = await Song.aggregate([
    {
      $match: {
        status: 'published',
        isPublished: true
      }
    },
    {
      $addFields: {
        featureScore: {
          $add: [
            { $multiply: ['$plays', 0.5] },
            { $multiply: ['$likes', 5] },
            { $multiply: [
              { $toInt: { $regexMatch: { input: '$title', regex: /.+/ } } },
              20
            ] }
          ]
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'artistId',
        foreignField: '_id',
        as: 'artistDetails'
      }
    },
    { $sort: { featureScore: -1 } },
    { $limit: limit }
  ]);

  return featured;
};

// Search with facets (for advanced search UI)
const getSearchFacets = async (search) => {
  const facets = await Song.aggregate([
    {
      $match: {
        $text: { $search: search },
        status: 'published'
      }
    },
    {
      $facet: {
        genres: [
          { $group: { _id: '$genre', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        artists: [
          { $group: { _id: '$artist', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        categories: [
          {
            $lookup: {
              from: 'categories',
              localField: 'category',
              foreignField: '_id',
              as: 'categoryInfo'
            }
          },
          { $unwind: '$categoryInfo' },
          { $group: { _id: '$categoryInfo.name', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]
      }
    }
  ]);

  return facets[0];
};

// Export all functions
module.exports = {
  getSongsAdvanced,
  getTrendingSongs,
  getRecommendations,
  getFeaturedSongs,
  getSearchFacets
};
