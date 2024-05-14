const express = require('express');
const ChapterController = require('../controllers/ChapterController');
const router = express.Router();

// Định nghĩa các route cho chương trình
router.get('/chapter', ChapterController.index);
router.post('/chapter', ChapterController.create);
router.get('/chapter/:id', ChapterController.getByID);

router.get('/chapter/subject/:subject_id', ChapterController.GetChapterBySubjectId);

router.put('/chapter/:id', ChapterController.update);
router.delete('/chapter/:id', ChapterController.delete);

router.get('/chapter/isDelete/true', ChapterController.isDeleteTotrue);
router.get('/chapter/isDelete/false', ChapterController.isDeleteTofalse);

router.put('/chapter/isDelete/:id', ChapterController.isdelete);
module.exports = router;