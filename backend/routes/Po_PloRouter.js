const express = require('express');
const router = express.Router();
const PO_PLO = require('../controllers/Po_PloController');

router.get('/po-plo', PO_PLO.getAll);
router.post('/po-plo', PO_PLO.SavePoPlo);
router.delete('/po-plo', PO_PLO.DeletePoPlo);

module.exports = router;
