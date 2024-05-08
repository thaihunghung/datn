const express = require('express');
const TeacherController = require('../controllers/TeacherController');
const router = express.Router();


// Định nghĩa các route cho chương trình
router.get('/teacher', TeacherController.index);
router.post('/teacher', TeacherController.create);
router.get('/teacher/:id', TeacherController.getByID);

router.put('/teacher/:id', TeacherController.update);
router.delete('/teacher/:id', TeacherController.delete);

router.get('/teacher/isDelete/true', TeacherController.isDeleteTotrue);
router.get('/teacher/isDelete/false', TeacherController.isDeleteTofalse);
router.put('/teacher/isDelete/:id', TeacherController.isDelete);
module.exports = router;