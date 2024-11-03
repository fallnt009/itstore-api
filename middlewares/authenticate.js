const jwt = require('jsonwebtoken');
const {User} = require('../models');
const resMsg = require('../config/messages');

module.exports = async (req, res, next) => {
  try {
    const {authorization} = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      //unauthorized
      return res.status(401).json(resMsg.getMsg(401));
    }
    const token = authorization.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      res.status(401).json(resMsg.getMsg(40101));
    }
    const user = await User.findOne({
      where: {id: payload.id},
      attribute: {
        exclude: ['password'],
      },
    });
    if (!user) {
      //unauthorized
      return res.status(401).json(resMsg.getMsg(401));
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
