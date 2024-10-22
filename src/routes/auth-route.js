const express = require('express');

const authController = require('../controllers/auth/auth-controller');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.use(authenticate);
router.get('/me', authController.getMyProfile);
router.patch('/updatepa', authController.updatePassword);

module.exports = router;
