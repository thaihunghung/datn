const express = require('express');
const router = express.Router();

const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('../utils/swagger');

const programRoutes = require('./ProRoutes');
const ploRoutes = require('./PloRouter');
const cloRoutes = require('./CloRouter');
const courseRoute = require('./CourseRouter');
const chapterRoutes = require('./ChapterRouter');
const questionRoutes = require('./QuestionRouter');
const poRoutes = require('./PoRouter');
const poPloRoutes = require('./Po_PloRouter');
const ploCloRoutes = require('./Plo_CloRouter');
const rubricRoutes = require('./RubricRouter');
const rubricItemRoutes = require('./RubricItemRouter');
const cloChapterRoutes = require('./Clo_ChapterRouter');
const rubricQuestionRoutes = require('./Rubric_QuestionRouter');


const pdfRouters = require('./PdfRouter');
const csvRouters = require('./CsvRouter');
const csvSaveRouters = require('./SaveCSVRouter');

//doc
router.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.use('/api/admin', programRoutes);
router.use('/api/admin', ploRoutes);
router.use('/api/admin', cloRoutes);
router.use('/api/admin', courseRoute);
router.use('/api/admin', questionRoutes);
router.use('/api/admin', chapterRoutes);
router.use('/api/admin', poRoutes);
router.use('/api/admin', cloChapterRoutes);
router.use('/api/admin', rubricRoutes);
router.use('/api/admin', rubricItemRoutes);
router.use('/api/admin', rubricQuestionRoutes);

router.use('/api/admin', poPloRoutes);
router.use('/api/admin', ploCloRoutes);
router.use('/api/admin', pdfRouters);
router.use('/api/admin/csv',csvRouters);
router.use('/api/admin/csv-save',csvSaveRouters);

module.exports = router;
