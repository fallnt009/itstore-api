const express = require('express');

const authenticate = require('../middlewares/authenticate');
const wishlistController = require('../controllers/users/wishlist-controller');

const router = express.Router();

//If Login ?
router.use(authenticate);
//my wishlist
router.route('/mywishlist').get(wishlistController.getMyWishlist);
//add wishlist
router
  .route('/:id/wishlist')
  .post(wishlistController.createWishlist)
  .delete(wishlistController.deleteWishlist);

module.exports = router;
