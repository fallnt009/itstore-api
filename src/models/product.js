module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      productImage: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      onPromotion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {underscored: true}
  );
  return Product;
};
