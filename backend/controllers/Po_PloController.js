const PoPloModel = require('../models/PoPloModel'); 

const Po_PloController = {

  // Get all PoPlo
  getAll: async (req, res) => {
    try {
      const PoPlo = await PoPloModel.findAll();
      res.json(PoPlo);
    } catch (error) {
      console.error('Error getting all PoPlo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  SaveOrDelete: async (req, res) => {
    try {
      const { dataSave, dataDelete } = req.body;

      if (dataSave && dataSave.length > 0) {
          await PoPloModel.bulkCreate(dataSave);
      }

      if (dataDelete && dataDelete.length > 0) {
          await PoPloModel.destroy({ where: { id: dataDelete.map(item => item.id) } });
      }

      res.json({ message: 'Data saved and/or deleted successfully' });
    } catch (error) {
      console.error('Error SaveOrDelete:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = Po_PloController;
