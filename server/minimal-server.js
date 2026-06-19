// minimal-server.js - Complete, standalone backend for the exact feature!
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5001; // Use a different port to avoid conflict with your main server

// 1. MongoDB connection
mongoose.connect('mongodb://localhost:27017/beatnest-minimal', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// 2. Create uploads folder (if doesn't exist)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads folder');
}

// 3. Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename: timestamp-random.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Only allow audio files!
  if (file.mimetype.startsWith('audio/')) {
    cb(null, true);
  } else {
    cb(new Error('Only audio files are allowed!'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // Max 50MB
});

// 4. Song Model
const SongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a song title'],
    trim: true
  },
  artist: {
    type: String,
    required: [true, 'Please add an artist name'],
    trim: true
  },
  fileUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Song = mongoose.model('Song', SongSchema);

// 5. Middleware
app.use(cors());
app.use(express.json());

// 6. Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// 7. Routes
// a) Upload a Song (POST /api/songs)
app.post('/api/songs', upload.single('audioFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an audio file'
      });
    }

    const { title, artist } = req.body;

    const newSong = new Song({
      title,
      artist,
      fileUrl: `/uploads/${req.file.filename}`
    });

    await newSong.save();

    res.status(201).json({
      success: true,
      data: newSong
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// b) Get all Songs (GET /api/songs)
app.get('/api/songs', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: songs
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// Start
app.listen(PORT, () => {
  console.log(`🚀 Minimal server running on http://localhost:${PORT}`);
});