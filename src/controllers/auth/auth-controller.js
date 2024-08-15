const {User, Cart} = require('../../models');
const {
  validateRegister,
  validateLogin,
} = require('../../validators/auth-validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const resMsg = require('../../config/messages');

exports.register = async (req, res, next) => {
  try {
    const value = validateRegister(req.body);

    const user = await User.findOne({
      where: {
        email: value.email || '',
      },
    });

    if (user) {
      res.status(409).json(resMsg.getMsg(40902));
    }
    value.password = await bcrypt.hash(value.password, 12);
    const newUser = await User.create(value);
    await Cart.create({userId: newUser.id});

    res.status(201).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.login = async (req, res, next) => {
  try {
    const value = validateLogin(req.body);
    const user = await User.findOne({
      where: {
        email: value.email,
      },
    });

    if (!user) {
      //invalid password or email
      return res.status(401).json(resMsg.getMsg(40102));
    }

    const isCorrect = await bcrypt.compare(value.password, user.password);
    if (!isCorrect) {
      return res.status(401).json(resMsg.getMsg(40102));
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        profileImage: user.profileImage,
        roles: user.roles,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    res.status(200).json({...resMsg.getMsg(200), accessToken});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      return res.status(403).json(resMsg.getMsg(403));
    }
    next();
  };
};

exports.getMyProfile = (req, res, next) => {
  res.status(200).json({user: req.user});
};
