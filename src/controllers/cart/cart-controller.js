const {Cart, CartItem} = require('../../models');
const {validateCart} = require('../../validators/cart-validate');
const createError = require('../../utils/create-error');

exports.getMyCart = async (req, res, next) => {
  //get cart by userId
  const result = await Cart.findAll({
    where: {
      id: req.user.id,
    },
    attributes: ['id', 'userId'],
    include: [
      {
        model: CartItem,
        attributes: ['id', 'qty', 'cartId', 'productId'],
      },
    ],
  });
  res.status(200).json({message: 'Success', result});
  try {
  } catch (err) {
    next(err);
  }
};

exports.addCartItem = async (req, res, next) => {
  try {
    //find user cart
    const cart = await Cart.findOne({
      where: {userId: req.user.id},
      attributes: ['id', 'userId'],
    });
    //validate
    const value = validateCart({
      productId: req.params.id,
      qty: req.body.qty,
    });
    value.cartId = cart.id;
    //create cart item
    const item = await CartItem.create(value);

    res.status(200).json({cart, item});
  } catch (err) {
    next(err);
  }
};
exports.deleteCartItem = async (req, res, next) => {
  try {
    //get request
    const userId = req.user.id;
    const cartItemId = req.params.id;
    //find that cart item belong to mycart
    const cartItem = await CartItem.findOne({
      where: {id: cartItemId},
      attributes: ['id', 'qty', 'cartId', 'productId'],
      include: [
        {
          model: Cart,
          where: {userId: userId},
          attributes: ['id', 'userId'],
        },
      ],
    });

    //if not belong to user
    if (!cartItem) {
      createError('Item not found', 404);
    }

    await cartItem.destroy();

    res.status(204).json({message: 'deleted Success'});
  } catch (err) {
    next(err);
  }
};
exports.updateCartItem = async (req, res, next) => {
  try {
    //find Cart where userId
    //update cartItem qty where productId
  } catch (err) {
    next(err);
  }
};
