const PO = require('../models/PoModel');
const ProgramModel = require('../models/ProgramModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const PoModel = require('../models/PoModel');

const PoController = {
  index: async (req, res) => {
    try {
      const pos = await PO.findAll({
        include: {
          model: ProgramModel,
          attributes: ['program_id', 'programName']
        }
      });
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
      const po = await PO.findOne({ where: { po_id: id } });
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

  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const po = await PO.findOne({ where: { po_id: id } });
      if (!po) {
        return res.status(404).json({ message: 'po not found' });
      }
      const updatedIsDeleted = !po.isDelete;
      await PO.update({ isDelete: updatedIsDeleted }, { where: { po_id: id } });

      res.status(200).json({ message: `Toggled isDelete status to ${updatedIsDeleted}` });


    } catch (error) {
      console.error('Error toggling PO delete statuses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  softDeleteMultiple: async (req, res) => {
    try {
      const { data } = req.body;
      const { po_id } = data;
      if (!Array.isArray(po_id) || po_id.length === 0) {
        return res.status(400).json({ message: 'No PO ids provided' });
      }

      const pos = await PO.findAll({ where: { po_id: po_id } });
      if (pos.length !== po_id.length) {
        return res.status(404).json({ message: 'One or more POs not found' });
      }

      const updatedPos = await Promise.all(pos.map(async (po) => {
        const updatedIsDeleted = !po.isDelete;
        await po.update({ isDelete: updatedIsDeleted });
        return { po_id: po.po_id, isDelete: updatedIsDeleted };
      }));

      res.json({ message: 'PO delete statuses toggled', updatedPos });
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

  getFormUpdate: async (req, res) => {
    try {
      const { data } = req.body;
      if (!data || !data.id) {
        return res.status(400).json({ message: 'Invalid input data. Expected format: { data: { id: [1, 2, 3] } }' });
      }

      const { id } = data;
      const pos = await PO.findAll({ where: { po_id: id } });

      if (!pos || pos.length === 0) {
        return res.status(404).json({ message: 'POs not found' });
      }

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('PO');

      worksheet.columns = [
        { header: 'Mã po (int)', key: 'po_id', width: 20 },
        { header: 'Mã chương trình (int)', key: 'program_id', width: 20 },
        { header: 'Tên PO', key: 'poName', width: 20 },
        { header: 'Mô tả', key: 'description', width: 30 },
      ];

      // Add rows to the worksheet
      pos.forEach(element => {
        worksheet.addRow({
          po_id: element.po_id,
          program_id: element.program_id,
          poName: element.poName,
          description: element.description
        });
      });

      await worksheet.protect('yourpassword', {
        selectLockedCells: true,
        selectUnlockedCells: true
      });

      worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, colNumber) => {
          if (colNumber === 1 || colNumber === 2) {
            cell.protection = { locked: true };
          } else {
            cell.protection = { locked: false };
          }
        });
      });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="PoForm.xlsx"');

      await workbook.xlsx.write(res);
      res.status(200).end();
    } catch (error) {
      console.error('Error generating PO update form:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  processSaveTemplatePo: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }

    const uploadDirectory = path.join(__dirname, '../uploads');
    const filename = req.files[0].filename;
    const filePath = path.join(uploadDirectory, filename);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Error reading the uploaded file' });
    }

    const worksheet = workbook.getWorksheet('PO');
    const jsonData = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonData.push({
          program_id: row.getCell(1).value,
          poName: row.getCell(2).value,
          description: row.getCell(3).value,
        });
      }
    });

    fs.unlinkSync(filePath);
    try {
      const createdPos = await PoModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdPos });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },

  processUpdateTemplatePo: async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const uploadDirectory = path.join(__dirname, '../uploads');
    const filename = req.files[0].filename;
    const filePath = path.join(uploadDirectory, filename);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (error) {
      console.error('Error reading the uploaded file:', error);
      return res.status(500).json({ message: 'Error reading the uploaded file' });
    }

    const worksheet = workbook.getWorksheet('PO');
    const updateData = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        updateData.push({
          po_id: row.getCell(1).value,
          program_id: row.getCell(2).value,
          poName: row.getCell(3).value,
          description: row.getCell(4).value,
        });
      }
    });

    fs.unlinkSync(filePath);

    try {
      await Promise.all(updateData.map(async (data) => {
        const updatedRows = await PoModel.update(
          {
            program_id: data.program_id,
            poName: data.poName,
            description: data.description
          },
          { where: { po_id: data.po_id } }
        );

        if (updatedRows[0] === 0) {
          console.warn(`No PO found with ID ${data.po_id} for update`);
        }
      }));

      return res.status(200).json({ message: 'POs updated successfully' });
    } catch (error) {
      console.error('Error updating POs:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = PoController;
