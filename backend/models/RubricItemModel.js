const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ChapterModel = require('./ChapterModel');
const CloModel = require('./CloModel');
const RubricModel = require('./RubricModel');
const PloModel = require('./PloModel');

const QualityLevelsModel = require('./QualityLevelsModel');

const RubricsItemModel = sequelize.define('rubricsItem', {
  rubricsItem_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  chapter_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: ChapterModel,
      key: 'chapter_id'
    }
  },
  clo_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: CloModel,
      key: 'clo_id'
    }
  },
  rubric_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: RubricModel,
      key: 'rubric_id'
    }
  },
  plo_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: PloModel,
      key: 'plo_id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  score: {
    type: DataTypes.DOUBLE(8, 2),
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
  modelName: 'RubricItemModel',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  tableName: 'rubricsItems'
});
RubricsItemModel.belongsTo(RubricModel, { foreignKey: 'rubric_id' });
RubricsItemModel.belongsTo(CloModel, { foreignKey: 'clo_id' });
RubricsItemModel.belongsTo(ChapterModel, { foreignKey: 'chapter_id' });

module.exports = RubricsItemModel;
