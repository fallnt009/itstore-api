const {
  Product,
  ProductImage,
  ProductSubCategory,
  BrandCategorySub,
  BrandCategory,
  MainCategory,
  SubCategory,
  ProductDiscount,
  Discount,
  Cart,
  CartItem,
} = require('../../../models');

const {validateCart} = require('../validators/cart-validate');

const resMsg = require('../../../config/messages');

exports.getMyCart = async (req, res, next) => {
  try {
    const result = await Cart.findOne({
      where: {
        id: req.user.id,
      },
      attributes: ['id', 'userId'],
      include: [
        {
          model: CartItem,
          attributes: ['id', 'qty', 'cartId', 'productId'],
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductSubCategory,
                  required: true,
                  attributes: ['id'],
                  include: [
                    {
                      model: BrandCategorySub,
                      required: true,
                      attributes: ['id'],
                      include: [
                        {
                          model: SubCategory,
                          required: true,
                          attributes: ['title', 'slug'],
                        },
                        {
                          model: BrandCategory,
                          required: true,
                          attributes: ['id'],
                          include: [
                            {
                              model: MainCategory,
                              required: true,
                              attributes: ['title', 'slug'],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {model: ProductDiscount, include: [{model: Discount}]},
                {
                  model: ProductImage,
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getCartItemById = async (req, res, next) => {
  try {
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
      return res.status(404).json(resMsg.getMsg(40401));
    }

    res.status(200).json({...resMsg.getMsg(200), cartItem});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      //exceed avaliable stock
      return res.status(409).json(resMsg.getMsg(40903));
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

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await cartItem.destroy();

    res.status(204).json({});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(404).json(resMsg.getMsg(40401));
    }

    //update cartItem qty where productId
    const result = await cartItem.update({qty: newQty});

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
