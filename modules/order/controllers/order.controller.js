const {
  Order,
  OrderItem,
  OrderDetail,
  Cart,
  CartItem,
  Checkout,
  Service,
  Payment,
  User,
  UserPayment,
  UserAddress,
  Product,
  ProductImage,
  ProductDiscount,
  Discount,
  Address,
  sequelize,
} = require('../../../models');

const {Op} = require('sequelize');

const {
  STATUS_PENDING,
  STATUS_PROCESSING,
  STATUS_COMPLETED,
} = require('../../../config/constants');

const {generateOrderNumber} = require('../../../utils/generateNumber');

const resMsg = require('../../../config/messages');

const paginate = require('../../../utils/paginate');

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
          include: [
            {
              model: ProductDiscount,
              attributes: ['id', 'discountId'],
              include: [{model: Discount, attributes: ['amount']}],
            },
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

    //validate qty in stock
    for (const item of cartItems) {
      if (item.qty > item.Product.qtyInStock) {
        return res.status(400).json({
          message: `Insufficient stock for product ${item.Product.title}`,
        });
      }
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
        orderDate: Date.now(),
      },
      {transaction: od}
    );

    // Calculate Price
    const orderItemsData = [];

    for (const item of cartItems) {
      const price = parseFloat(item.Product.price);
      const discountedProduct = item.Product.ProductDiscount;

      let finalPrice = price;
      let discountValue = null;

      if (discountedProduct) {
        // Apply discount if it exists
        const discountAmount = discountedProduct.Discount.amount / 100; // Assuming discount amount is a percentage
        const discountPrice = price * discountAmount;

        finalPrice = price - discountPrice;
        discountValue = discountedProduct.Discount.amount;
      }

      orderItemsData.push({
        orderId: order.id,
        productId: item.productId,
        isDiscounted: !!discountedProduct,
        discountValue: discountValue,
        unitPrice: price,
        finalPrice: finalPrice,
        qty: item.qty,
        totalPrice: finalPrice * item.qty,
      });
    }

    //Reduce Stock by update Product
    for (const item of cartItems) {
      await Product.update(
        {qtyInStock: item.Product.qtyInStock - item.qty},
        {where: {id: item.productId}, transaction: od}
      );
    }

    //and send into Order Item
    await OrderItem.bulkCreate(orderItemsData, {
      transaction: od,
    });
    // sent on req.body.order
    req.body.order = order;

    //Clear CartItems after create order
    await CartItem.destroy({
      where: {id: cartItems.map((item) => item.id)},
      transaction: od,
    });

    //transaction commit
    await od.commit();

    const result = await Order.findOne({
      where: {id: order.id},
      attributes: [
        'id',
        'orderStatus',
        'totalAmount',
        'orderDate',
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

    console.log(err);

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
      include: {
        model: Product,
        attributes: ['title', 'price', 'description', 'slug'],
        include: [{model: ProductImage}],
      },
    });

    res
      .status(200)
      .json({...resMsg.getMsg(200), result: order, product: orderItem});
  } catch (err) {
    console.log(err);

    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createOrderTest = async (req, res, next) => {
  const od = await sequelize.transaction();
  try {
    const userId = req.user.id;

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
          include: [
            {
              model: ProductDiscount,
              attributes: ['id', 'discountId'],
              include: [{model: Discount, attributes: ['amount']}],
            },
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

    //validate qty in stock
    for (const item of cartItems) {
      if (item.qty > item.Product.qtyInStock) {
        return res.status(400).json({
          message: `Insufficient stock for product ${item.Product.title}`,
        });
      }
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
    // const orderDetail = await OrderDetail.create(
    //   {
    //     orderNumber: generateOrderNumber(1), //generate Order Number,unique
    //     senderAddress: req.body.senderAddress,
    //     receiverAddress: req.body.receiverAddress,
    //     userAddressId: checkout.userAddressId,
    //     serviceId: checkout.serviceId,
    //   },
    //   {transaction: od}
    // );

    // Create UserPayment
    // const userPayment = await UserPayment.create(
    //   {
    //     amount: req.body.totalAmount,
    //     userId: userId,
    //     paymentId: checkout.paymentId,
    //   },
    //   {transaction: od}
    // );
    // Create Order
    // const order = await Order.create(
    //   {
    //     userId: userId,
    //     userPaymentId: userPayment.id,
    //     orderDetailId: orderDetail.id,
    //     totalAmount: req.body.subTotal,
    //     //before vat calculate
    //   },
    //   {transaction: od}
    // );

    //Analysis
    //if Product have ProductDiscount ? isDiscounted === true : false
    //

    // Pack data into array
    // const orderItemsData = [];
    // for (const item of cartItems) {
    //   orderItemsData.push({
    //     orderId: order.id,
    //     productId: item.productId,
    //     qty: item.qty,
    //     unitPrice: item.Product.price,
    //   });
    // }
    const orderItemsData = [];

    for (const item of cartItems) {
      const price = parseFloat(item.Product.price);
      const discountedProduct = item.Product.ProductDiscount;

      let finalPrice = price;
      let discountValue = null;

      if (discountedProduct) {
        // Apply discount if it exists
        const discountAmount = discountedProduct.Discount.amount / 100; // Assuming discount amount is a percentage
        const discountPrice = price * discountAmount;
        finalPrice = price - discountPrice;

        discountValue = discountedProduct.Discount.amount;
      }

      orderItemsData.push({
        // orderId: order.id,
        // productId: item.productId,
        isDiscounted: !!discountedProduct,
        discountValue: discountValue,
        unitPrice: price,
        finalPrice: finalPrice,
        qty: item.qty,
        totalPrice: finalPrice * item.qty,
      });
    }
    console.log(orderItemsData);

    //Reduce Stock by update Product
    // for (const item of cartItems) {
    //   await Product.update(
    //     {qtyInStock: item.Product.qtyInStock - item.qty},
    //     {where: {id: item.productId}, transaction: od}
    //   );
    // }

    //and send into Order Item
    // await OrderItem.bulkCreate(orderItemsData, {
    //   transaction: od,
    // });
    // sent on req.body.order
    // req.body.order = order;

    //Clear CartItems after create order
    // await CartItem.destroy({
    //   where: {id: cartItems.map((item) => item.id)},
    //   transaction: od,
    // });

    //transaction commit
    await od.commit();

    // const result = await Order.findOne({
    //   where: {id: order.id},
    //   attributes: [
    //     'id',
    //     'orderStatus',
    //     'totalAmount',
    //     'orderDate',
    //     'expireDate',
    //     'createdAt',
    //     'orderDetailId',
    //     'userId',
    //     'userPaymentId',
    //   ],
    //   include: [
    //     {
    //       model: OrderDetail,
    //       attributes: [
    //         'orderNumber',
    //         'senderAddress',
    //         'receiverAddress',
    //         'deliveryDate',
    //         'eddDate',
    //         'deliveryName',
    //         'trackingNumber',
    //         'userAddressId',
    //         'serviceId',
    //       ],
    //     },
    //   ],
    // });

    res.status(200).json({...resMsg.getMsg(200), result: cartItems});
  } catch (err) {
    console.log(err);
    await od.rollback();

    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    //pagination (page,pageSize,order)
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    //sorts
    const sorts = req.query.sorts ? JSON.parse(req.query.sorts) : {}; //{sortBy:'price',sortValue:'ASC'}

    const {sortBy = 'createdAt', sortValue = 'ASC'} = sorts;

    //fetch unreviewed verifierId &&& verifierDate === null
    //unpaid = paymentStatus === Pending
    //completed = paymentStatus === Completed
    //canceled = orderStatus === canceled

    //{paymentStatus='',orderStatus='',startDate,endDate,verifierId,verifyDate}

    const PaymentFiltersCondition = {};
    const OrderFiltersCondition = {};
    const DateFiltersCondition = {};

    const {
      paymentStatus,
      orderStatus,
      startDate,
      endDate,
      verifierId,
      verifyDate,
    } = req.body;

    if (paymentStatus) {
      PaymentFiltersCondition.paymentStatus = paymentStatus;
    }
    if (orderStatus) {
      OrderFiltersCondition.orderStatus = orderStatus;
    }

    if (verifierId && verifyDate) {
      // Filtering for unreviewed orders (verifierId and verifyDate are null)
      PaymentFiltersCondition.verifierId = null;
      PaymentFiltersCondition.verifyDate = null;
    }

    if (startDate && endDate) {
      DateFiltersCondition.orderDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    //get all order with pagination
    const count = await Order.count({
      where: {...OrderFiltersCondition, ...DateFiltersCondition},
      include: [
        {
          model: UserPayment,
          where: PaymentFiltersCondition, // Apply payment filters to UserPayment
        },
      ],
    });

    const rows = await Order.findAll(
      paginate(
        {
          attributes: ['id', 'orderDate', 'createdAt'],
          where: {...OrderFiltersCondition, ...DateFiltersCondition},
          include: [
            {
              model: OrderItem,
              attributes: ['id', 'qty'],
            },
            {
              model: OrderDetail,
              attributes: ['id', 'deliveryDate'],
            },
            {
              model: UserPayment,
              attributes: [
                'id',
                'amount',
                'paymentStatus',
                'verifierId',
                'verifyDate',
                'userId',
              ],
              where: PaymentFiltersCondition,
              include: [
                {
                  model: User,
                  as: 'User',
                  attributes: ['firstName', 'lastName'],
                },
              ],
            },
          ],
        },
        {page, pageSize, sortBy, sortValue}
      )
    );
    res.status(200).json({
      ...resMsg.getMsg(200),
      count: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      result: rows,
    });
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
