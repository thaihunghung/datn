const express = require('express');
const TeacherController = require('../controllers/TeacherController');
const router = express.Router();
const checkPermission = require('../middlewares/permissionMiddleware');


router.get('/teacher', checkPermission(2), TeacherController.index);
router.get('/teachers-store', checkPermission(2), TeacherController.getAllStore);
router.get('/teacher/:id', checkPermission(3), TeacherController.getByID);
router.post('/teacher', checkPermission(3), TeacherController.create);
router.put('/teacher/:id', TeacherController.update);

router.patch('/teacher/:id/block', checkPermission(3), TeacherController.blockTeacher);
router.patch('/teachers/block', checkPermission(3), TeacherController.blockTeachers);
router.patch('/teacher/:id/unblock', checkPermission(3), TeacherController.unblockTeacher);
router.patch('/teachers/unblock', checkPermission(3), TeacherController.unblockTeachers);
router.patch('/teachers/:id/delete', checkPermission(3), TeacherController.deleteTeacher);
router.patch('/teachers/delete', checkPermission(3), TeacherController.deleteTeachers);
router.patch('/teachers/:id/restore', checkPermission(3), TeacherController.restoreTeacher);

router.get('/teacher/template/excel', TeacherController.getFormTeacher);
router.post('/teacher/template/data', TeacherController.getFormTeacherWithData);

module.exports = router;
