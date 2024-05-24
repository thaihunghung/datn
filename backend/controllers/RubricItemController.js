const RubricItemModel = require('../models/RubricItemModel');
const { Sequelize, DataTypes } = require('sequelize');
const RubricModel = require('../models/RubricModel');

const RubricItemController = {
  // Get all RubricsItem
  index: async (req, res) => {
    try {
      const RubricsItem = await RubricItemModel.findAll();
      res.json(RubricsItem);
    } catch (error) {
      console.error('Error getting all RubricsItem:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new rubrics_item
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newrubric = await RubricItemModel.create(data);
      res.json(newrubric);
    } catch (error) {
      console.error('Error creating rubrics_item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  checkScore: async (req, res) => {
    try {
      const { rubric_id } = req.params;
      const { data } = req.body;

      const RubricsItem = await RubricItemModel.findAll({ where: { rubric_id: rubric_id } });
      const results = await RubricItemModel.findAll({
        attributes: ['rubric_id', [Sequelize.fn('SUM', Sequelize.col('score')), 'total_score']],
        where: { rubric_id: rubric_id }
      });

      const rubricScores =await results.map(result => ({
        total_score: result.dataValues.total_score
      }));
      //console.log("rubricScores",data)
      const totalScore = parseFloat(rubricScores[0].total_score) + parseFloat(data.score);
      //console.log('newValue',totalScore);
      if (totalScore <= 10) {
        const newRubric = await RubricItemModel.create(data.data);
        res.status(201).json({ success: true, message: "Rubric item created successfully", data: newRubric });
      } else {
        res.status(400).json({ success: false, message: "Failed to save: Total score exceeds 10" });
      }
    } catch (error) {
      console.error('Error creating rubrics_item:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },


  // Get rubrics_item by ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const rubrics_item = await RubricItemModel.findOne({ where: { rubricsitem_id: id } });
      if (!rubrics_item) {
        return res.status(404).json({ message: 'rubrics_item not found' });
      }
      res.json(rubrics_item);
    } catch (error) {
      console.error('Error finding rubrics_item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Update rubrics_item
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const rubrics_item = await RubricItemModel.findOne({ where: { rubricsitem_id: id } });
      if (!rubrics_item) {
        return res.status(404).json({ message: 'rubrics_item not found' });
      }
      const updatedrubric = await RubricItemModel.update(data, { where: { rubricsitem_id: id } });
      res.json({ message: `Successfully updated rubrics_item with ID: ${id}` });
    } catch (error) {
      console.error('Error updating rubrics_item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Delete rubrics_item
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await RubricItemModel.destroy({ where: { rubricsitem_id: id } });
      res.json({ message: 'Successfully deleted rubrics_item' });
    } catch (error) {
      console.error('Error deleting rubrics_item:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get RubricsItem with isDelete = true
  isDeleteTotrue: async (req, res) => {
    try {
      const RubricsItem = await RubricItemModel.findAll({ where: { isDelete: true } });
      if (!RubricsItem) {
        return res.status(404).json({ message: 'No RubricsItem found' });
      }
      res.json(RubricsItem);
    } catch (error) {
      console.error('Error finding RubricsItem with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get RubricsItem with isDelete = false
  isDeleteTofalse: async (req, res) => {
    try {
      const RubricsItem = await RubricItemModel.findAll({ where: { isDelete: false } });
      if (!RubricsItem) {
        return res.status(404).json({ message: 'No RubricsItem found' });
      }
      res.json(RubricsItem);
    } catch (error) {
      console.error('Error finding RubricsItem with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Toggle isDelete status of a rubrics_item
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('isDelete', id);
      const rubrics_item = await RubricItemModel.findOne({ where: { rubricsitem_id: id } });
      if (!rubrics_item) {
        return res.status(404).json({ message: 'rubrics_item not found' });
      }
      const updatedIsDeleted = !rubrics_item.isDelete;
      await RubricItemModel.update({ isDelete: updatedIsDeleted }, { where: { rubricsitem_id: id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = RubricItemController;
