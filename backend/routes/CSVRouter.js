const express = require('express');
const router = express.Router();
const CSV = require('../controllers/CSVController');

router.get('/program', CSV.getFormProgram);
router.get('/po', CSV.getFormPo);
router.get('/plo', CSV.getFormPlo);

router.post('/program', CSV.getFormProgramWithListId);
router.post('/po', CSV.getFormPoWithListId);
router.post('/plo', CSV.getFormPloWithListId);

module.exports = router;