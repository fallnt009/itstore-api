const express = require('express');
const authenticate = require('../middlewares/authenticate');
const cartController = require('../controllers/cart/cart-controller');

const router = express.Router();

router.use(authenticate);
router.route('/mycart').get(cartController.getMyCart);
router
  .route('/:id/item')
  .post(cartController.addCartItem)
  .delete(cartController.deleteCartItem);
module.exports = router;
