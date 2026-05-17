const express = require('express');
const approvalController = require('../controllers/approval.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

const router = express.Router();

router.use(authenticateToken, authorize('admin'));

router.get('/pending', approvalController.getPendingSongs);
router.post('/approve/:songId', approvalController.approveSong);
router.post('/reject/:songId', approvalController.rejectSong);
router.get('/stats', approvalController.getApprovalStats);

module.exports = router;
