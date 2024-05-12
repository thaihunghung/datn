const express = require('express');
const ClassController = require('../controllers/ClassController');
const router = express.Router();

// Định nghĩa các route cho chương trình
router.get('/class', ClassController.index);
router.post('/class', ClassController.create);
router.get('/class/:id', ClassController.getByID);

router.put('/class/:id', ClassController.update);
router.delete('/class/:id', ClassController.delete);

router.get('/class/isDelete/true', ClassController.isDeleteTotrue);
router.get('/class/isDelete/false', ClassController.isDeleteTofalse);

router.put('/class/isDelete/:id', ClassController.IsDelete);
module.exports = router;