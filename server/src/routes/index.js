const express = require('express');
const authRoutes = require('./auth.routes');
const songRoutes = require('./song.routes');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');
const wishlistRoutes = require('./wishlist.routes');
const playlistRoutes = require('./playlist.routes');
const premiumRoutes = require('./premium.routes');
const approvalRoutes = require('./approval.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/songs', songRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/playlists', playlistRoutes);
router.use('/premium', premiumRoutes);
router.use('/approval', approvalRoutes);

module.exports = router;
