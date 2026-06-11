const express = require('express');
const adminController = require('../controllers/admin.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authenticateToken, authorize('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/artists', adminController.getArtists);
router.get('/artists/:artistId', adminController.getArtistById);
router.put('/users/:userId/role', adminController.updateUserRole);
router.put('/users/:userId/status', adminController.updateUserStatus);
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;
