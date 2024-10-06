const express = require('express');

const mockProductController = require('../controllers/products/mock-data-product');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.use(authenticate);
//dev only
router.route('/main').post(mockProductController.MockMainData);
router.route('/associate').post(mockProductController.MockAssociateData);
router.route('/specproduct/all').post(mockProductController.MockAllSpecProduct);
router.route('/subspec/single').post(mockProductController.MockSubSpecSingle);

router.route('/servandpay').post(mockProductController.MockServiceAndPayment);

module.exports = router;
