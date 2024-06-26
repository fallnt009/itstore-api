const express = require('express');

const authenticate = require('../middlewares/authenticate');

const checkoutController = require('../controllers/checkout/checkout-controller');

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .get(checkoutController.getMyCheckout)
  .post(checkoutController.createCheckout);

router
  .route('/:id')
  .patch(checkoutController.updateCheckout)
  .delete(checkoutController.deleteCheckout);

module.exports = router;
