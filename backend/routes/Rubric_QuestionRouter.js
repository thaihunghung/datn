const express = require('express');
const router = express.Router();
const rubric_question = require('../controllers/Rubric_QuestionController');

router.get('/rubric_question', rubric_question.getAll);
router.post('/rubric_question/SaveOrDelete', rubric_question.SaveOrDelete);

module.exports = router;