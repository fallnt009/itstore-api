module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    'Service',
    {
      name: {type: DataTypes.STRING, allowNull: false},
      price: {type: DataTypes.STRING, allowNull: false},
      description: {type: DataTypes.STRING, allowNull: false},
    },
    {underscored: true}
  );

  Service.associate = (db) => {
    Service.hasOne(db.Checkout, {
      foreignKey: {
        name: 'serviceId',
      },
      onDelete: 'RESTRICT',
    });
    Service.hasOne(db.OrderDetail, {
      foreignKey: {
        name: 'serviceId',
      },
      onDelete: 'RESTRICT',
    });
  };
  return Service;
};
