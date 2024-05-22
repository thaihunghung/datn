const express = require('express');
const CloController = require('../controllers/CloController');
const router = express.Router();

router.get('/clo', CloController.index);
router.post('/clo', CloController.create);
router.get('/clo/:id', CloController.getByID);
router.get('/clo/subject/:subject_id', CloController.GetCloBySubjectId);
router.get('/clo/archive/subject/:subject_id', CloController.GetCloArchiveBySubjectId);

router.put('/clo/:id', CloController.update);
router.delete('/clo/:id', CloController.delete);
router.delete('/clo/delete/multiple', CloController.deleteMultiple);

router.get('/clo/isDelete/true', CloController.isDeleteTotrue);
router.get('/clo/isDelete/false', CloController.isDeleteTofalse);
router.put('/clo/isDelete/:id', CloController.isdelete);

router.put('/clo/listId/soft-delete-multiple', CloController.softDeleteMultiple);
router.put('/clo/:id/toggle-soft-delete', CloController.toggleSoftDeleteById);

router.get('/clo/templates/post', CloController.getFormPost);
router.post('/clo/templates/update', CloController.getFormUpdate);

module.exports = router;
