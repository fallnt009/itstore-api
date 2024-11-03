const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.use(authenticate);
router.route('/mycart').get(cartController.getMyCart);
router
  .route('/:id/item')
  .get(cartController.getCartItemById)
  .post(cartController.addCartItem)
  .patch(cartController.updateCartItem)
  .delete(cartController.deleteCartItem);

module.exports = router;
