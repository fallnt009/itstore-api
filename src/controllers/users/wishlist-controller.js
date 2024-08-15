const {Wishlist, User} = require('../../models');
const resMsg = require('../../config/messages');

exports.createWishlist = async (req, res, next) => {
  try {
    //find exist wishlist
    const existWishlist = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId: req.params.id,
      },
    });
    //if exist return create error
    if (existWishlist) {
      return res.status(409).json(resMsg.getMsg(40900));
    }
    //if not generated new
    const newWishlist = await Wishlist.create({
      userId: req.user.id,
      productId: req.params.id,
    });
    //show wishlish
    const wishlist = await Wishlist.findOne({
      where: {id: newWishlist.id},
      include: {model: User},
    });
    res.status(201).json({...resMsg.getMsg(200), wishlist});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteWishlist = async (req, res, next) => {
  try {
    const existWishlist = await Wishlist.findOne({
      where: {userId: req.user.id, productId: req.params.id},
    });

    if (!existWishlist) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    await existWishlist.destroy();
    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.getMyWishlist = async (req, res, next) => {
  try {
    const result = await Wishlist.findAll({
      include: [
        {
          model: User,
          where: {
            id: req.user.id,
          },
        },
      ],
    });
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
