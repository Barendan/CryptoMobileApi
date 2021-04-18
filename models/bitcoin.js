'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bitcoin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Bitcoin.init({
    name: DataTypes.STRING,
    symbol: DataTypes.STRING,
    price: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    favorite: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Bitcoin',
  });
  return Bitcoin;
};