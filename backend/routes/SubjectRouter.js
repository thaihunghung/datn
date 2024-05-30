const express = require('express');
const SubjectController = require('../controllers/SubjectController');
const router = express.Router();

// Định nghĩa các route cho chương trình

router.get('/subjects', SubjectController.index);
router.post('/subject', SubjectController.create);
router.get('/subject/:subject_id', SubjectController.getByID);
router.get('/subject/:subject_id/find-clo-ids', SubjectController.getArrayIDCloBySubjectId);
router.get('/subject/:subject_id/find-chapter-ids', SubjectController.getArrayIDChapterBySubjectId);

router.put('/subject/:subject_id', SubjectController.update);
router.delete('/subject/:subject_id', SubjectController.delete);
router.delete('/subjects/delete/multiple', SubjectController.deleteMultiple);

router.get('/subjects/isDelete/true', SubjectController.isDeleteTotrue);
router.get('/subjects/isDelete/false', SubjectController.isDeleteTofalse);

router.put('/subjects/soft-delete-multiple', SubjectController.softDeleteMultiple);
router.put('/subject/:subject_id/soft-delete', SubjectController.toggleSoftDeleteById);

router.get('/subject/templates/post', SubjectController.getFormPost);
router.post('/subject/templates/update', SubjectController.getFormUpdate);

module.exports = router;