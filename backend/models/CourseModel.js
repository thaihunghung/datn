const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CloModel = require('./CloModel');

const CourseModel = sequelize.define('Course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  courseName: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  clo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CloModel,
      key: 'clo_id'
    }
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
  tableName: 'courses',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = CourseModel;
