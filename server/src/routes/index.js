const express = require('express');
const authRoutes = require('./auth.routes');
const songRoutes = require('./song.routes');
const userRoutes = require('./user.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/songs', songRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
