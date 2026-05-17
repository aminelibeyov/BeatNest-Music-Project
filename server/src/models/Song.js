const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true // in seconds
  },
  description: {
    type: String,
    default: ''
  },
  lyrics: {
    type: String,
    default: ''
  },
  audioUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: null
  },
  plays: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for search
songSchema.index({ title: 'text', artist: 'text', genre: 'text' });
songSchema.index({ category: 1 });
songSchema.index({ artistId: 1 });
songSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Song', songSchema);
