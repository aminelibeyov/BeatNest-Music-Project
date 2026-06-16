const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/x-wav',
    'audio/ogg',
    'audio/webm',
    'audio/mp4',
    'audio/x-m4a',
    'audio/flac',
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype) || file.mimetype.startsWith('audio/') || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

const uploadSongFields = upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]);

const optionalSongUpload = (req, res, next) => {
  if (req.is('multipart/form-data')) {
    return uploadSongFields(req, res, next);
  }
  next();
};

module.exports = upload;
module.exports.uploadSongFields = uploadSongFields;
module.exports.optionalSongUpload = optionalSongUpload;
