const PO = require('../models/PoModel'); 
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const PoController = {

  index: async (req, res) => {
    try {
      const pos = await PO.findAll();
      res.json(pos);
    } catch (error) {
      console.error('Error getting all POs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newPO = await PO.create(data);
      res.status(201).json({ message: 'PO created successfully', data: newPO });
    } catch (error) {
      console.error('Error creating PO:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const po = await PO.findOne({ where: { po_id: id }});
      if (!po) {
        return res.status(404).json({ message: 'PO not found' });
      }
      res.json(po);
    } catch (error) {
      console.error('Error finding PO:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const [updated] = await PO.update(data, { where: { po_id: id } });
      if (!updated) {
        return res.status(404).json({ message: 'PO not found' });
      }
      res.json({ message: 'PO updated successfully' });
    } catch (error) {
      console.error('Error updating PO:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedCount = await PO.destroy({ where: { po_id: id } });
      if (!deletedCount) {
        return res.status(404).json({ message: 'PO not found' });
      }
      res.json({ message: 'PO deleted successfully' });
    } catch (error) {
      console.error('Error deleting PO:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isDeleteToTrue: async (req, res) => {
    try {
      const pos = await PO.findAll({ where: { isDelete: true } });
      res.json(pos);
    } catch (error) {
      console.error('Error finding deleted POs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isDeleteToFalse: async (req, res) => {
    try {
      const pos = await PO.findAll({ where: { isDelete: false } });
      res.json(pos);
    } catch (error) {
      console.error('Error finding active POs:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  toggleDelete: async (req, res) => {
    try {
      const { id } = req.params;
      const po = await PO.findOne({ where: { po_id: id } });
      if (!po) {
        return res.status(404).json({ message: 'PO not found' });
      }
      const updatedIsDeleted = !po.isDelete;
      await PO.update({ isDelete: updatedIsDeleted }, { where: { po_id: id } });
      res.json({ message: `PO delete status toggled to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error toggling PO delete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  getFormPost: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('PO');

    worksheet.columns = [
      { header: 'Mã chương trình', key: 'program_id', width: 20 },
      { header: 'Tên PO', key: 'poName', width: 20 },
      { header: 'Mô tả', key: 'description', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="PoForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },
};

module.exports = PoController;
