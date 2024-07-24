const express = require('express');
const ChapterController = require('../controllers/ChapterController');
const router = express.Router();

router.get('/chapters', ChapterController.index);
router.post('/chapter', ChapterController.create);
router.get('/chapter/:chapter_id', ChapterController.getByID);
router.get('/chapter/subject/:subject_id', ChapterController.GetChapterBySubjectId);
router.get('/chapter/archive/subject/:subject_id', ChapterController.GetChapterArchiveBySubjectId);

router.put('/chapter/:chapter_id', ChapterController.update);
router.delete('/chapter/:chapter_id', ChapterController.delete);
router.delete('/chapters/delete/multiple', ChapterController.deleteMultiple);

router.get('/chapters/isDelete/true', ChapterController.isDeleteTotrue);
router.get('/chapters/isDelete/false', ChapterController.isDeleteTofalse);

router.put('/chapters/soft-delete-multiple', ChapterController.softDeleteMultiple);
router.put('/chapter/:chapter_id/soft-delete', ChapterController.toggleSoftDeleteById);

router.get('/chapter/templates/post', ChapterController.getFormPost);
router.post('/chapter/templates/update', ChapterController.getFormUpdate);

module.exports = router;
