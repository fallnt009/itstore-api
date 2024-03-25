//models sequelize
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      title: {},
    },
    {underscored: true}
  );
  return Product;
};
