'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey : 'userId'
      })

      this.hasMany(models.Item, {
        as: 'items',
        foreignKey : 'orderId'
      })
    }
  }
  Order.init({
    userId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};