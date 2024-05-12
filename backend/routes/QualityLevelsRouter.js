const express = require('express');
const router = express.Router();
const qualityLevelsController = require('../controllers/QualityLevelsController');

// Định nghĩa các route cho chương trình
router.get('/quality-level', qualityLevelsController.index);
router.post('/quality-level', qualityLevelsController.create);

router.get('/quality-level/:id', qualityLevelsController.getByID);
router.put('/quality-level/:id', qualityLevelsController.update);
router.delete('/quality-level/:id', qualityLevelsController.delete);

router.get('/quality-level/isDelete/true', qualityLevelsController.isDeleteTotrue);
router.get('/quality-level/isDelete/false', qualityLevelsController.isDeleteTofalse);
router.put('/quality-level/isDelete/:id', qualityLevelsController.isdelete);
router.delete('/quality-level/rubric-item/:ItemsRubricId', qualityLevelsController.deleteByIdItemsRubric);

module.exports = router;