const express = require('express');
const router = express.Router();
const programController = require('../controllers/ProgramsController');

router.get('/programs', programController.index);
router.post('/program', programController.create);
router.get('/program/:program_id', programController.getByID);
router.put('/program/:program_id', programController.update);
router.delete('/program/:program_id', programController.delete);

router.get('/program/isDelete/true', programController.isDeleteTotrue);
router.get('/program/isDelete/false', programController.isDeleteTofalse);
router.put('/program/isDelete/:program_id', programController.toggleIsDelete);

router.get('/program/templates/post', programController.getFormPost);

module.exports = router;
