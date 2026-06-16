const express = require('express');
const songController = require('../controllers/song.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/artist/my-songs', authenticateToken, authorize('artist', 'admin'), songController.getArtistSongs);
router.get('/', songController.getSongs);
router.get('/:id', songController.getSongById);
router.post('/', authenticateToken, authorize('artist', 'admin'), upload.optionalSongUpload, songController.createSong);
router.put('/:id', authenticateToken, authorize('artist', 'admin'), songController.updateSong);
router.delete('/:id', authenticateToken, authorize('artist', 'admin'), songController.deleteSong);
router.post('/:id/like', authenticateToken, songController.likeSong);
router.post('/:id/play', songController.incrementPlayCount);

module.exports = router;
