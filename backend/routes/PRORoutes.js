const express = require('express');
const router = express.Router();
const programController = require('../controllers/ProgramsController');

// Định nghĩa các route cho chương trình
router.get('/program', programController.index);
router.post('/program', programController.create);

router.get('/program/:id', programController.getByID);
router.put('/program/:id', programController.update);
router.delete('/program/:id', programController.delete);

router.get('/program/isDelete/true', programController.isDeleteTotrue);
router.get('/program/isDelete/false', programController.isDeleteTofalse);
router.put('/program/isDelete/:id', programController.isdelete);

module.exports = router;