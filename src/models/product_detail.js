module.exports = (sequelize, DataTypes) => {
  const ProductDetail = sequelize.define(
    'ProductDetail',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );
  return ProductDetail;
};
