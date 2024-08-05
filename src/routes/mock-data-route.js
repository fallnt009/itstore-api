const express = require('express');

const mockProductController = require('../controllers/products/mock-data-product');

const router = express.Router();

//dev only
router.route('/main').post(mockProductController.MockMainData);
router.route('/associate').post(mockProductController.MockAssociateData);
router.route('/specproduct').post(mockProductController.MockSpecProduct);
router.route('/subspec').post(mockProductController.MockSubSpec);

module.exports = router;
