module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    'Address',
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subdistrict: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      province: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {underscored: true}
  );

  Address.associate = (db) => {
    Address.hasOne(db.UserAddress, {
      foreignKey: {
        name: 'addressId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
    });
  };
  return Address;
};
