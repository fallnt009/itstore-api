const {
  validateRegister,
  validateLogin,
} = require('../../validators/auth-validate');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../../models');
const createError = require('../../utils/create-error');

exports.register = async (req, res, next) => {
  try {
    const value = validateRegister(req.body);

    const user = await User.findOne({
      where: {
        email: value.email || '',
      },
    });

    if (user) {
      createError('email already in use', 400);
    }
    value.password = await bcrypt.hash(value.password, 12);
    await User.create(value);
    res
      .status(201)
      .json({message: 'register success. please login to continue'});
  } catch (err) {
    next(err);
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
      createError('invalid email or password', 400);
    }

    const isCorrect = await bcrypt.compare(value.password, user.password);
    if (!isCorrect) {
      createError('invalid email or password', 400);
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
    res.status(200).json({accessToken});
  } catch (err) {
    next(err);
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.roles)) {
      createError('You do not have permission to perform this action', 403);
    }
    next();
  };
};

exports.getMyProfile = (req, res, next) => {
  res.status(200).json({user: req.user});
};
