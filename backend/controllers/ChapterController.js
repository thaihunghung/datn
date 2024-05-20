const ChapterModel = require('../models/ChapterModel');
const SubjectModel = require('../models/SubjectModel');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const ChapterController = {
  index: async (req, res) => {
    try {
      const chapters = await ChapterModel.findAll();
      res.json(chapters);
    } catch (error) {
      console.error('Error getting all chapters:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  create: async (req, res) => {
    try {
      const { data } = req.body;
      const newChapter = await ChapterModel.create(data);
      res.json(newChapter);
    } catch (error) {
      console.error('Error creating chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.json(chapter);
    } catch (error) {
      console.error('Error finding chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  GetChapterBySubjectId: async (req, res) => {
    try {
      const { subject_id } = req.params;
      const chapter = await ChapterModel.findAll({ where: { subject_id: subject_id, isDelete: false },
        include: [{
          model: SubjectModel,
          attributes: ['subject_id', 'subjectName']
        }] });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      res.json(chapter);
    } catch (error) {
      console.error('Error finding chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }, 
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const updatedChapter = await ChapterModel.update(data, { where: { chapter_id: id } });
      res.json({ message: `Successfully updated chapter with ID: ${id}` });
    } catch (error) {
      console.error('Error updating chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await ChapterModel.destroy({ where: { chapter_id: id } });
      res.json({ message: 'Successfully deleted chapter' });
    } catch (error) {
      console.error('Error deleting chapter:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const chapters = await ChapterModel.findAll({ where: { isDelete: true } });
      if (!chapters) {
        return res.status(404).json({ message: 'No chapters found' });
      }
      res.json(chapters);
    } catch (error) {
      console.error('Error finding chapters with isDelete true:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  isDeleteTofalse: async (req, res) => {
    try {
      const chapters = await ChapterModel.findAll({ where: { isDelete: false } });
      if (!chapters) {
        return res.status(404).json({ message: 'No chapters found' });
      }
      res.json(chapters);
    } catch (error) {
      console.error('Error finding chapters with isDelete false:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  isdelete: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const updatedIsDeleted = !chapter.isDelete;
      await ChapterModel.update({ isDelete: updatedIsDeleted }, { where: { chapter_id: id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const chapter = await ChapterModel.findOne({ where: { chapter_id: id } });
      if (!chapter) {
        return res.status(404).json({ message: 'Chapter not found' });
      }
      const updatedIsDeleted = !chapter.isDelete;
      await ChapterModel.update({ isDelete: updatedIsDeleted }, { where: { chapter_id: id } });
      res.json({ message: `Successfully toggled isDelete status to ${updatedIsDeleted}` });

    } catch (error) {
      console.error('Error updating isDelete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  softDeleteMultiple: async (req, res) => {
    try {
      const { data } = req.body;
      const { chapter_id } = data;
      if (!Array.isArray(chapter_id) || chapter_id.length === 0) {
        return res.status(400).json({ message: 'No ChapterModel ids provided' });
      }

      const chapters = await ChapterModel.findAll({ where: { chapter_id: chapter_id } });
      if (chapters.length !== chapter_id.length) {
        return res.status(404).json({ message: 'One or more ChapterModels not found' });
      }

      const updatedChapters = await Promise.all(chapters.map(async (chapter) => {
        const updatedIsDeleted = !chapter.isDelete;
        await chapter.update({ isDelete: updatedIsDeleted });
        return { chapter_id: chapter.chapter_id, isDelete: updatedIsDeleted };
      }));

      res.json({ message: 'ChapterModel delete statuses toggled', updatedChapters });
    } catch (error) {
      console.error('Error toggling ChapterModel delete status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getFormPost: async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('CHAPTER');

    worksheet.columns = [
      { header: 'Tên chapter', key: 'chapterName', width: 20 },
      { header: 'Mô tả', key: 'description', width: 30 },
    ];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="chapter.xlsx"');
    await workbook.xlsx.write(res);
    res.end();
  },

  getFormUpdate: async (req, res) => {
    // try {
    //   const { data } = req.body;
    //   if (!data || !data.id) {
    //     return res.status(400).json({ message: 'Invalid input data. Expected format: { data: { id: [1, 2, 3] } }' });
    //   }

    //   const { id } = data;
    //   const pos = await CloModel.findAll({ where: { clo_id: id } });

    //   if (!pos || pos.length === 0) {
    //     return res.status(404).json({ message: 'CloModels not found' });
    //   }

    //   const workbook = new ExcelJS.Workbook();
    //   const worksheet = workbook.addWorksheet('CLO');

    //   worksheet.columns = [
    //     { header: 'Mã học phần', key: 'subject_id', width: 20 },
    //     { header: 'Tên Clo', key: 'cloName', width: 20 },
    //     { header: 'Mô tả', key: 'description', width: 30 },
    //   ];

    //   // Add rows to the worksheet
    //   pos.forEach(element => {
    //     worksheet.addRow({
    //       clo_id: element.clo_id,
    //       cloName: element.cloName,
    //       description: element.description
    //     });
    //   });

    //   await worksheet.protect('yourpassword', {
    //     selectLockedCells: true,
    //     selectUnlockedCells: true
    //   });

    //   worksheet.eachRow((row, rowNumber) => {
    //     row.eachCell((cell, colNumber) => {
    //       if (colNumber === 1) {
    //         cell.protection = { locked: true };
    //       } else {
    //         cell.protection = { locked: false };
    //       }
    //     });
    //   });
    //   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    //   res.setHeader('Content-Disposition', 'attachment; filename="cloForm.xlsx"');

    //   await workbook.xlsx.write(res);
    //   res.status(200).end();
    // } catch (error) {
    //   console.error('Error generating CloModel update form:', error);
    //   res.status(500).json({ message: 'Server error' });
    // }
  },
  processSaveTemplateChapter: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }
    const subject_id = req.body.data;

    const uploadDirectory = path.join(__dirname, '../uploads');
    const filename = req.files[0].filename;
    const filePath = path.join(uploadDirectory, filename);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Error reading the uploaded file' });
    }

    const worksheet = workbook.getWorksheet('CHAPTER');
    const jsonData = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonData.push({
          subject_id: subject_id,
          chapterName: row.getCell(1).value,
          description: row.getCell(2).value,
        });
      }
    });

    fs.unlinkSync(filePath);
    try {
      const createdChapter= await ChapterModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdChapter });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },

  // processUpdateTemplateChapter: async (req, res) => {
  //   if (!req.files || !req.files.length) {
  //     return res.status(400).json({ message: 'No file uploaded.' });
  //   }

  //   const uploadDirectory = path.join(__dirname, '../uploads');
  //   const filename = req.files[0].filename;
  //   const filePath = path.join(uploadDirectory, filename);

  //   const workbook = new ExcelJS.Workbook();
  //   try {
  //     await workbook.xlsx.readFile(filePath);
  //   } catch (error) {
  //     console.error('Error reading the uploaded file:', error);
  //     return res.status(500).json({ message: 'Error reading the uploaded file' });
  //   }

  //   const worksheet = workbook.getWorksheet('CLO');
  //   const updateData = [];
  //   worksheet.eachRow((row, rowNumber) => {
  //     if (rowNumber > 1) {
  //       updateData.push({
  //         subject_id: row.getCell(1).value,
  //         cloName: row.getCell(2).value,
  //         description: row.getCell(3).value,
  //       });
  //     }
  //   });

  //   fs.unlinkSync(filePath);

  //   try {
  //     await Promise.all(updateData.map(async (data) => {
  //       const updatedRows = await CloModel.update(
  //         {
  //           cloName: data.cloName,
  //           description: data.description
  //         },
  //         { where: { clo_id: data.clo_id } }
  //       );

  //       if (updatedRows[0] === 0) {
  //         console.warn(`No CloModel found with ID ${data.clo_id} for update`);
  //       }
  //     }));

  //     return res.status(200).json({ message: 'CloModels updated successfully' });
  //   } catch (error) {
  //     console.error('Error updating CloModels:', error);
  //     return res.status(500).json({ message: 'Server error' });
  //   }
  // },
};

module.exports = ChapterController;
