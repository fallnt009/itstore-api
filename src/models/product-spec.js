module.exports = (sequelize, DataTypes) => {
  const ProductSpec = sequelize.define(
    'ProductSpec',
    {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );

  ProductSpec.associate = (db) => {
    ProductSpec.belongsTo(db.SpecItem, {
      foreignKey: {
        name: 'specItemId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    ProductSpec.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return ProductSpec;
};
