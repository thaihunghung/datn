const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const MetaAssessmentModel = require('../models/MetaAssessmentModel');
const CourseModel = require('../models/CourseModel');
const StudentModel = require('../models/StudentModel');
const ClassModel = require('../models/ClassModel');
const RubricModel = require('../models/RubricModel');
const SubjectModel = require('../models/SubjectModel');
const CloModel = require('../models/CloModel');
const ChapterModel = require('../models/ChapterModel');
const PloModel = require('../models/PloModel');
const RubricsItemModel = require('../models/RubricItemModel');
const AssessmentModel = require('../models/AssessmentModel');
const TeacherModel = require('../models/TeacherModel');

const MetaAssessmentController = {
  // Lấy tất cả các meta assessments
  index: async (req, res) => {
    try {
      const { isDelete, teacher_id, generalDescription } = req.query;

      if (teacher_id && generalDescription) {
        // Logic for GetByDescriptionByUser
        const assessments = await MetaAssessmentModel.findAll({
          where: {
            teacher_id: parseInt(teacher_id),
            generalDescription: generalDescription,
            isDelete: isDelete === 'true'
          },
          include: [
            {
              model: CourseModel,
              attributes: ['course_id', 'courseCode', 'courseName']
            },
            {
              model: StudentModel,
              attributes: ['student_id', 'studentCode', 'name', 'class_id'],
              include: [
                {
                  model: ClassModel,
                  attributes: ['classNameShort']
                }
              ]
            },
            {
              model: RubricModel,
              attributes: ['rubric_id', 'rubricName']
            }
          ]
        });

        return res.status(200).json(assessments);

      } else if (teacher_id) {
        const teacherId = parseInt(teacher_id);
        const assessments = await MetaAssessmentModel.findAll({
          where: {
            teacher_id: teacherId,
            isDelete: isDelete === 'true'
          },
          attributes: [
            'course_id',
            'generalDescription',
            [Sequelize.fn('COUNT', Sequelize.col('meta_assessment_id')), 'assessmentCount'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('student_id'))), 'studentCount'],
            [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN FinalScore = 0 THEN 1 ELSE 0 END')), 'zeroScoreCount']
          ],
          group: ['course_id', 'generalDescription'],
          include: [{
            model: CourseModel,
            attributes: ['courseCode', 'courseName']
          }
        ]
        });

        if (assessments.length === 0) {
          return res.status(404).json({ message: 'No meta-assessments found for this user' });
        }

        const result = await Promise.all(assessments.map(async assessment => {
          let status;
          const assessmentCount = parseInt(assessment.dataValues.assessmentCount);
          const zeroScoreCount = parseInt(assessment.dataValues.zeroScoreCount);

          if (assessmentCount === 0) {
            status = 100;
          } else {
            status = ((assessmentCount - zeroScoreCount) / assessmentCount) * 100;
          }
          status = Math.round(status);

          const foundAssessment = await MetaAssessmentModel.findOne({
            where: {
              generalDescription: assessment.generalDescription,
              isDelete: isDelete === 'true'
            },
            attributes: ["meta_assessment_id","rubric_id", "course_id", "generalDescription", "date", "place", "isDelete", "createdAt"],
            include: [{
              model: RubricModel,
              where: {
                isDelete: isDelete === 'true'
              },
              include: [{
                model: SubjectModel,
                where: {
                  isDelete: isDelete === 'true'
                }
              }]
            }, {
              model: CourseModel,
              where: {
                isDelete: isDelete === 'true'
              }
            }]
          });
          const Assessment = await AssessmentModel.findAll({
            where: {
              meta_assessment_id: foundAssessment.meta_assessment_id,
              isDelete: isDelete === 'true'
            },
            include: [{
              model: TeacherModel,
              where: {
                isDelete: isDelete === 'true'
              },
            }]
            }
          )
          let statusAllot = true;
          if (Assessment.length === 0) {
              statusAllot = false;
          }
          if (foundAssessment && foundAssessment.Rubric) {
            const rubricItems = await RubricsItemModel.findAll({
              where: {
                rubric_id: foundAssessment.Rubric.rubric_id,
                isDelete: isDelete === 'true'
              },
              include: [{
                model: CloModel,
                attributes: ['clo_id', 'cloName', 'description'],
                where: {
                  isDelete: isDelete === 'true'
                }
              }, {
                model: ChapterModel,
                attributes: ['chapter_id', 'chapterName', 'description'],
                where: {
                  isDelete: isDelete === 'true'
                }
              }, {
                model: PloModel,
                attributes: ['plo_id', 'ploName', 'description'],
                where: {
                  isDelete: isDelete === 'true'
                }
              }]
            });
            foundAssessment.Rubric.dataValues.rubricItems = rubricItems;
          }

          return {
            course_id: assessment.course_id,
            generalDescription: assessment.generalDescription,
            course: `${assessment.course.courseCode} - ${assessment.course.courseName}`,
            courseCode: assessment.course.courseCode,
            courseName: assessment.course.courseName,
            assessmentCount: parseInt(assessment.dataValues.assessmentCount),
            studentCount: parseInt(assessment.dataValues.studentCount),
            zeroScoreCount: parseInt(assessment.dataValues.zeroScoreCount),
            status: status,
            Assessment: Assessment || [],
            statusAllot: statusAllot,
            metaAssessment: foundAssessment,
            createdAt: foundAssessment ? foundAssessment.createdAt : null,
            isDelete: foundAssessment ? foundAssessment.isDelete : null
          };
        }));

        return res.status(200).json(result);
      } else if (generalDescription) { 
        const assessments = await MetaAssessmentModel.findAll({
          where: {
            generalDescription: generalDescription,
            isDelete: isDelete === 'true'
          }
        });
        return res.status(200).json(assessments);
      }
      else {
        // Logic for index
        const assessments = await MetaAssessmentModel.findAll();
        return res.status(200).json(assessments);
      }
    } catch (error) {
      console.error('Error fetching meta-assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Lấy meta assessment theo ID
  show: async (req, res) => {
    try {
      const { id } = req.params;
      const metaAssessment = await MetaAssessmentModel.findByPk(id);
      if (metaAssessment) {
        res.json(metaAssessment);
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi lấy meta assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo meta assessment mới
  create: async (req, res) => {
    try {
      const newMetaAssessment = await MetaAssessmentModel.create(req.body);
      res.status(201).json(newMetaAssessment);
    } catch (error) {
      console.error('Lỗi khi tạo meta assessment mới:', error);
      res.status(400).json({ message: 'Yêu cầu không hợp lệ' });
    }
  },

  // Cập nhật meta assessment
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await MetaAssessmentModel.update(req.body, {
        where: { meta_meta_assessment_id: id }
      });
      if (updated) {
        const updatedMetaAssessment = await MetaAssessmentModel.findByPk(id);
        res.json(updatedMetaAssessment);
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật meta assessment:', error);
      res.status(400).json({ message: 'Yêu cầu không hợp lệ' });
    }
  },
updateDescription: async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    
    // Cập nhật description trong MetaAssessmentModel
    await MetaAssessmentModel.update(
      { description: description },
      { where: { meta_assessment_id: id } }
    );
    
    res.status(200).json({ message: 'MetaAssessment updated successfully' });
  } catch (error) {
    console.error('Error updating MetaAssessment:', error);
    res.status(500).json({ message: 'Error updating MetaAssessment', error });
  }
},
  // Xóa meta assessment
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await MetaAssessmentModel.destroy({
        where: { meta_meta_assessment_id: id }
      });
      if (deleted) {
        res.json({ message: 'Meta assessment đã được xóa' });
      } else {
        res.status(404).json({ message: 'Meta assessment không tìm thấy' });
      }
    } catch (error) {
      console.error('Lỗi khi xóa meta assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  processSaveTemplateMetaAssessment: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }

    const requestData = JSON.parse(req.body.data);
    const uploadDirectory = path.join(__dirname, '../uploads');
    const filename = req.files[0].filename;
    const filePath = path.join(uploadDirectory, filename);

    const workbook = new ExcelJS.Workbook();
    try {
      await workbook.xlsx.readFile(filePath);
    } catch (error) {
      return res.status(500).json({ message: 'Error reading the uploaded file' });
    }

    const worksheet = workbook.getWorksheet('Students Form');
    const jsonData = [];

    let invalidDescriptionFound = false;

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const description = `${requestData.courseName}_${requestData.description}_${requestData.date}`;
        if (description.includes('/')) {
          invalidDescriptionFound = true;
        }
        jsonData.push({
          teacher_id: requestData.teacher_id,
          course_id: requestData.course_id,
          rubric_id: requestData.rubric_id,
          generalDescription: `${requestData.courseName}_${requestData.description}_${requestData.date}`,
          description: '',
          place: requestData.place,
          date: requestData.date,
          student_id: row.getCell(1).value,
        });
      }
    });

    fs.unlinkSync(filePath);
    if (invalidDescriptionFound) {
      return res.status(400).json({ message: 'Description contains invalid characters (e.g., "/") and cannot be saved' });
    }
    try {
      const existingDescriptions = await MetaAssessmentModel.findAll({
        where: {
          generalDescription: jsonData.map(item => item.description)
        },
        attributes: ['generalDescription']
      });

      if (existingDescriptions.length > 0) {
        return res.status(400).json({ message: 'Some generalDescription already exist in the database', existingDescriptions });
      }
      const createdAssessment = await MetaAssessmentModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdAssessment });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },

  getFormUpdateDescriptionExcel: async (req, res) => {
    try {
      const { data } = req.body;
      const { id } = data;
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Tên đề tài');

      // Lấy danh sách student_id từ MetaAssessmentModel dựa trên meta_assessment_id
      const enrollments = await MetaAssessmentModel.findAll({
        attributes: ['meta_assessment_id', 'description'],
        where: {
          meta_assessment_id: id,
          isDelete: false
        },
        include: [{
          model: StudentModel,
          attributes: ['name'],
        }]
      });

      worksheet.columns = [
        { header: 'Tên SV', key: 'name', width: 32 },
        { header: 'Tên đề tài', key: 'description', width: 100 },
        { header: 'MetaId', key: 'MetaId', width: 15 }
      ];
      console.log("enrollments")
      console.log(enrollments[0])

      enrollments.forEach(enrollment => {
        if (enrollment.Student) {
          worksheet.addRow({
            name: enrollment.Student.name,
            description: enrollment.description,
            MetaId: enrollment.meta_assessment_id
          });
        }
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="StudentsForm.xlsx"');
      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error generating Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  updateDescriptionFromExcel: async (req, res) => {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    try {
      const uploadDirectory = path.join(__dirname, '../uploads');
      const filename = req.files[0].filename;
      const filePath = path.join(uploadDirectory, filename);

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet('Tên đề tài');

      const Updates = [];

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) { 
          const Data = {
            description: row.getCell(2).value, 
            meta_assessment_id: row.getCell(3).value 
          };
          Updates.push(Data);
        }
      });
        
      fs.unlinkSync(filePath); 

      await Promise.all(Updates.map(async (data) => {
        const [affectedRows] = await MetaAssessmentModel.update(
          { description: data.description },
          { where: { meta_assessment_id: data.meta_assessment_id } }
        );
  
        if (affectedRows === 0) {
          console.warn(`No MetaAssessment found with ID ${data.meta_assessment_id} for update`);
        }
      }));



      res.status(200).json({ message: 'description   updated successfully' });
    } catch (error) {
      console.error('Error updating description from Excel file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = MetaAssessmentController;
