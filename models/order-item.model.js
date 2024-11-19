module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      isDiscounted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      discountValue: {
        type: DataTypes.DECIMAL(10, 2),
      },
      unitPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      finalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {underscored: true}
  );
  OrderItem.associate = (db) => {
    OrderItem.belongsTo(db.Order, {
      foreignKey: {
        name: 'orderId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    OrderItem.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return OrderItem;
};
