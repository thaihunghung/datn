const RubricQuestionModel = require('../models/RubricQuestionModel'); 

const Rubric_QuestionController = {

  // Get all PoPlo
  getAll: async (req, res) => {
    try {
      const PoPlo = await RubricQuestionModel.findAll();
      res.json(PoPlo);
    } catch (error) {
      console.error('Error getting all Rubric_Question:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  SaveOrDelete: async (req, res) => {
    try {
      const { dataSave, dataDelete } = req.body;

      if (dataSave && dataSave.length > 0) {
          await RubricQuestionModel.bulkCreate(dataSave);
      }
      console.log(dataDelete);
      if (dataDelete && dataDelete.length > 0) {
          await RubricQuestionModel.destroy({ where: { id_rubric_question : dataDelete.map(item => item.id_rubric_question ) } });
      }

      res.json({ message: 'Data saved and/or deleted successfully' });
    } catch (error) {
      console.error('Error SaveOrDelete:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = Rubric_QuestionController;
