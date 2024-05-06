const express = require('express');
const CourseController = require('../controllers/CourseController');
const router = express.Router();

// Định nghĩa các route cho chương trình
router.get('/course', CourseController.index);
router.post('/course', CourseController.create);
router.get('/course/:id', CourseController.getByID);

router.put('/course/:id', CourseController.update);
router.delete('/course/:id', CourseController.delete);

router.get('/course/isDelete/true', CourseController.isDeleteTotrue);
router.get('/course/isDelete/false', CourseController.isDeleteTofalse);

router.put('/course/isDelete/:id', CourseController.isdelete);
module.exports = router;