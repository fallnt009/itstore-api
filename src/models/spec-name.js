module.exports = (sequelize, DataTypes) => {
  const SpecName = sequelize.define(
    'SpecName',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );

  SpecName.associate = (db) => {
    SpecName.hasOne(db.SpecItem, {
      foreignKey: {
        name: 'specNameId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };

  return SpecName;
};
