const { Op, Sequelize } = require('sequelize');
const AssessmentModel = require('../models/AssessmentModel');
const CourseModel = require('../models/CourseModel');
const StudentModel = require('../models/StudentModel');
const ClassModel = require('../models/ClassModel');

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const AssessmentsController = {
  index: async (req, res) => {
    try {
      AssessmentModel.findAll()
        .then(assessments => {
          return res.json(assessments);
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

  GetByUser: async (req, res) => {
    try {
      const teacherId = parseInt(req.params.teacher_id);
      console.log(teacherId);
      const assessments = await AssessmentModel.findAll({
        where: {
          teacher_id: teacherId,
          isDelete: false
        },
        attributes: [
          'course_id',
          'description',
          [Sequelize.fn('COUNT', Sequelize.col('assessment_id')), 'assessmentCount'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('student_id'))), 'studentCount'],
          [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN totalScore = 0 THEN 1 ELSE 0 END')), 'zeroScoreCount']
        ],
        group: ['course_id', 'description'],
        include: [{
          model: CourseModel,
          attributes: ['courseCode', 'courseName']
        }]

      });
      const groupedAssessments = assessments.reduce((acc, assessment) => {
        const key = `${assessment.description}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(assessment);
        return acc;
      }, {});
      
      console.log(groupedAssessments);
   // attributes: [
        //   'course_id',
        
        // ],

        //group: ['course_id']
        
      if (assessments.length === 0) {
        return res.status(404).json({ message: 'No assessments found for this user' });
      }
  
      const result = assessments.map(assessment => ({
        course_id: assessment.course_id,
        //teacher_id: teacherId,
        description: assessment.description,
        course: `${assessment.course.courseCode} - ${assessment.course.courseName}`,
        assessmentCount: assessment.dataValues.assessmentCount,
        studentCount: assessment.dataValues.studentCount,
        zeroScoreCount: assessment.dataValues.zeroScoreCount
      }));
      // console.log(assessments);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  GetByDescriptionByUser: async (req, res) => {
    try {
      const {description, teacher_id} = req.params;

      const normalizedDescription = description.replace(/_/g, ' ');
      console.log(normalizedDescription);

      const assessments = await AssessmentModel.findAll({
        where: {
          teacher_id: parseInt(teacher_id),
          description: normalizedDescription,
          isDelete: false
        },
        include: [{
          model: CourseModel,
          attributes: ['courseCode', 'courseName']
        },{
          model: StudentModel,
          attributes: ['studentCode', 'name', 'class_id'],
          include: [{
            model: ClassModel,
            attributes: ['classNameShort']
          }]
        }
      ]
      });


      console.log(assessments);

      res.status(200).json(assessments);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  create: async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data);
      const Assessment = await AssessmentModel.create(data);
      res.json(Assessment);
    } catch (error) {
      console.error('Lỗi tạo Assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  getByID: async (req, res) => {
    try {
      const { assessment_id } = req.params;
      const assessment = await AssessmentModel.findOne({ assessment_id: assessment_id});
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  update: async (req, res) => {
    try {
      const { assessment_id } = req.params;
      const { data } = req.body;
      const updatedProgram = await AssessmentModel.update(data , { where: { assessment_id: assessment_id } });
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
      const { assessment_id } = req.params;
      await AssessmentModel.destroy({ where: { assessment_id: assessment_id } });
      res.json({ message: 'Xóa chương trình thành công' });
    } catch (error) {
      console.error('Lỗi xóa chương trình:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const assessment = await AssessmentModel.findAll({ where: { isDelete: true } });

      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTofalse: async(req, res) => {
    try {
      const assessment = await AssessmentModel.findAll({ where: { isDelete: false } });
      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isdelete: async (req, res) => {
    try {
      const { assessment_id } = req.params;
      const assessment = await AssessmentModel.findOne({ where: { assessment_id: assessment_id } });

      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy chương trình' });
      }
      const updatedIsDeleted = !assessment.isDelete;
      console.log(updatedIsDeleted);
      AssessmentModel.update({ isDelete: updatedIsDeleted }, { where: { assessment_id: assessment_id } })
        .then(assessments => {
          console.log(assessments);
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

  processSaveTemplateAssessment: async (req, res) => {
    if (!req.files) {
      return res.status(400).send('No file uploaded.');
    }
    
    const requestData = JSON.parse(req.body.data);

    // Tạo một object mới với thuộc tính course_id
    //console.log(requestData);
    
    // try {
    //   const subject = await SubjectModel.findByPk(subject_id);
    //   if (!subject) {
    //     return res.status(404).json({ message: 'Subject not found' });
    //   }
    // } catch (error) {
    //   console.error('Error fetching subject:', error);
    //   return res.status(500).json({ message: 'Error fetching subject from the database' });
    // }
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

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        jsonData.push({
          teacher_id: requestData.teacher_id,
          course_id: requestData.course_id,
          rubric_id: requestData.rubric_id,
          description: `${requestData.description} ${requestData.date}`,
          place: requestData.place,
          date: requestData.date,
          student_id: row.getCell(1).value,
        });
      }
    });

    fs.unlinkSync(filePath);
    try {
      const createdAssessment = await AssessmentModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdAssessment });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },
};

module.exports = AssessmentsController;
