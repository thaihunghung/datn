const express = require('express');
const router = express.Router();
const CSV = require('../controllers/CSVController');
const StudentController = require('../controllers/StudentController');

router.get('/program', CSV.getFormProgram);
router.get('/po', CSV.getFormPo);
router.get('/plo', CSV.getFormPlo);
router.get('/student', StudentController.getFormStudent);

router.post('/program', CSV.getFormProgramWithListId);
router.post('/po', CSV.getFormPoWithListId);
router.post('/plo', CSV.getFormPloWithListId);

module.exports = router;