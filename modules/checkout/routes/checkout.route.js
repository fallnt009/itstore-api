const express = require('express');

const authenticate = require('../../../middlewares/authenticate');

const checkoutController = require('../controllers/checkout.controller');
const serviceController = require('../controllers/service.controller');

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

//service
router
  .route('/service')
  .get(serviceController.getAllService)
  .post(serviceController.createService);
router
  .route('/service/:id')
  .patch(serviceController.updateService)
  .delete(serviceController.deleteService);

module.exports = router;
