module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      quantity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );
  return OrderItem;
};
