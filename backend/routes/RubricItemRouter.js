const express = require('express');
const RubricItemController = require('../controllers/RubricItemController');
const router = express.Router();

// Định nghĩa các route cho chương trình
router.get('/rubric-item', RubricItemController.index);
router.post('/rubric-item', RubricItemController.create);
router.get('/rubric-item/:id', RubricItemController.getByID);

router.post('/rubric-item/:rubric_id/check-score', RubricItemController.checkScore);

router.put('/rubric-item/:id', RubricItemController.update);
router.delete('/rubric-item/:id', RubricItemController.delete);

router.get('/rubric-item/isDelete/true', RubricItemController.isDeleteTotrue);
router.get('/rubric-item/isDelete/false', RubricItemController.isDeleteTofalse);

router.put('/rubric-item/isDelete/:id', RubricItemController.isdelete);
module.exports = router;

