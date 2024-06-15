const {Cart, CartItem, Product} = require('../../models');
const {validateCart} = require('../../validators/cart-validate');
const createError = require('../../utils/create-error');

exports.getMyCart = async (req, res, next) => {
  const result = await Cart.findAll({
    where: {
      id: req.user.id,
    },
    attributes: ['id', 'userId'],
    include: [
      {
        model: CartItem,
        attributes: ['id', 'qty', 'cartId', 'productId'],
        include: [{model: Product}],
      },
    ],
  });
  res.status(200).json({message: 'Success', result});
  try {
  } catch (err) {
    next(err);
  }
};

exports.getCartItemById = async (req, res, next) => {
  const userId = req.user.id;
  const cartItemId = req.params.id;

  //find Cart where userId
  const cartItem = await CartItem.findOne({
    where: {id: cartItemId},
    attributes: ['id', 'qty', 'cartId', 'productId'],
    include: [
      {model: Product},
      {
        model: Cart,
        where: {userId: userId},
        attributes: ['id', 'userId'],
      },
    ],
  });

  if (!cartItem) {
    createError('Item not found', 404);
  }

  res.status(200).json({message: 'Success', cartItem});
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
    //Check Product Stock if not 0
    const product = await Product.findOne({where: {id: value.productId}});

    //
    if (!product || value.qty > product.qtyInStock) {
      createError('exceed avaliable stock', 400);
    }

    //create cart item
    const cartItem = await CartItem.create(value);

    //find All
    const result = await Cart.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['id', 'userId'],
      include: [
        {
          model: CartItem,
          where: {id: cartItem.id},
          attributes: ['id', 'qty', 'cartId', 'productId'],
          include: [{model: Product}],
        },
      ],
    });

    res.status(200).json({result});
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
    const userId = req.user.id;
    const cartItemId = req.params.id;
    const newQty = req.body.qty;
    //find Cart where userId
    const cartItem = await CartItem.findOne({
      where: {id: cartItemId},
      attributes: ['id', 'qty', 'cartId', 'productId'],
      include: [
        {model: Product},
        {
          model: Cart,
          where: {userId: userId},
          attributes: ['id', 'userId'],
        },
      ],
    });

    if (!cartItem) {
      createError('Item not found', 404);
    }

    //update cartItem qty where productId
    await cartItem.update({qty: newQty});
    res.status(200).json({cartItem});
  } catch (err) {
    next(err);
  }
};
