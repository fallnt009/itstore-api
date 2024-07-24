module.exports = (sequelize, DataTypes) => {
  const SpecProduct = sequelize.define(
    'SpecProduct',
    {
      value: {
        type: DataTypes.INTEGER,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );

  SpecProduct.associate = (db) => {
    SpecProduct.belongsTo(db.SpecSubcategory, {
      foreignKey: {
        name: 'specSubcategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    SpecProduct.belongsTo(db.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return SpecProduct;
};
