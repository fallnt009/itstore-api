const {
  STATUS_PENDING,
  STATUS_PROCESSING,
  STATUS_CANCELED,
  STATUS_COMPLETED,
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      orderStatus: {
        type: DataTypes.ENUM(
          STATUS_PENDING,
          STATUS_PROCESSING,
          STATUS_CANCELED,
          STATUS_COMPLETED
        ),
        allowNull: false,
        defaultValue: STATUS_PENDING,
      },
      totalAmount: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );

  Order.associate = (db) => {
    Order.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Order.belongsTo(db.UserPayment, {
      foreignKey: {
        name: 'userPaymentId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Order.belongsTo(db.OrderDetail, {
      foreignKey: {
        name: 'orderDetailId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Order.hasMany(db.OrderItem, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Order;
};
