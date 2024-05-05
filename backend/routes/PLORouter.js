const express = require('express');
const router = express.Router();
const PLO = require('../controllers/PloController');

// Định nghĩa các route cho chương trình
router.get('/plo', PLO.index);
router.post('/plo', PLO.create);
router.get('/plo/:id', PLO.getByID);

router.put('/plo/:id', PLO.update);
router.delete('/plo/:id', PLO.delete);

router.get('/plo/isDelete/true', PLO.isDeleteTotrue);
router.get('/plo/isDelete/false', PLO.isDeleteTofalse);
router.put('/plo/isDelete/:id', PLO.isdelete);
module.exports = router;