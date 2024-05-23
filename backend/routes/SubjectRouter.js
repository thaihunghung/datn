const express = require('express');
const SubjectController = require('../controllers/SubjectController');
const router = express.Router();


// Định nghĩa các route cho chương trình
router.get('/subject', SubjectController.index);
router.post('/subject', SubjectController.create);
router.get('/subject/:id', SubjectController.getByID);
router.get('/subject/:id/clo-ids', SubjectController.getArrayIDCloBySubjectId);
router.get('/subject/:id/chapter-ids', SubjectController.getArrayIDChapterBySubjectId);

router.put('/subject/:id', SubjectController.update);
router.delete('/subject/:id', SubjectController.delete);
router.delete('/subject/delete/multiple', SubjectController.deleteMultiple);

router.get('/subject/isDelete/true', SubjectController.isDeleteTotrue);
router.get('/subject/isDelete/false', SubjectController.isDeleteTofalse);

router.put('/subject/listId/soft-delete-multiple', SubjectController.softDeleteMultiple);
router.put('/subject/:id/toggle-soft-delete', SubjectController.toggleSoftDeleteById);
router.put('/subject/isDelete/:id', SubjectController.isDelete);

router.get('/subject/templates/post', SubjectController.getFormPost);
router.post('/subject/templates/update', SubjectController.getFormUpdate);
module.exports = router;