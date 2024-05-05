const express = require('express');
const router = express.Router();
const PO_PLO = require('../controllers/Po_PloController');

// Định nghĩa các route cho chương trình
router.get('/po-plo', PO_PLO.getAll);
router.post('/po-plo/SaveOrDelete', PO_PLO.SaveOrDelete);

module.exports = router;