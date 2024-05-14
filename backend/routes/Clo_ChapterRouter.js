const express = require('express');
const router = express.Router();
const CLO_CHAPTER = require('../controllers/Clo_ChapterController');

router.get('/clo-chapter', CLO_CHAPTER.getAll);
router.post('/clo-chapter/SaveOrDelete', CLO_CHAPTER.SaveOrDelete);
router.get('/clo-chapter/clo/:clo_id/getChapter', CLO_CHAPTER.GetChapterCloByCloId);

module.exports = router;
