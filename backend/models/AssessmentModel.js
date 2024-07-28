const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RubricModel = require('./RubricModel');
const CourseModel = require('./CourseModel');
const TeacherModel = require('./TeacherModel');
const StudentModel = require('./StudentModel');

const AssessmentModel = sequelize.define('Assessment', {
  assessment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TeacherModel,
      key: 'teacher_id'
    }
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: StudentModel,
      key: 'student_id'
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
  totalScore: {
    type: DataTypes.DOUBLE(8, 2),
    defaultValue: 0.00
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
AssessmentModel.belongsTo(TeacherModel, { foreignKey: 'teacher_id' });
AssessmentModel.belongsTo(StudentModel, { foreignKey: 'student_id' });
AssessmentModel.belongsTo(RubricModel, { foreignKey: 'rubric_id' });
AssessmentModel.belongsTo(CourseModel, { foreignKey: 'course_id' });

module.exports = AssessmentModel;
