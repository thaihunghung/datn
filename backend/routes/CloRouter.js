const express = require('express');
const CloController = require('../controllers/CloController');
const router = express.Router();

// Định nghĩa các route cho chương trình
router.get('/clo', CloController.index);
router.post('/clo', CloController.create);
router.get('/clo/:id', CloController.getByID);

router.put('/clo/:id', CloController.update);
router.delete('/clo/:id', CloController.delete);

router.get('/clo/isDelete/true', CloController.isDeleteTotrue);
router.get('/clo/isDelete/false', CloController.isDeleteTofalse);

router.put('/clo/isDelete/:id', CloController.isdelete);
module.exports = router;