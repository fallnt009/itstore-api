const express = require('express');

const authenticate = require('../../../middlewares/authenticate');
const wishlistController = require('../controllers/wishlist.controller');

const router = express.Router();

//If Login ?
router.use(authenticate);
//my wishlist
router.route('/me').get(wishlistController.getMyWishlist);
//get inWishlist
router.route('/in').get(wishlistController.getMyInWishlistById);
//add wishlist
router
  .route('/:id')
  .post(wishlistController.createWishlist)
  .delete(wishlistController.deleteWishlist);

module.exports = router;
