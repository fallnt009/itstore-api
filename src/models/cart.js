module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {}, {underscored: true});
  Cart.associate = (db) => {
    Cart.belongsTo(db.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Cart.hasMany(db.CartItem, {
      foreignKey: {
        name: 'cartId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Cart;
};
