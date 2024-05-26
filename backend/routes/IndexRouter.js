const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('../utils/swagger');
const programRoutes = require('./ProRoutes');
const ploRoutes = require('./PloRouter');
const cloRoutes = require('./CloRouter');
const subjectRoute = require('./SubjectRouter');
const courseRoute = require('./CourseRouter');
const classRoute = require('./ClassRouter')
const academicYearRoute = require('./AcademicYearRouter')
const studentRoute = require('./StudentRouter')
const semesterRoute = require('./SemesterRouter')
const teacherRoute = require('./TeacherRouter')
const userRoute = require('./UserRouter')
const chapterRoutes = require('./ChapterRouter');
const questionRoutes = require('./QuestionRouter');
const poRoutes = require('./PoRouter');
const poPloRoutes = require('./Po_PloRouter');
const ploCloRoutes = require('./Plo_CloRouter');
const rubricRoutes = require('./RubricRouter');
const rubricItemRoutes = require('./RubricItemRouter');
const cloChapterRoutes = require('./Clo_ChapterRouter');
const rubricQuestionRoutes = require('./Rubric_QuestionRouter');
const assessmentsRoutes = require('./AssessmentsRoutes');
const qualitylevelsRoutes = require('./QualityLevelsRouter');
const CourseEnrollmentRoutes = require('./CourseEnrollmentRouter')

const pdfRouters = require('./PdfRouter');

const importExcelRouters = require('./importExcelRouter');

//doc
router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use('/api/admin', programRoutes);  
router.use('/api/admin', ploRoutes);
router.use('/api/admin', cloRoutes);
router.use('/api/admin', subjectRoute);
router.use('/api/admin', courseRoute);
router.use('/api/admin', classRoute);
router.use('/api/admin', academicYearRoute);
router.use('/api/admin', studentRoute);
router.use('/api/admin', teacherRoute);
router.use('/api/admin', userRoute);
router.use('/api/admin', semesterRoute);
router.use('/api/admin', questionRoutes);
router.use('/api/admin', chapterRoutes);
router.use('/api/admin', poRoutes);
router.use('/api/admin', cloChapterRoutes);
router.use('/api/admin', rubricRoutes);
router.use('/api/admin', rubricItemRoutes);
router.use('/api/admin', rubricQuestionRoutes);
router.use('/api/admin', assessmentsRoutes);
router.use('/api/admin', qualitylevelsRoutes);

router.use('/api/admin', CourseEnrollmentRoutes);

router.use('/api/admin', poPloRoutes);
router.use('/api/admin', ploCloRoutes);
router.use('/api/admin', pdfRouters);

router.use('/api/admin/importExcel', importExcelRouters);

module.exports = router;
