const express = require('express');
const ChapterController = require('../controllers/ChapterController');
const router = express.Router();

router.get('/chapter', ChapterController.index);
router.post('/chapter', ChapterController.create);
router.get('/chapter/:id', ChapterController.getByID);
router.get('/chapter/subject/:subject_id', ChapterController.GetChapterBySubjectId);
router.get('/chapter/archive/subject/:subject_id', ChapterController.GetChapterArchiveBySubjectId);

router.put('/chapter/:id', ChapterController.update);
router.delete('/chapter/:id', ChapterController.delete);
router.delete('/chapter/delete/multiple', ChapterController.deleteMultiple);


router.get('/chapter/isDelete/true', ChapterController.isDeleteTotrue);

router.get('/chapter/isDelete/false', ChapterController.isDeleteTofalse);

router.put('/chapter/isDelete/:id', ChapterController.isdelete);

router.put('/chapter/listId/soft-delete-multiple', ChapterController.softDeleteMultiple);

router.put('/chapter/:id/toggle-soft-delete', ChapterController.toggleSoftDeleteById);

router.get('/chapter/templates/post', ChapterController.getFormPost);

router.post('/chapter/templates/update', ChapterController.getFormUpdate);


module.exports = router;
