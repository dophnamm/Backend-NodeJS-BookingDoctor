'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Allcode extends Model {

    static associate(models) {
      // define association here
      Allcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' })
      Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' })
      Allcode.hasMany(models.Schedules, { foreignKey: 'timeType', as: 'timeTypeData' })

      Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'priceId', as: 'priceTypeData' })
      Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'provinceId', as: 'provinceTypeData' })
      Allcode.hasMany(models.Doctor_Infor, { foreignKey: 'paymentId', as: 'paymentTypeData' })

    }
  };
  Allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Allcode',
  });
  return Allcode;
};