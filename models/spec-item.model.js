module.exports = (sequelize, DataTypes) => {
  const SpecItem = sequelize.define(
    'SpecItem',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );

  SpecItem.associate = (db) => {
    SpecItem.hasOne(db.SpecSubcategory, {
      foreignKey: {
        name: 'specItemId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return SpecItem;
};
