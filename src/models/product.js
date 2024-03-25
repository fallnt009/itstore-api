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

  Product.associate = (db) => {
    Product.belongsTo(db.ProductBrand, {
      foreignKey: {
        name: 'productBrandId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Product.belongsTo(db.ProductCategory, {
      foreignKey: {
        name: 'productCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Product.hasMany(db.Wishlist, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });

    Product.hasMany(db.ProductDetail, {
      foreignKey: {
        name: 'productDetailId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Product.hasOne(db.OrderItem, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
    Product.hasOne(db.Discount, {
      foreignKey: {
        name: 'productId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return Product;
};
