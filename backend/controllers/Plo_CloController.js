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
  SaveCloPlo: async (req, res) => {
    try {
      const { dataSave } = req.body;
  
      if (dataSave && dataSave.length > 0) {
        await PloCloModel.bulkCreate(dataSave);
        res.status(200).json({ message: 'Data saved successfully', status: 'success' });
      } else {
        res.status(400).json({ message: 'No data provided for saving', status: 'failure' });
      }
    } catch (error) {
      console.error('Error in SavePoPlo:', error);
      res.status(500).json({ message: 'Internal server error', status: 'error' });
    }
  }, 
  
  
  
  DeleteCloPlo: async (req, res) => {
    try {
      const { dataDelete } = req.body;
  
      if (dataDelete && dataDelete.length > 0) {
        await PloCloModel.destroy({
          where: { id_plo_clo: dataDelete.map(item => item.id_plo_clo) }
        });
        res.status(200).json({ message: 'Data deleted successfully', status: 'success' });
      } else {
        res.status(400).json({ message: 'No data provided for deletion', status: 'failure' });
      }
    } catch (error) {
      console.error('Error in DeletePoPlo:', error);
      res.status(500).json({ message: 'Internal server error', status: 'error' });
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

  GetPloCloByCloIds : async (req, res) => {
    try {
      const { data } = req.body;
      const {id_clos} = data;
      console.log(data);
      console.log(id_clos);

      const ploClos = await PloCloModel.findAll({
          where: {
              clo_id: id_clos
          }
      });

      if (ploClos.length === 0) {
          return res.status(404).json({ message: 'No PLO-CLOs found for the given CLO IDs' });
      }

      res.status(200).json(ploClos);
  } catch (error) {
      console.error('Error fetching PLO-CLOs by CLO IDs:', error);
      res.status(500).json({ message: 'An error occurred while fetching PLO-CLOs' });
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
