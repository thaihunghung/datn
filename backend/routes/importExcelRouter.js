const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const passport = require('passport');

const path = require('path');
const StudentController = require('../controllers/StudentController');
const ProgramsController = require('../controllers/ProgramsController');
const PoController = require('../controllers/PoController');
const PloController = require('../controllers/PloController');
const CloController = require('../controllers/CloController');
const ChapterController = require('../controllers/ChapterController');
const SubjectController = require('../controllers/SubjectController');
const AssessmentsController = require('../controllers/AssessmentsController');
const CourseEnrollmentController = require('../controllers/CourseEnrollmentController');
const TeacherController = require('../controllers/TeacherController');
const uploadDirectory = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

/**
 * @openapi
 * tags:
 *   - name: Save Excel
 *     description: Operations related to saving Excel files
 */

/**
 * @openapi
 * /program:
 *   post:
 *     summary: Process and save program template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Program template processed and saved
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /po:
 *   post:
 *     summary: Process and save PO template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PO template processed and saved
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /plo:
 *   post:
 *     summary: Process and save PLO template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PLO template processed and saved
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /student:
 *   post:
 *     summary: Save student Excel file
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Student Excel file saved
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /teacher:
 *   post:
 *     summary: Save teacher Excel file
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Teacher Excel file saved
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /clo:
 *   post:
 *     summary: Process and save CLO template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CLO template processed and saved
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /chapter:
 *   post:
 *     summary: Process and save chapter template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Chapter template processed and saved
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /subject:
 *   post:
 *     summary: Process and save subject template
 *     tags: [Save Excel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Subject template processed and saved
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /assessment:
 *   post:
 *     summary: Process and save assessment template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Assessment template processed and saved
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /course-enrollment:
 *   post:
 *     summary: Save course enrollment Excel file
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Course enrollment Excel file saved
 *       500:
 *         description: Server error
 */


/**
 * @openapi
 * /student/update:
 *   put:
 *     summary: Update students from Excel file
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Students updated from Excel file
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /po/update:
 *   put:
 *     summary: Update PO template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PO template updated
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /plo/update:
 *   put:
 *     summary: Update PLO template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: PLO template updated
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /clo/update:
 *   put:
 *     summary: Update CLO template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: CLO template updated
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /chapter/update:
 *   put:
 *     summary: Update chapter template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Chapter template updated
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /subject/update:
 *   put:
 *     summary: Update subject template
 *     tags: [Save Excel]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Subject template updated
 *       500:
 *         description: Server error
 */

router.post('/program', upload.any(), ProgramsController.processSaveTemplate);
router.post('/po', upload.any(), PoController.processSaveTemplatePo);
router.post('/plo', upload.any(), PloController.processSaveTemplatePlo);
router.post('/student', upload.any(), StudentController.saveStudentExcel);
router.post('/teacher', upload.any(), TeacherController.saveTeacherExcel);
router.post('/clo', upload.any(), CloController.processSaveTemplateClo);
router.post('/chapter', upload.any(), ChapterController.processSaveTemplateChapter);
router.post('/subject', ensureAuthenticated, upload.any(), SubjectController.processSaveTemplateSubject);
router.post('/assessment', upload.any(), AssessmentsController.processSaveTemplateAssessment);
router.post('/course-enrollment', upload.any(), CourseEnrollmentController.saveExcel);

router.put('/student/update', upload.any(), StudentController.updateStudentsFromExcel);
router.put('/po/update', upload.any(), PoController.processUpdateTemplatePo);
router.put('/plo/update', upload.any(), PloController.processUpdateTemplatePlo);
router.put('/clo/update', upload.any(), CloController.processUpdateTemplateClo);
router.put('/chapter/update', upload.any(), ChapterController.processUpdateTemplateChapter);
router.put('/subject/update', upload.any(), SubjectController.processUpdateTemplateSubject);

module.exports = router;
