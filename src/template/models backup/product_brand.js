module.exports = (sequelize, DataTypes) => {
  const ProductBrand = sequelize.define(
    'ProductBrand',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );
  return ProductBrand;
};
