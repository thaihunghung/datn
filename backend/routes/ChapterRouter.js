const express = require('express');
const ChapterController = require('../controllers/ChapterController');
const router = express.Router();

router.get('/chapters', ChapterController.index);
router.post('/chapter', ChapterController.create);
router.get('/chapter/:id', ChapterController.getByID);
router.put('/chapter/:id', ChapterController.update);
router.delete('/chapter/:id', ChapterController.delete);

router.delete('/chapters/multiple', ChapterController.deleteMultiple);
router.get('/chapters/isDelete/true', ChapterController.isDeleteTotrue);
router.get('/chapters/isDelete/false', ChapterController.isDeleteTofalse);
router.put('/chapters/softDelete', ChapterController.softDeleteMultiple);
router.put('/chapter/:id/softDelete', ChapterController.toggleSoftDeleteById);
router.get('/chapter/templates/post', ChapterController.getFormPost);
router.post('/chapter/templates/update', ChapterController.getFormUpdate);


// router.get('/chapter/subject/:subject_id', ChapterController.GetChapterBySubjectId);
// router.get('/chapter/archive/subject/:subject_id', ChapterController.GetChapterArchiveBySubjectId);
module.exports = router;
