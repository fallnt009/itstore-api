const express = require('express');
const authenticate = require('../middlewares/authenticate');
const {EMPLOYEE} = require('../config/constants');

const orderController = require('../controllers/order/order-controller');
const authController = require('../controllers/auth/auth-controller');

const router = express.Router();

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
