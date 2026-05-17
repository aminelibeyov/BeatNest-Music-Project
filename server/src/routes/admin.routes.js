const express = require('express');
const adminController = require('../controllers/admin.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authenticateToken, authorize('admin'));

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.put('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);
router.post('/songs/:songId/approve', adminController.approveSong);
router.delete('/songs/:songId/reject', adminController.rejectSong);

module.exports = router;
