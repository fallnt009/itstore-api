module.exports = (sequelize, DataTypes) => {
  const ProductImage = sequelize.define(
    'ProductImage',
    {
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );

  ProductImage.associate = (db) => {
    ProductImage.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return ProductImage;
};
