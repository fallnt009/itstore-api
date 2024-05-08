module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {underscored: true}
  );
  CartItem.associate = (db) => {
    CartItem.belongsTo(db.Cart, {
      foreignKey: {
        name: 'cartId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    CartItem.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return CartItem;
};
