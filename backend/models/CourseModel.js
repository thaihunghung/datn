const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ClassModel = require('./ClassModel');
const TeacherModel = require('./TeacherModel');
const SubjectModel = require('./SubjectModel');
const SemesterModel = require('./SemesterModel');

const CourseModel = sequelize.define('course', {
  course_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  class_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: ClassModel,
      key: 'class_id'
    }
  },
  teacher_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: TeacherModel,
      key: 'teacher_id'
    }
  },
  subject_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SubjectModel,
      key: 'subject_id' 
    }
  },
  semester_id: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: SemesterModel,
      key: 'semester_id' 
    }
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
  tableName: 'courses'
});

CourseModel.belongsTo(ClassModel, {
  foreignKey: 'class_id'
});

CourseModel.belongsTo(TeacherModel, {
  foreignKey: 'teacher_id'
});

CourseModel.belongsTo(SubjectModel, {
  foreignKey: 'subject_id'
});

CourseModel.belongsTo(SemesterModel, {
  foreignKey: 'semester_id'
});

module.exports = CourseModel;
