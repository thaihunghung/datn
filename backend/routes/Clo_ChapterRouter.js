const express = require('express');
const router = express.Router();
const CLO_CHAPTER = require('../controllers/Clo_ChapterController');

router.get('/clo-chapter', CLO_CHAPTER.getAll);

router.post('/clo-chapter', CLO_CHAPTER.SaveCloChapter);

router.delete('/clo-chapter', CLO_CHAPTER.DeleteCloChapter);

router.get('/clo-chapter/clo/:clo_id/find-chapter', CLO_CHAPTER.GetChapterCloByCloId);

router.post('/clo-chapter/id_Chapters', CLO_CHAPTER.GetChapterCloByCloIds);

module.exports = router;
