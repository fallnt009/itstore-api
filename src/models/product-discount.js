module.exports = (sequelize, DataTypes) => {
  const ProductDiscount = sequelize.define(
    'ProductDiscount',
    {},
    {underscored: true}
  );

  ProductDiscount.associate = (db) => {
    ProductDiscount.belongsTo(db.Discount, {
      foreignKey: {
        name: 'discountId',
      },
      onDelete: 'RESTRICT',
    });
    ProductDiscount.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return ProductDiscount;
};
