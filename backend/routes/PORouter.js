const express = require('express');
const router = express.Router();
const PO = require('../controllers/PoController');

// Định nghĩa các route cho chương trình
router.get('/po', PO.index);
router.post('/po', PO.create);

router.get('/po/:id', PO.getByID);

router.put('/po/:id', PO.update);
router.delete('/po/:id', PO.delete);

router.get('/po/isDelete/true', PO.isDeleteTotrue);
router.get('/po/isDelete/false', PO.isDeleteTofalse);
router.put('/po/isDelete/:id', PO.isdelete);
module.exports = router;