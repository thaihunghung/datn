const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const UserModel = sequelize.define('user', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(100), // Ensure sufficient length
    allowNull: false
  },
  permission: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  isBlock: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
  }
}, {
  timestamps: true,
  tableName: 'users',
  // hooks: {
  //   beforeCreate: async (user) => {
  //     const salt = await bcrypt.genSalt(10);
  //     user.password = await bcrypt.hash(user.password, salt);
  //   }
  // }
});

module.exports = UserModel;
