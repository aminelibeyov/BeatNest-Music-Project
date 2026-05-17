const express = require('express');
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.updateProfile);
router.delete('/account', authenticateToken, userController.deleteAccount);

module.exports = router;
