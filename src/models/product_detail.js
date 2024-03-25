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
  ProductDetail.associate = (db) => {
    ProductDetail.belongsTo(db.Product, {
      foreignKey: {
        name: 'productDetailId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return ProductDetail;
};
