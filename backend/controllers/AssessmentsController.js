const { Op, Sequelize } = require('sequelize');

const AssessmentModel = require('../models/AssessmentModel');
const CourseModel = require('../models/CourseModel');
const StudentModel = require('../models/StudentModel');
const ClassModel = require('../models/ClassModel');
const RubricModel = require('../models/RubricModel');
const RubricItemModel = require('../models/RubricItemModel');
const AssessmentItemModel = require('../models/AssessmentItemModel');

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const CloModel = require('../models/CloModel');
const ChapterModel = require('../models/ChapterModel');
const PloModel = require('../models/PloModel');
const RubricsItemModel = require('../models/RubricItemModel');
const SubjectModel = require('../models/SubjectModel');

const AssessmentsController = {
  // index: async (req, res) => {
  //   try {
  //     AssessmentModel.findAll()
  //       .then(assessments => {
  //         return res.json(assessments);
  //       })
  //       .catch(error => {
  //         // Xử lý lỗi nếu có
  //         console.error('Lỗi lấy dữ liệu:', error);
  //       });

  //   } catch (error) {
  //     console.error('Lỗi lấy dữ liệu:', error);
  //     res.status(500).json({ message: 'Lỗi server' });
  //   }
  // },

  // GetByUser: async (req, res) => {
  //   try {
  //     const teacherId = parseInt(req.params.teacher_id);
  //     console.log(teacherId);
  //     const assessments = await AssessmentModel.findAll({
  //       where: {
  //         teacher_id: teacherId,
  //         isDelete: false
  //       },
  //       attributes: [
  //         'course_id',
  //         'description',
  //         [Sequelize.fn('COUNT', Sequelize.col('assessment_id')), 'assessmentCount'],
  //         [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('student_id'))), 'studentCount'],
  //         [Sequelize.fn('SUM', Sequelize.literal('CASE WHEN totalScore = 0 THEN 1 ELSE 0 END')), 'zeroScoreCount']
  //       ],
  //       group: ['course_id', 'description'],
  //       include: [{
  //         model: CourseModel,
  //         attributes: ['courseCode', 'courseName']
  //       }]

  //     });
  //     const groupedAssessments = assessments.reduce((acc, assessment) => {
  //       const key = `${assessment.description}`;
  //       if (!acc[key]) {
  //         acc[key] = [];
  //       }
  //       acc[key].push(assessment);
  //       return acc;
  //     }, {});

  //     console.log(groupedAssessments);
  //     // attributes: [
  //     //   'course_id',

  //     // ],

  //     //group: ['course_id']

  //     if (assessments.length === 0) {
  //       return res.status(404).json({ message: 'No assessments found for this user' });
  //     }

  //     const result = assessments.map(assessment => {
  //       let status;
  //       if (parseInt(assessment.dataValues.zeroScoreCount) === 0) {
  //         status = 100;
  //       } else if (parseInt(assessment.dataValues.zeroScoreCount) === parseInt(assessment.dataValues.assessmentCount)) {
  //         status = 0;
  //       } else {
  //         status = (parseInt(assessment.dataValues.zeroScoreCount) / parseInt(assessment.dataValues.assessmentCount)) * 100;
  //       }

  //       return {
  //         course_id: assessment.course_id,
  //         description: assessment.description,
  //         course: `${assessment.course.courseCode} - ${assessment.course.courseName}`,
  //         assessmentCount: parseInt(assessment.dataValues.assessmentCount),
  //         studentCount: parseInt(assessment.dataValues.studentCount),
  //         zeroScoreCount: parseInt(assessment.dataValues.zeroScoreCount),
  //         status: status
  //       };
  //     });



  //     console.log(result);
  //     res.status(200).json(result);
  //   } catch (error) {
  //     console.error('Error fetching assessments:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // },
  // GetByDescriptionByUser: async (req, res) => {
  //   try {
  //     const { description, teacher_id } = req.params;
  //     console.log("description");

  //     console.log(description);

  //     // const normalizedDescription = description.replace(/_/g, ' ');
  //     // console.log("description");

  //     // console.log(normalizedDescription);

  //     const assessments = await AssessmentModel.findAll({
  //       where: {
  //         teacher_id: parseInt(teacher_id),
  //         description: description,
  //         isDelete: false
  //       },
  //       include: [{
  //         model: CourseModel,
  //         attributes: ['course_id','courseCode', 'courseName']
  //       }, {
  //         model: StudentModel,
  //         attributes: ['student_id','studentCode', 'name', 'class_id'],
  //         include: [{
  //           model: ClassModel,
  //           attributes: ['classNameShort']
  //         }]
  //       }
  //       ]
  //     });


  //     console.log(assessments);

  //     res.status(200).json(assessments);
  //   } catch (error) {
  //     console.error('Error fetching assessments:', error);
  //     res.status(500).json({ message: 'Server error' });
  //   }
  // },

  getAssessments: async (req, res) => {
    try {
      const { isDelete, teacher_id, description } = req.query;

      if (teacher_id && description) {
        console.log("description");

        console.log(description);
        // Logic for GetByDescriptionByUser
        const assessments = await AssessmentModel.findAll({
          where: {
            teacher_id: parseInt(teacher_id),
            description: description,
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
        const assessments = await AssessmentModel.findAll({
          where: {
            teacher_id: teacherId,
            isDelete: isDelete === 'true'
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

        if (assessments.length === 0) {
          return res.status(404).json({ message: 'No assessments found for this user' });
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

          const foundAssessment = await AssessmentModel.findOne({
            where: {
              description: assessment.description,
              isDelete: isDelete === 'true'
            },
            attributes: ["rubric_id", "course_id", "description", "date", "place", "isDelete", "createdAt"],
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
            description: assessment.description,
            course: `${assessment.course.courseCode} - ${assessment.course.courseName}`,
            courseCode: assessment.course.courseCode,
            courseName: assessment.course.courseName,
            assessmentCount: parseInt(assessment.dataValues.assessmentCount),
            studentCount: parseInt(assessment.dataValues.studentCount),
            zeroScoreCount: parseInt(assessment.dataValues.zeroScoreCount),
            status: status,
            Assessment: foundAssessment,
            createdAt: foundAssessment ? foundAssessment.createdAt : null,
            isDelete: foundAssessment ? foundAssessment.isDelete : null
          };
        }));

        return res.status(200).json(result);
      }
     else {
        // Logic for index
        const assessments = await AssessmentModel.findAll();
        return res.status(200).json(assessments);
      }

    } catch (error) {
      console.error('Error fetching assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  GetitemsByID: async (req, res) => {
    try {
      const { id } = req.params;

      // Step 1: Fetch the assessment with basic associations
      const assessments = await AssessmentModel.findOne({
        where: {
          assessment_id: id,
          isDelete: false
        },
        include: [
          { model: CourseModel, attributes: ['courseCode', 'courseName'] },
          {
            model: StudentModel,
            attributes: ['studentCode', 'name', 'class_id'],
            include: [{
              model: ClassModel,
              attributes: ['classNameShort']
            }]
          },
          {
            model: RubricModel,
            where: {
              isDelete: false
            }
          }
        ]
      });

      if (!assessments || !assessments.Rubric) {
        return res.status(404).json({ message: 'Assessment or Rubric not found' });
      }

      // Step 2: Fetch related rubric items
      const rubricItems = await RubricItemModel.findAll({
        where: {
          rubric_id: assessments.Rubric.rubric_id,
          isDelete: false
        },
        include: [
          {
            model: CloModel,
            attributes: ['clo_id', 'cloName', 'description']
          },
          {
            model: ChapterModel,
            attributes: ['chapter_id', 'chapterName', 'description']
          },
          {
            model: PloModel,
            attributes: ['plo_id', 'ploName', 'description']
          }
        ]
      });

      const rubricsItemIds = rubricItems.map(item => item.rubricsItem_id);

      const assessmentItems = await AssessmentItemModel.findAll({
        where: {
          rubricsItem_id: rubricsItemIds,
          assessment_id: id
        }
      });

      rubricItems.forEach(rubricItem => {
        rubricItem.dataValues.AssessmentItems = assessmentItems.filter(
          assessmentItem => assessmentItem.rubricsItem_id === rubricItem.rubricsItem_id
        );
      });

      // Step 6: Manually merge the fetched rubric items into the assessment object
      assessments.dataValues.Rubric.dataValues.RubricItems = rubricItems;
      // assessments.dataValues.Rubric.dataValues.RubricItems.dataValues.AssessmentItems = assessmentItems;

      // Step 4: Send the combined result in the response
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

  getByID:async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await AssessmentModel.findOne({
        where: { assessment_id: id },
        include: [
          {
            model: RubricModel,
            where: { isDelete: false },
            include: [
              {
                model: SubjectModel,
                where: { isDelete: false },
              },
            ],
          },
          {
            model: CourseModel,
            where: { isDelete: false },
          },
          {
            model: StudentModel,
            where: { isDelete: false },
          },
        ],
      });
      if (!assessment) {
        return res.status(404).json({ message: 'Assessment not found' });
      }
      res.json(assessment);
    } catch (error) {
      console.error('Error fetching assessment:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedProgram = await AssessmentModel.update(data, { where: { assessment_id: id } });
      if (updatedProgram[0] === 0) {
        return res.status(404).json({ message: 'assessments not found' });
      }
      res.json(updatedProgram);
    } catch (error) {
      console.error('Lỗi cập nhật assessments:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  
  updateStotalScore: async (req, res) => {
    try {
      const { id } = req.params;
      const { data } = req.body;
      const updatedProgram = await AssessmentModel.update(data, { where: { assessment_id: id } });
      if (updatedProgram[0] === 0) {
        return res.status(404).json({ message: 'assessments not found' });
      }
      res.json(updatedProgram);
    } catch (error) {
      console.error('Lỗi cập nhật assessments:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      await AssessmentModel.destroy({ where: { assessment_id: id } });
      res.json({ message: 'Xóa assessments thành công' });
    } catch (error) {
      console.error('Lỗi xóa assessments:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  deleteMultiple: async (req, res) => {
    const { assessment_id } = req.query;
    try {
      const assessmentIds = assessment_id.map(id => parseInt(id));
      // for (const id of assessmentIds) {        
      //   const RubricItems = await RubricItemModel.findAll({ where: { assessment_id: id } });
      //   for (const RubricItem of RubricItems) {
      //     await RubricItemModel.destroy({ where: { assessmentsItem_id: RubricItem.assessmentsItem_id } });
      //   }
      // }

      await AssessmentModel.destroy({ where: { assessment_id: assessment_id } });
      res.status(200).json({ message: 'Xóa nhiều assessment thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa nhiều assessment:', error);
      res.status(500).json({ message: 'Lỗi server nội bộ' });
    }
  },
  isDeleteTotrue: async (req, res) => {
    try {
      const assessment = await AssessmentModel.findAll({ where: { isDelete: true } });

      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy assessments' });
      }

      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  isDeleteTofalse: async (req, res) => {
    try {
      const assessment = await AssessmentModel.findAll({ where: { isDelete: false } });
      if (!assessment) {
        return res.status(404).json({ message: 'Không tìm thấy assessments' });
      }
      res.json(assessment);
    } catch (error) {
      console.error('Lỗi tìm kiếm assessment:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  toggleSoftDeleteById: async (req, res) => {
    try {
      const { id } = req.params;
      const assessment = await AssessmentModel.findOne({ where: { assessment_id: id } });
      if (!assessment) {
        return res.status(404).json({ message: 'Assessment không tìm thấy' });
      }
      const updatedIsDeleted = !assessment.isDelete;
      await AssessmentModel.update({ isDelete: updatedIsDeleted }, { where: { assessment_id: id } });
  
      res.status(200).json({ message: `Đã thay đổi trạng thái xóa mềm thành ${updatedIsDeleted}` });
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái xóa mềm:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  

  softDeleteMultiple: async (req, res) => {
    try {
      const { rubric_id } = req.body;
      if (!Array.isArray(rubric_id) || rubric_id.length === 0) {
        return res.status(400).json({ message: 'Không cung cấp id nào' });
      }
  
      const assessments = await AssessmentModel.findAll({ where: { assessment_id: rubric_id } });
      if (assessments.length !== rubric_id.length) {
        return res.status(404).json({ message: 'Một hoặc nhiều Assessment không tìm thấy' });
      }
  
      const updated = await Promise.all(assessments.map(async (assessment) => {
        const updatedIsDeleted = !assessment.isDelete;
        await assessment.update({ isDelete: updatedIsDeleted });
        return { assessment_id: assessment.assessment_id, isDelete: updatedIsDeleted };
      }));
  
      res.json({ message: 'Trạng thái xóa mềm đã được thay đổi', updated });
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái xóa mềm:', error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },
  

  toggleSoftDeleteByDescription: async (req, res) => {
    try {
      const { descriptions, isDelete } = req.body; // Nhận mảng descriptions và giá trị isDelete từ req.body
      if (!Array.isArray(descriptions) || descriptions.length === 0) {
        return res.status(400).json({ message: 'Descriptions array is required and cannot be empty' });
      }
  
      // Tìm tất cả assessments dựa vào các description
      const assessments = await AssessmentModel.findAll({ 
        where: { 
          description: descriptions 
        } 
      });
      console.log('Found assessments:', assessments);
  
      if (assessments.length === 0) {
        return res.status(404).json({ message: 'No assessments found for the provided descriptions' });
      }
  
      // Toggling trạng thái isDelete cho tất cả assessments tìm thấy
      const updated = await Promise.all(assessments.map(async (assessment) => {
        if (isDelete === null) {
          return { assessment_id: assessment.assessment_id, isDelete: assessment.isDelete }; // Không thay đổi isDelete nếu isDelete là null
        } else {
          const updatedIsDeleted = isDelete !== undefined ? isDelete : !assessment.isDelete;
          await assessment.update({ isDelete: updatedIsDeleted });
          return { assessment_id: assessment.assessment_id, isDelete: updatedIsDeleted };
        }
      }));
  
      res.status(200).json({ message: 'Processed isDelete status', updated });
  
    } catch (error) {
      console.error('Error toggling assessment delete statuses:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  ,

  updateByDescription: async (req, res) => {
    try {
      const { description, updateData } = req.body;
      let assessments = await AssessmentModel.findAll({ where: { description: description } });
      if (assessments.length === 0) {
        return res.status(404).json({ message: "No assessments found" });
      }
      if (updateData.description) {
        const existingAssessment = await AssessmentModel.findOne({ where: { description: updateData.description } });
  
        if (existingAssessment) {
          return res.status(400).json({ message: "An assessment with the new description already exists" });
        }
      }

      const updatedAssessments = await Promise.all(assessments.map(async (assessment) => {
        if (updateData.rubric_id !== undefined) {
          assessment.rubric_id = updateData.rubric_id;
        }
        if (updateData.course_id !== undefined) {
          assessment.course_id = updateData.course_id;
        }
        if (updateData.description !== undefined) {
          assessment.description = updateData.description;
        }
        if (updateData.date !== undefined) {
          assessment.date = updateData.date;
        }
        if (updateData.place !== undefined) {
          assessment.place = updateData.place;
        }
        await assessment.save();
        return assessment;
      }));
  
      res.status(200).json(updatedAssessments);
    } catch (error) {
      console.error("Error updating assessments:", error);
      res.status(500).json({ message: "Error updating assessments", error });
    }
  },
  deleteByDescription: async (req, res) => {
    try {
      const { descriptions } = req.body; // Nhận mảng descriptions từ req.body
      console.log(descriptions);
      if (!Array.isArray(descriptions) || descriptions.length === 0) {
        return res.status(400).json({ message: 'Descriptions array is required and cannot be empty' });
      }

      // Xóa tất cả assessments dựa vào các description
      const deletedCount = await AssessmentModel.destroy({
        where: {
          description: descriptions
        }
      });

      if (deletedCount === 0) {
        return res.status(404).json({ message: 'No assessments found for the provided descriptions' });
      }

      res.status(200).json({ message: 'Successfully deleted assessments', deletedCount });

    } catch (error) {
      console.error('Error deleting assessments:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
  processSaveTemplateAssessment: async (req, res) => {
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
          description: `${requestData.courseName}_${requestData.description}_${requestData.date}`,
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
      const existingDescriptions = await AssessmentModel.findAll({
        where: {
          description: jsonData.map(item => item.description)
        },
        attributes: ['description']
      });
  
      if (existingDescriptions.length > 0) {
        return res.status(400).json({ message: 'Some descriptions already exist in the database', existingDescriptions });
      }
      const createdAssessment = await AssessmentModel.bulkCreate(jsonData);
      res.status(201).json({ message: 'Data saved successfully', data: createdAssessment });
    } catch (error) {
      console.error('Error saving data to the database:', error);
      res.status(500).json({ message: 'Error saving data to the database' });
    }
  },
};

module.exports = AssessmentsController;
