const { Sequelize, DataTypes } = require('sequelize');

const RubricModel = require('../models/RubricModel');
const RubricItemModel = require('../models/RubricItemModel');
const SubjectModel = require('../models/SubjectModel');
const CloModel = require('../models/CloModel');
const ChapterModel = require('../models/ChapterModel');

const RubricController = {
  // Get all rubrics
  index: async (req, res) => {
    try {
      const rubrics = await RubricModel.findAll();
      res.json(rubrics);
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new rubric
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newrubric = await RubricModel.create(data);
      res.json(newrubric);
    } catch (error) {
      console.error('Error creating rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get rubric by ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const rubric = await RubricModel.findOne({ where: { rubric_id: id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      res.json(rubric);
    } catch (error) {
      console.error('Error finding rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Update rubric
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const rubric = await RubricModel.findOne({ where: { rubric_id: id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      const updatedrubric = await RubricModel.update(data, { where: { rubric_id: id } });
      res.json({ message: `Successfully updated rubric with ID: ${id}` });
    } catch (error) {
      console.error('Error updating rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Delete rubric
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await RubricModel.destroy({ where: { rubric_id: id } });
      res.json({ message: 'Successfully deleted rubric' });
    } catch (error) {
      console.error('Error deleting rubric:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get rubrics with isDelete = true
  isDeleteTotrue: async (req, res) => {
    try {
      const rubrics = await RubricModel.findAll({ where: { isDelete: true } });
      if (!rubrics) {
        return res.status(404).json({ message: 'No rubrics found' });
      }
      res.json(rubrics);
    } catch (error) {
      console.error('Error finding rubrics with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get rubrics with isDelete = false
  isDeleteTofalse: async (req, res) => {
    try {
      const rubrics = await RubricModel.findAll({ where: { isDelete: false } });
      if (!rubrics) {
        return res.status(404).json({ message: 'No rubrics found' });
      }
      res.json(rubrics);
    } catch (error) {
      console.error('Error finding rubrics with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Toggle isDelete status of a rubric
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('isDelete', id);
      const rubric = await RubricModel.findOne({ where: { rubric_id: id } });
      if (!rubric) {
        return res.status(404).json({ message: 'rubric not found' });
      }
      const updatedIsDeleted = !rubric.isDelete;
      await RubricModel.update({ isDelete: updatedIsDeleted }, { where: { rubric_id: id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // const RubricModel = require('../models/RubricModel');
  // const RubricItemModel = require('../models/RubricItemModel');
  GetByUserAndCheckScore: async (req, res) => {
    try {

      const rubrics = await RubricModel.findAll();
      const rubricIds = rubrics.map(rubric => rubric.rubric_id);

      const results = await RubricItemModel.findAll({
        attributes: ['rubric_id', [Sequelize.fn('SUM', Sequelize.col('score')), 'total_score']],
        where: { rubric_id: rubricIds },
        group: ['rubric_id']
      });
      const rubricScores = results.map(result => ({
        rubric_id: result.rubric_id,
        total_score: result.dataValues.total_score
      }));

      const rubricsWithScores = await Promise.all(rubricScores.map(async rubricScore => {
        const rubric = await RubricModel.findByPk(rubricScore.rubric_id);
        let checkScore10 = 'no';
        if (rubricScore.total_score === 10) {
          checkScore10 = 'yes';
        }
        return {
          rubric_id: rubric.rubric_id,
          rubric_name: rubric.rubricName,
          total_itemRubric_score: rubricScore.total_score,
          checkScore10: checkScore10
        };
      }));

      res.json(rubricsWithScores);
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  GetItemsRubricsByIdRubrics: async (req, res) => {
    try {
      const { id } = req.params;
      const rubric = await RubricModel.findOne({
        where: { rubric_id: id },
        include: [{
          model: SubjectModel,
          attributes: ['subject_id', 'subjectName']
        }]
      });
      if (rubric) {
        const [rubricItems, Clos, Chapters] = await Promise.all([
          RubricItemModel.findAll({
            where: { 
              rubric_id: rubric.rubric_id,
            },
            include: [{
              model: CloModel,
              attributes: ['clo_id', 'cloName', 'description']
            }, {
              model: ChapterModel,
              attributes: ['chapter_id', 'chapterName', 'description']
            }]
          }),
          CloModel.findAll({ where: { subject_id: rubric.subject_id } }),
          ChapterModel.findAll({ where: { subject_id: rubric.subject_id } })
        ]);
        // Gán kết quả cho các thuộc tính của rubric

        rubric.dataValues.rubricItems = rubricItems;
        rubric.dataValues.CloData = Clos;
        rubric.dataValues.ChapterData = Chapters;

        res.json({ rubric: rubric });
      } else {
        console.log('Rubric not found');
      }
    } catch (error) {
      console.error('Error getting all rubrics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = RubricController;