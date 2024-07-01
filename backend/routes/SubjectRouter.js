const express = require('express');
const SubjectController = require('../controllers/SubjectController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/subjects', ensureAuthenticated, SubjectController.index);
router.post('/subject', ensureAuthenticated, SubjectController.create);
router.get('/subject/:subject_id', ensureAuthenticated, SubjectController.getByID);

router.get('/subject/getSubjectIdByCourseId/:course_id', SubjectController.getByCourseId);


router.get('/subject/:subject_id/find-clo-ids', SubjectController.getArrayIDCloBySubjectId);
router.get('/subject/:subject_id/find-chapter-ids', SubjectController.getArrayIDChapterBySubjectId);
router.get('/subject/:subject_id/rubrics', SubjectController.getByrubricsbySubjectId);
router.get('/subject/:subject_id/rubrics/teacher/:teacher_id', SubjectController.getByrubricsbySubjectIdTeacherId); //


router.put('/subject/:subject_id', SubjectController.update);
router.delete('/subject/:subject_id', SubjectController.delete);
router.delete('/subjects/delete/multiple', SubjectController.deleteMultiple);

router.get('/subjects/isDelete/false', SubjectController.isDeleteTofalse);
router.get('/subjects/isDelete/true', SubjectController.isDeleteTotrue);


router.get('/subjects/teacher/:teacher_id', SubjectController.isDeleteTofalseByteacher);
router.get('/subjects/archive/teacher/:teacher_id', SubjectController.isDeleteTotrueByteacher);

router.put('/subjects/soft-delete-multiple', SubjectController.softDeleteMultiple);
router.put('/subject/:subject_id/soft-delete', SubjectController.toggleSoftDeleteById);

router.get('/subject/templates/post', SubjectController.getFormPost);
router.post('/subject/templates/update', SubjectController.getFormUpdate);


module.exports = router;