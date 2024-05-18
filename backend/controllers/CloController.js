const CloModel = require("../models/CloModel");

const CloController = {
  index: async (req, res) => {
    try {
      const clos = await CloModel.findAll();
      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting all CLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  GetCloBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const clos = await CloModel.findAll({ where: { subject_id: subject_id } });
      if (!clos.length) {
        return res.status(404).json({ message: 'No CLOs found for the given subject ID' });
      }
      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting CLOs by subject ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newCLO = await CloModel.create(data);
      res.status(201).json(newCLO);
    } catch (error) {
      console.error('Error creating CLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'CLO not found' });
      }
      res.status(200).json(clo);
    } catch (error) {
      console.error('Error getting CLO by ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'CLO not found' });
      }
      await CloModel.update(data, { where: { clo_id: id } });
      res.status(200).json({ message: `Successfully updated CLO with ID: ${id}` });
    } catch (error) {
      console.error('Error updating CLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'CLO not found' });
      }
      await CloModel.destroy({ where: { clo_id: id } });
      res.status(200).json({ message: 'Successfully deleted CLO' });
    } catch (error) {
      console.error('Error deleting CLO:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTotrue: async (req, res) => {
    try {
      const clos = await CloModel.findAll({ where: { isDelete: true } });
      if (!clos.length) {
        return res.status(404).json({ message: 'No deleted CLOs found' });
      }
      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting deleted CLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isDeleteTofalse: async (req, res) => {
    try {
      const clos = await CloModel.findAll({ where: { isDelete: false } });
      if (!clos.length) {
        return res.status(404).json({ message: 'No active CLOs found' });
      }
      res.status(200).json(clos);
    } catch (error) {
      console.error('Error getting active CLOs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const clo = await CloModel.findOne({ where: { clo_id: id } });
      if (!clo) {
        return res.status(404).json({ message: 'CLO not found' });
      }
      const updatedIsDeleted = !clo.isDelete;
      await CloModel.update({ isDelete: updatedIsDeleted }, { where: { clo_id: id } });
      res.status(200).json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error toggling isDelete status:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = CloController;
