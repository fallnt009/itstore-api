const {
  ORDER_PENDING,
  ORDER_PROCESSING,
  ORDER_COMPLETED,
  ORDER_CANCELED,
} = require('../config/constants');

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      status: {
        type: DataTypes.ENUM(
          ORDER_PENDING,
          ORDER_PROCESSING,
          ORDER_COMPLETED,
          ORDER_CANCELED
        ),
        allowNull: false,
        defaultValue: ORDER_PENDING,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      trackingNum: {
        type: DataTypes.STRING,
      },
      shippingCoName: {
        type: DataTypes.STRING,
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
    Order.hasMany(db.OrderItem, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Order.hasOne(db.Transaction, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Order;
};
