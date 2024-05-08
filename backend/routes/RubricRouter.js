const express = require('express');
const RubricController = require('../controllers/RubricController');
const router = express.Router();

// Định nghĩa các route cho chương trình
router.get('/rubric', RubricController.index);
router.post('/rubric', RubricController.create);
router.get('/rubric/:id', RubricController.getByID);

router.put('/rubric/:id', RubricController.update);
router.delete('/rubric/:id', RubricController.delete);

router.get('/rubric/isDelete/true', RubricController.isDeleteTotrue);
router.get('/rubric/isDelete/false', RubricController.isDeleteTofalse);

router.put('/rubric/isDelete/:id', RubricController.isdelete);
module.exports = router;