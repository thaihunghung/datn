const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RubricModel = require('./RubricModel');
const QuestionModel = require('./QuestionModel');

const MapRubricQuestionModel = sequelize.define('MapRubricQuestion', {
  id_rubric_question: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  rubric_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RubricModel,
      key: 'rubric_id'
    }
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: QuestionModel,
      key: 'question_id'
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
  tableName: 'map_rubric_questions'
});

module.exports = MapRubricQuestionModel;
