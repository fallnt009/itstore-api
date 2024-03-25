module.exports = (sequelize, DataTypes) => {
  const ProductCategory = sequelize.define(
    'ProductCategory',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );
  return ProductCategory;
};
