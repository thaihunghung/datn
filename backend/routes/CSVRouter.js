const express = require('express');
const router = express.Router();
const CSV = require('../controllers/CSVController');
const StudentController = require('../controllers/StudentController');
const ProgramsController = require('../controllers/ProgramsController');
const PoController = require('../controllers/PoController');
router.get('/program', ProgramsController.getFormExels);
router.get('/po', PoController.getFormPost);
router.get('/plo', CSV.getFormPlo);
router.get('/student', StudentController.getFormStudent);

router.post('/program', CSV.getFormProgramWithListId);
router.post('/po', CSV.getFormPoWithListId);
router.post('/plo', CSV.getFormPloWithListId);

module.exports = router;