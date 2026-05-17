const express = require('express');
const premiumController = require('../controllers/premium.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.post('/subscribe', premiumController.createSubscription);
router.get('/status', premiumController.getSubscription);
router.post('/cancel', premiumController.cancelSubscription);
router.get('/check', premiumController.checkPremiumStatus);

module.exports = router;
