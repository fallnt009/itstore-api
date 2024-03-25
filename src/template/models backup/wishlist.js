module.exports = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {}, {underscored: true});
  return Wishlist;
};
