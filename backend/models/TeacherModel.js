const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TeacherModel = sequelize.define('teacher', {
  teacher_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  typeTeacher: {
    type: DataTypes.ENUM('GVCV', 'GVGD'),
    allowNull: false
  },
  teacherCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
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
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'teachers',
});

module.exports = TeacherModel;
