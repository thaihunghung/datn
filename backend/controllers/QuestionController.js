const QuestionModel = require('../models/QuestionModel');

const QuestionController = {
  // Get all questions
  index: async (req, res) => {
    try {
      const questions = await QuestionModel.findAll();
      res.json(questions);
    } catch (error) {
      console.error('Error getting all questions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  // Create a new question
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newQuestion = await QuestionModel.create(data);
      res.json(newQuestion);
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get question by ID
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const question = await QuestionModel.findOne({ where: { question_id: id } });
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      res.json(question);
    } catch (error) {
      console.error('Error finding question:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Update question
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const question = await QuestionModel.findOne({ where: { question_id: id } });
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      const updatedQuestion = await QuestionModel.update(data, { where: { question_id: id } });
      res.json({ message: `Successfully updated question with ID: ${id}` });
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Delete question
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await QuestionModel.destroy({ where: { question_id: id } });
      res.json({ message: 'Successfully deleted question' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get questions with isDelete = true
  isDeleteTotrue: async (req, res) => {
    try {
      const questions = await QuestionModel.findAll({ where: { isDelete: true } });
      if (!questions) {
        return res.status(404).json({ message: 'No questions found' });
      }
      res.json(questions);
    } catch (error) {
      console.error('Error finding questions with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Get questions with isDelete = false
  isDeleteTofalse: async (req, res) => {
    try {
      const questions = await QuestionModel.findAll({ where: { isDelete: false } });
      if (!questions) {
        return res.status(404).json({ message: 'No questions found' });
      }
      res.json(questions);
    } catch (error) {
      console.error('Error finding questions with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  // Toggle isDelete status of a question
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      console.log('isDelete', id);
      const question = await QuestionModel.findOne({ where: { question_id: id } });
      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }
      const updatedIsDeleted = !question.isDelete;
      await QuestionModel.update({ isDelete: updatedIsDeleted }, { where: { question_id: id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = QuestionController;
