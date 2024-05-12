const express = require('express');
const router = express.Router();
const assessmentsController = require('../controllers/AssessmentsController');

// Định nghĩa các route cho chương trình
router.get('/assessment', assessmentsController.index);
router.post('/assessment', assessmentsController.create);

router.get('/assessment/:id', assessmentsController.getByID);
router.put('/assessment/:id', assessmentsController.update);
router.delete('/assessment/:id', assessmentsController.delete);

router.get('/assessment/isDelete/true', assessmentsController.isDeleteTotrue);
router.get('/assessment/isDelete/false', assessmentsController.isDeleteTofalse);
router.put('/assessment/isDelete/:id', assessmentsController.isdelete);

module.exports = router;