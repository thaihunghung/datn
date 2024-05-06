const express = require('express');
const QuestionController = require('../controllers/QuestionController');
const router = express.Router();

// Định nghĩa các route cho chương trình
router.get('/question', QuestionController.index);
router.post('/question', QuestionController.create);
router.get('/question/:id', QuestionController.getByID);

router.put('/question/:id', QuestionController.update);
router.delete('/question/:id', QuestionController.delete);

router.get('/question/isDelete/true', QuestionController.isDeleteTotrue);
router.get('/question/isDelete/false', QuestionController.isDeleteTofalse);

router.put('/question/isDelete/:id', QuestionController.isdelete);
module.exports = router;