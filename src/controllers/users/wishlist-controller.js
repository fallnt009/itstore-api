const {Wishlist, User} = require('../../models');
const createError = require('../../utils/create-error');

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
      createError('Already in wishlist', 400);
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
    res.status(201).json({wishlist});
  } catch (err) {
    next(err);
  }
};
exports.deleteWishlist = async (req, res, next) => {
  try {
    const existWishlist = await Wishlist.findOne({
      where: {userId: req.user.id, productId: req.params.id},
    });

    if (!existWishlist) {
      createError('Not on wishlist', 400);
    }
    await existWishlist.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
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
    res.status(200).json({result});
  } catch (err) {
    next(err);
  }
};
