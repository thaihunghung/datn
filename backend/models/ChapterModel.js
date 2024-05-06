const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CourseModel = require('./CourseModel');

const ChapterModel = sequelize.define('Chapter', {
  chapter_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chapterName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CourseModel,
      key: 'course_id'
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
  timestamps: true,
  tableName: 'chapters',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

module.exports = ChapterModel;
