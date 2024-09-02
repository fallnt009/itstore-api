module.exports = (sequelize, DataTypes) => {
  const ProductSubSpec = sequelize.define(
    'ProductSubSpec',
    {value: {type: DataTypes.INTEGER}},
    {underscored: true}
  );
  ProductSubSpec.associate = (db) => {
    ProductSubSpec.belongsTo(db.SpecProduct, {
      foreignKey: {
        name: 'specProductId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    ProductSubSpec.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return ProductSubSpec;
};
