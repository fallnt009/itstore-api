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
  ProductBrand.associate = (db) => {
    ProductBrand.hasOne(db.Product, {
      foreignKey: {
        name: 'productBrandId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return ProductBrand;
};
