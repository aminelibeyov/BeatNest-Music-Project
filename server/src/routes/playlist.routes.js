const express = require('express');
const playlistController = require('../controllers/playlist.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', playlistController.getUserPlaylists);
router.post('/', playlistController.createPlaylist);
router.post('/:playlistId/add', playlistController.addSongToPlaylist);
router.delete('/:playlistId/remove/:songId', playlistController.removeSongFromPlaylist);
router.delete('/:playlistId', playlistController.deletePlaylist);

module.exports = router;
