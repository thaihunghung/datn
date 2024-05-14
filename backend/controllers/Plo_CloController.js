const PloCloModel = require('../models/PloCloModel'); 
const PloModel = require('../models/PloModel'); 

const Plo_CloController = {

  // Get all PloClo
  getAll: async (req, res) => {
    try {
      const PoPlo = await PloCloModel.findAll();
      res.json(PoPlo);
    } catch (error) {
      console.error('Error getting all PloClo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  GetPloCloByCloId: async (req, res) => {
    try {
      const {clo_id} = req.params
      const PoPlo = await PloCloModel.findAll({
        where: {clo_id: clo_id},
      });
      const plo_ids = PoPlo.map((item) => item.plo_id)
      const Plo = await PloModel.findAll({
        where: {plo_id: plo_ids},
      });
      res.json(Plo);
    } catch (error) {
      console.error('Error getting all PloClo:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  SaveOrDelete: async (req, res) => {
    try {
      const { dataSave, dataDelete } = req.body;
      console.log(dataSave);
      if (dataSave && dataSave.length > 0) {
          await PloCloModel.bulkCreate(dataSave);
      }

      if (dataDelete && dataDelete.length > 0) {
          await PloCloModel.destroy({ where: { id_plo_clo: dataDelete.map(item => item.id_plo_clo) } });
      }

      res.json({ message: 'Data saved and/or deleted successfully' });
    } catch (error) {
      console.error('Error SaveOrDelete:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = Plo_CloController;
