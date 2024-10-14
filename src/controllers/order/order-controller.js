const {
  Cart,
  CartItem,
  Order,
  OrderItem,
  OrderDetail,
  UserPayment,
  UserAddress,
  Product,
  Checkout,
  Service,
  Address,
  Payment,
  sequelize,
} = require('../../models');
const {
  STATUS_PENDING,
  STATUS_PROCESSING,
  STATUS_COMPLETED,
} = require('../../config/constants');
const resMsg = require('../../config/messages');

const {generateOrderNumber} = require('../utils/generateNumber');

exports.getMyOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;

    //pargination

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    //make filter base on order Status
    const filter = req.query.filter || '';
    const filterCondition = filter ? {orderStatus: filter} : '';

    const {count, rows} = await Order.findAndCountAll({
      where: {userId: userId, ...filterCondition},
      include: [
        {
          model: OrderDetail,
          include: [
            {
              model: UserAddress,
              include: Address,
              required: true,
            },
            {
              model: Service,
              required: true,
            },
          ],
          required: true,
        },
        {
          model: UserPayment,
          include: Payment,
          required: true,
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });

    res.status(200).json({
      ...resMsg.getMsg(200),
      totalItems: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      result: rows,
    });
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
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
      return res.status(400).json(resMsg.getMsg(40005));
    }

    //findCheckout that userId
    const checkout = await Checkout.findOne(
      {
        where: {userId: userId},
      },
      {transaction: od}
    );

    if (!checkout) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    //create order-detail
    const orderDetail = await OrderDetail.create(
      {
        orderNumber: generateOrderNumber(1), //generate Order Number,unique
        senderAddress: req.body.senderAddress,
        receiverAddress: req.body.receiverAddress,
        userAddressId: checkout.userAddressId,
        serviceId: checkout.serviceId,
      },
      {transaction: od}
    );

    // Create UserPayment
    const userPayment = await UserPayment.create(
      {
        amount: req.body.totalAmount,
        userId: userId,
        paymentId: checkout.paymentId,
      },
      {transaction: od}
    );
    // Create Order
    const order = await Order.create(
      {
        userId: userId,
        userPaymentId: userPayment.id,
        orderDetailId: orderDetail.id,
        totalAmount: req.body.subTotal,
        //before vat calculate
      },
      {transaction: od}
    );

    // Pack data into array
    const orderItemsData = [];
    for (const item of cartItems) {
      orderItemsData.push({
        orderId: order.id,
        productId: item.productId,
        qty: item.qty,
        price: item.Product.price,
      });
    }

    //and send into Order Item
    await OrderItem.bulkCreate(orderItemsData, {
      transaction: od,
    });
    // sent on req.body.order
    req.body.order = order;

    //transaction commit
    await od.commit();

    const result = await Order.findOne({
      where: {id: order.id},
      attributes: [
        'id',
        'orderStatus',
        'totalAmount',
        'expireDate',
        'createdAt',
        'orderDetailId',
        'userId',
        'userPaymentId',
      ],
      include: [
        {
          model: OrderDetail,
          attributes: [
            'orderNumber',
            'senderAddress',
            'receiverAddress',
            'deliveryDate',
            'eddDate',
            'deliveryName',
            'trackingNumber',
            'userAddressId',
            'serviceId',
          ],
        },
      ],
    });

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    await od.rollback();
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.cancelOrder = async (req, res, next) => {
  const userId = req.user.id;
  const orderId = req.params.orderId || req.body.order.id;

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
      return res.status(404).json(resMsg.getMsg(40401));
    }
    //check status if processing or completed cannot cancel order ????
    if (order.orderStatus !== STATUS_PENDING) {
      return res.status(400).json(resMsg.getMsg(40004));
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
    // //find and delete associated order items
    await OrderItem.destroy({where: {orderId: order.id}, transaction: od});

    // //delete Order
    await order.destroy({transaction: od});
    //delete userPayment
    await UserPayment.destroy({
      where: {id: order.userPaymentId},
      transaction: od,
    });

    //commit
    await od.commit();
    res.status(200).json({...resMsg.getMsg(200), order});
  } catch (err) {
    await od.rollback();
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.checkOrderExpireDate = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const order = req.body.order;
    const od = await sequelize.transaction();
    if (currentDate > order.expireDate) {
      //check order status not process or completed cancel order
      if (
        order.orderStatus !== STATUS_PROCESSING ||
        order.orderStatus !== STATUS_COMPLETED
      ) {
        //cancel order
        try {
          const findOrder = await Order.findOne({
            where: {
              id: order.id,
              userId: order.userId,
            },
            include: OrderItem,
            transaction: od,
          });

          //Update the Stock for each based on order items
          for (const orderItem of findOrder.OrderItems) {
            const product = await Product.findByPk(orderItem.productId, {
              transaction: od,
            });

            if (product) {
              product.qtyInStock += orderItem.qty; // return stock
              await product.save({transaction: od});
            }
          }
          //find and delete associated order items
          await OrderItem.destroy({
            where: {orderId: findOrder.id},
            transaction: od,
          });

          //delete Order
          await findOrder.destroy({transaction: od});
          //delete userPayment
          await UserPayment.destroy({
            where: {id: findOrder.userPaymentId},
            transaction: od,
          });

          //commit
          await od.commit();
          res.status(200).json(resMsg.getMsg(200));
        } catch (err) {
          await od.rollback();
          res.status(400).json(resMsg.getMsg(400));
        }
      }
    }
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//FOR ADMIN
exports.updateOrder = async (req, res, next) => {
  try {
    //on Update requirement
    //order detail delievery date ,edd_date,delivery_name and tracking number freely on this category
    //on Update userpayment
    //?? need to review make seperate or with order
    //update payment status ,payment_date,proof_image
    //on Update Order
    //update orderStatus only
    /////////////////////////////////////////
    //decrease stock after update to Complete
    //Calculate totalPrice OK////////
    // let totalPrice = 0;
    // //keep change stock
    // const stockChange = [];
    // for (const item of cartItems) {
    //   totalPrice += item.qty * item.Product.price; //?need? vat 7%
    //   //keep the original stock and the change made
    //   stockChange.push({
    //     productId: item.productId,
    //     originalStock: item.Product.qtyInStock,
    //     quantitySold: item.qty,
    //   });
    // }
    ////////////////////////////////////
    //Reduce Stock//////////////////////
    // const product = item.Product;
    // product.qtyInStock -= item.qty;
    // await product.save({transaction: od});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteOrder = async (req, res, next) => {
  try {
    //cancel Order can be made on order Status PENDING ONLY
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//GET ORDER by OrderNumber
exports.getOrderByOrderNumber = async (req, res, next) => {
  try {
    const orderNum = req.params.orderNumber;

    // // find order and order details
    const order = await Order.findOne({
      include: [
        {
          model: OrderDetail,
          where: {orderNumber: orderNum},
          required: true,
          include: [
            {
              model: UserAddress,
              include: {
                model: Address,
              },
            },
            {
              model: Service,
            },
          ],
        },
        {
          model: UserPayment,
          include: [
            {
              model: Payment,
            },
          ],
          required: true,
        },
      ],
    });

    if (!order) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    const orderItem = await OrderItem.findAll({
      where: {orderId: order.id},
      attributes: ['id', 'qty', 'price', 'orderId', 'productId'],
      include: {
        model: Product,
        attributes: ['title', 'price', 'description', 'slug'],
      },
    });

    res
      .status(200)
      .json({...resMsg.getMsg(200), result: order, product: orderItem});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
