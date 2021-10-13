'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedules extends Model {

    static associate(models) {
      // define association here
      Schedules.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData' })
      Schedules.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorData' })

    }
  };
  Schedules.init({
    currentNumber: DataTypes.INTEGER,
    maxNumber: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Schedules',
  });
  return Schedules;
};