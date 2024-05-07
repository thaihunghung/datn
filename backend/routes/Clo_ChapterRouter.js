const express = require('express');
const router = express.Router();
const CLO_CHAPTER = require('../controllers/Clo_ChapterController');

router.get('/clo-chapter', CLO_CHAPTER.getAll);
router.post('/clo-chapter/SaveOrDelete', CLO_CHAPTER.SaveOrDelete);

module.exports = router;