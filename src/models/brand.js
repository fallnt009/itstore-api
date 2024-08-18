module.exports = (sequelize, DataTypes) => {
  const Brand = sequelize.define(
    'Brand',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {underscored: true}
  );
  Brand.associate = (db) => {
    Brand.hasOne(db.BrandCategory, {
      foreignKey: {
        name: 'brandId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return Brand;
};
