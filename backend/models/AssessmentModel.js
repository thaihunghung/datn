const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RubricModel = require('./RubricModel');
const CourseModel = require('./CourseModel');
const UserModel = require('./UserModel');

const AssessmentModel = sequelize.define('Assessment', {
  assessment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id'
    }
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id'
    }
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserModel,
      key: 'user_id'
    }
  },
  rubric_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RubricModel,
      key: 'rubric_id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CourseModel,
      key: 'course_id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  place: {
    type: DataTypes.TEXT,
    defaultValue: null
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
  tableName: 'assessments'
});

module.exports = AssessmentModel;
