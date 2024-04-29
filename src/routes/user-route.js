const express = require('express');

const userController = require('../controllers/users/user-controller');
const authController = require('../controllers/auth/auth-controller');

const authenticate = require('../middlewares/authenticate');

const {EMPLOYEE} = require('../config/constants');

const router = express.Router();

//If Login ?
router.use(authenticate);

router.route('/updateMe').patch(userController.updateProfileInfo);
router.route('/updateMeImg').patch(userController.updateProfileImage);

router.use(authController.restrictTo(EMPLOYEE));

router.route('/').get(userController.getAllUser);

module.exports = router;
