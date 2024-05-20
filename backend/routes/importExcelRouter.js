const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const router = express.Router();

const path = require('path');
const { CsvSaveController, CsvUpdateController } = require('../controllers/CsvSaveController');
const StudentController = require('../controllers/StudentController');
const ProgramsController = require('../controllers/ProgramsController');
const PoController = require('../controllers/PoController');
const PloController = require('../controllers/PloController');
const CloController = require('../controllers/CloController');
const ChapterController = require('../controllers/ChapterController');

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

router.post('/program', upload.any(), ProgramsController.processSaveTemplate);
router.post('/po', upload.any(), PoController.processSaveTemplatePo);
router.post('/plo', upload.any(), PloController.processSaveTemplatePlo);
router.post('/student', upload.any(), StudentController.saveStudent);
router.post('/clo', upload.any(), CloController.processSaveTemplateClo);
router.post('/chapter', upload.any(), ChapterController.processSaveTemplateChapter);


router.put('/program/update', upload.any(), CsvUpdateController.updateFormProgram);
router.put('/po/update', upload.any(), PoController.processUpdateTemplatePo);
router.put('/plo/update', upload.any(), PloController.processUpdateTemplatePlo);
router.post('/clo/update', upload.any(), CloController.processUpdateTemplateClo);

module.exports = router;
