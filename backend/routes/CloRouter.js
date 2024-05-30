const express = require('express');
const CloController = require('../controllers/CloController');
const router = express.Router();

router.get('/clos', CloController.index);
router.post('/clo', CloController.create);
router.get('/clo/:clo_id', CloController.getByID);

router.get('/clo/subject/:subject_id', CloController.GetCloBySubjectId);
router.get('/clo/archive/subject/:subject_id', CloController.GetCloArchiveBySubjectId);

router.put('/clo/:clo_id', CloController.update);
router.delete('/clo/:clo_id', CloController.delete);
router.delete('/clos/delete/multiple', CloController.deleteMultiple);

router.get('/clos/isDelete/true', CloController.isDeleteTotrue);
router.get('/clos/isDelete/false', CloController.isDeleteTofalse);

router.put('/clos/soft-delete-multiple', CloController.softDeleteMultiple);
router.put('/clo/:clo_id/soft-delete', CloController.toggleSoftDeleteById);

router.get('/clo/templates/post', CloController.getFormPost);
router.post('/clo/templates/update', CloController.getFormUpdate);

module.exports = router;
