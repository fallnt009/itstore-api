const {
  Cart,
  CartItem,
  Order,
  OrderItem,
  OrderDetail,
  UserPayment,
  Product,
  sequelize,
} = require('../../models');
const createError = require('../../utils/create-error');
const {generateOrderNumber} = require('../utils/generateNumber');

exports.getMyOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const order = await Order.findAll({
      where: {userId: userId},
    });
    res.status(200).json({amount: order.length, order});
  } catch (err) {
    next(err);
  }
};
exports.createOrder = async (req, res, next) => {
  const userId = req.user.id;
  const od = await sequelize.transaction();
  try {
    //GET CART ITEM
    const cartItems = await CartItem.findAll({
      attributes: ['id', 'qty', 'productId'],
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'title',
            'productImage',
            'price',
            'qtyInStock',
            'productCode',
          ],
        },
        {
          model: Cart,
          where: {userId: userId},
          attributes: ['id', 'userId'],
        },
      ],
      transaction: od,
    });

    //Check Cart Item if empty
    if (cartItems.length === 0) {
      createError('Cart is empty', 400);
    }

    //create order-detail
    const orderDetail = await OrderDetail.create(
      {
        orderNumber: generateOrderNumber(1), //generate Order Number,unique
        senderAddress: req.body.senderAddress,
        receiverAddress: req.body.receiverAddress,
      },
      {transaction: od}
    );
    //Calculate totalPrice OK
    let totalPrice = 0;
    //keep change stock
    const stockChange = [];

    for (const item of cartItems) {
      totalPrice += item.qty * item.Product.price;
      //keep the original stock and the change made
      stockChange.push({
        productId: item.productId,
        originalStock: item.Product.qtyInStock,
        quantitySold: item.qty,
      });
    }

    // Create UserPayment
    const userPayment = await UserPayment.create(
      {
        amount: totalPrice.toString(),
        userId: userId,
      },
      {transaction: od}
    );
    // Create Order
    const order = await Order.create(
      {
        userId: userId,
        userPaymentId: userPayment.id,
        orderDetailId: orderDetail.id,
        totalAmount: totalPrice.toString(),
      },
      {transaction: od}
    );

    const orderItemsData = [];

    // Pack data into array
    for (const item of cartItems) {
      orderItemsData.push({
        orderId: order.id,
        productId: item.productId,
        qty: item.qty,
        price: item.Product.price,
      });

      //Decrease Stock
      const product = item.Product;
      product.qtyInStock -= item.qty;
      await product.save({transaction: od});
    }

    //and send into Order Item
    const orderItems = await OrderItem.bulkCreate(orderItemsData, {
      transaction: od,
    });

    //transaction commit
    await od.commit();

    res.status(200).json({orderItems});
  } catch (err) {
    await od.rollback();
    next(err);
  }
};
exports.cancelOrder = async (req, res, next) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;
  const od = await sequelize.transaction();
  try {
    //find the order and item
    const order = await Order.findOne({
      where: {
        id: orderId,
        userId: userId,
      },
      include: OrderItem,
      transaction: od,
    });

    if (!order) {
      createError('Order not found', 404);
    }

    //Update the Stock for each based on order items
    for (const orderItem of order.OrderItems) {
      const product = await Product.findByPk(orderItem.productId, {
        transaction: od,
      });
      if (product) {
        product.qtyInStock += orderItem.qty; // return stock
        await product.save({transaction: od});
      }
    }
    //find and delete associated order items
    await OrderItem.destroy({where: {orderId: order.id}, transaction: od});

    //delete Order
    await order.destroy({transaction: od});

    //commit
    await od.commit();
    res.status(200).json({message: 'Order canceled Success'});
  } catch (err) {
    await od.rollback();
    next(err);
  }
};

//FOR ADMIN
exports.updateOrder = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
exports.deleteOrder = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};
