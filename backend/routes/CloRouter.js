const express = require('express');
const CloController = require('../controllers/CloController');
const router = express.Router();

router.get('/clos', CloController.index);
router.post('/clo', CloController.create);
router.get('/clo/:id', CloController.getByID);
router.put('/clo/:id', CloController.update);
router.delete('/clo/:id', CloController.delete);
router.delete('/clos/multiple', CloController.deleteMultiple);
router.put('/clo/:id/softDelete', CloController.toggleSoftDeleteById);
router.get('/clos/isDelete/true', CloController.isDeleteTotrue);
router.get('/clos/isDelete/false', CloController.isDeleteTofalse);
router.put('/clos/softDelete', CloController.softDeleteMultiple);
router.get('/clo/templates/post', CloController.getFormPost);
router.post('/clo/templates/update', CloController.getFormUpdate);


// router.get('/clo/subject/:id', CloController.GetCloBySubjectId);
// router.get('/clo/archive/subject/:id', CloController.GetCloArchiveBySubjectId);
module.exports = router;
