const express = require('express');
const router = express.Router();
const programController = require('../controllers/ProgramsController');

router.get('/program', programController.index);
router.post('/program', programController.create);
router.get('/program/:id', programController.getByID);
router.put('/program/:id', programController.update);
router.delete('/program/:id', programController.delete);

router.get('/program/isDelete/true', programController.isDeleteTotrue);
router.get('/program/isDelete/false', programController.isDeleteTofalse);
router.put('/program/isDelete/:id', programController.toggleIsDelete);

router.get('/program/form/excel', programController.getFormPost);

module.exports = router;
