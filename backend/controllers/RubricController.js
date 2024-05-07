const RubricModel = require('../models/RubricModel');

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
};

module.exports = RubricController;
