const express = require('express');
const StudentController = require('../controllers/StudentController');
const router = express.Router();


// Định nghĩa các route cho chương trình
router.get('/student', StudentController.index);
router.post('/student', StudentController.create);
router.get('/student/:id', StudentController.getByID);
router.get('/student/class/:id', StudentController.getAllByClassId);
router.get('/student-class', StudentController.getAllWithClass);

router.put('/student/:id', StudentController.update);
router.delete('/student/:id', StudentController.delete);

router.get('/student/isDelete/true', StudentController.isDeleteTotrue);
router.get('/student/isDelete/false', StudentController.isDeleteTofalse);
router.put('/student/isDelete/:id', StudentController.isDelete);
module.exports = router;