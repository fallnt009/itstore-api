const express = require('express');
const authenticate = require('../../../middlewares/authenticate');
const {EMPLOYEE} = require('../../../config/constants');

const authController = require('../../auth/controllers/auth.controller');
const orderController = require('../controllers/order.controller');

const router = express.Router();

router
  .route('/findOrder/:orderNumber')
  .get(orderController.getOrderByOrderNumber);

router.use(authenticate);
router.route('/myorder').get(orderController.getMyOrder);
router.route('/myorder/:orderId').delete(orderController.cancelOrder);
router.route('/create').post(orderController.createOrder);

router.use(authController.restrictTo(EMPLOYEE));
router
  .route('/manage')
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
