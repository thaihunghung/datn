const ProgramModel = require('../models/ProgramModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const programController = {
  index: async (req, res) => {
    try {
      ProgramModel.findOne({where: { program_id: 1 }})
        .then(programs => {
          return res.json(programs);
        })
        .catch(error => {
          // Xử lý lỗi nếu có
          console.error('Lỗi lấy dữ liệu:', error);
        });

    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  create: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);
      const newProgram = await ProgramModel.create(data);
      res.json(newProgram);
    } catch (error) {
      console.error('Lỗi tạo chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const program = await ProgramModel.findOne({where: { program_id: id }});
      res.json(program);
    } catch (error) {
      console.error('Lỗi tìm kiếm chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedProgram = await ProgramModel.update(data, { where: { program_id: id } });
      if (updatedProgram[0] === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }
      res.json(updatedProgram);
    } catch (error) {
      console.error('Lỗi cập nhật chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await ProgramModel.destroy({ where: { program_id: id } });
      res.json({ message: 'Xóa chương trình thành công' });
    } catch (error) {
      console.error('Lỗi xóa chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const program = await ProgramModel.findOne({ where: { isDelete: true } });

      if (!program) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }

      res.json(program);
    } catch (error) {
      console.error('Lỗi tìm kiếm program:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTofalse: async (req, res) => {
    try {
      const program = await ProgramModel.findOne({ where: { isDelete: false } });
      if (!program) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      res.json(program);
    } catch (error) {
      console.error('Lỗi tìm kiếm program:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const program = await ProgramModel.findOne({ where: { program_id: id } });

      if (!program) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      const updatedIsDeleted = !program.isDelete;
      console.log(updatedIsDeleted);
      ProgramModel.update({ isDelete: updatedIsDeleted }, { where: { program_id: id } })
        .then(programs => {
          console.log(programs);
        })
        .catch(error => {
          console.error(error);
        });
      res.json({ message: `Đã đảo ngược trạng thái isDelete thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái isDelete:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getFormExels: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Program');


    //const CodeClass = await ClassModel.findAll({ attributes: ['classCode'] }, { where: { isDelete: true } });

    worksheet.columns = [
      { header: 'Tên chương trình', key: 'programName', width: 20 },
      { header: 'Mô tả (Html)', key: 'description', width: 30 },
    ];

    // const cellA19 = worksheet.getCell('G1');
    // cellA19.value = 'Các mã lớp';
    // for (let row = 2; row <= CodeClass.length; row++) {
    //   for (let col = 1; col <= 1; col++) {
    //     const cell = worksheet.getCell(row, 7);
    //     cell.value = CodeClass[row-2].classCode;
    //   }
    // }

    // const worksheetData = workbook.addWorksheet('Description');

    // worksheetData.columns = [
    //   { header: 'Mã lớp', key: 'classCode', width: 15 }
    // ];

    // for (let row = 2; row <= CodeClass.length; row++) {
    //   for (let col = 1; col <= 1; col++) {
    //     const cell = worksheetData.getCell(row, 1);
    //     cell.value = CodeClass[row - 2].classCode;
    //   }
    // }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="ProgramsForm.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },
  processUploadedFile: async (req, res) => {
    console.log("dc");

    if (req.files) {
      // Read the uploaded Excel files
      const uploadDirectory = path.join(__dirname, '../uploads');
      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);

      const workbook = new ExcelJS.Workbook();
      try {
        await workbook.xlsx.readFile(filePath);
      } catch (error) {
        return res.status(500).json({ error: 'Error reading the uploaded file' });
      }

      // Extract data from the Excel file
      const worksheet = workbook.getWorksheet('Program');
      const jsonData = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { // Skip header row
          const rowData = {
            programName: row.getCell(1).value,
            description: row.getCell(2).value,
          };
          jsonData.push(rowData);
        }
      });

      fs.unlinkSync(filePath);

      try {
        const createdPrograms = await ProgramModel.bulkCreate(jsonData);
        res.json(createdPrograms);
      } catch (error) {
        console.error('Error saving data to the database:', error);
        res.status(500).json({ error: 'Error saving data to the database' });
      }
    } else {
      res.status(400).send('No file uploaded.');
    }
  }
}

module.exports = programController;
