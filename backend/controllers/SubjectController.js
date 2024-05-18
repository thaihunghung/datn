const SubjectModel = require("../models/SubjectModel");

const SubjectController = {
  index: async (req, res) => {
    try {
      const subjects = await SubjectModel.findAll();
      res.status(200).json(subjects);
    } catch (error) {
      console.error('Error fetching all subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newSubject = await SubjectModel.create(data);
      res.status(201).json(newSubject);
    } catch (error) {
      console.error('Error creating subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      res.status(200).json(subject);
    } catch (error) {
      console.error('Error fetching subject by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      await SubjectModel.update(data, { where: { subject_id: id } });
      res.status(200).json({ message: `Successfully updated subject with ID: ${id}` });
    } catch (error) {
      console.error('Error updating subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      await SubjectModel.destroy({ where: { subject_id: id } });
      res.status(200).json({ message: 'Successfully deleted subject' });
    } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const deletedSubjects = await SubjectModel.findAll({ where: { isDelete: true } });
      res.status(200).json(deletedSubjects);
    } catch (error) {
      console.error('Error fetching deleted subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const activeSubjects = await SubjectModel.findAll({ where: { isDelete: false } });
      res.status(200).json(activeSubjects);
    } catch (error) {
      console.error('Error fetching active subjects:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await SubjectModel.findOne({ where: { subject_id: id } });
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      const updatedIsDeleted = !subject.isDelete;
      await SubjectModel.update({ isDelete: updatedIsDeleted }, { where: { subject_id: id } });
      res.status(200).json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error toggling isDelete status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = SubjectController;
