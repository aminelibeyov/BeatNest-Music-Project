const express = require('express');
const wishlistController = require('../controllers/wishlist.controller');
const authenticateToken = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticateToken);

router.get('/', wishlistController.getWishlist);
router.post('/add', wishlistController.addToWishlist);
router.delete('/:songId', wishlistController.removeFromWishlist);
router.get('/check/:songId', wishlistController.isInWishlist);

module.exports = router;
