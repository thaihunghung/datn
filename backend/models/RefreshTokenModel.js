const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đường dẫn tới file cấu hình database của bạn

class RefreshToken extends Model {}

RefreshToken.init({
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'refresh_token',
  timestamps: true
});

module.exports = RefreshToken;
