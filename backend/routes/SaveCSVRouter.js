const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const router = express.Router();

const path = require('path');
const { CsvSaveController, CsvUpdateController } = require('../controllers/CsvSaveController');

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

router.post('/program', upload.any(), CsvSaveController.saveFormProgram);
router.post('/po', upload.any(), CsvSaveController.saveFormPo);
router.post('/plo', upload.any(), CsvSaveController.saveFormPlo);

router.post('/program/getByID', upload.any(), CsvUpdateController.updateFormProgram);
router.post('/po/getByID', upload.any(), CsvUpdateController.updateFormPo);
router.post('/plo/getByID', upload.any(), CsvUpdateController.updateFormPlo);

module.exports = router;
