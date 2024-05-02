module.exports = (sequelize, DataTypes) => {
  const MainCategory = sequelize.define(
    'MainCategory',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );
  MainCategory.associate = (db) => {
    MainCategory.hasMany(db.BrandCategory, {
      foreignKey: {
        name: 'mainCategoryId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return MainCategory;
};
