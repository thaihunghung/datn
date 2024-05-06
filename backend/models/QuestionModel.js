const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ChapterModel = require('./ChapterModel');

const QuestionModel = sequelize.define('Question', {
  question_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isDelete: {
    type: DataTypes.TINYINT,
    defaultValue: 0
  },
  chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ChapterModel,
      key: 'chapter_id'
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
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'clos',
});

module.exports = QuestionModel;
