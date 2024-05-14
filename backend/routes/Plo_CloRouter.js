const express = require('express');
const router = express.Router();
const PLO_CLO = require('../controllers/Plo_CloController');

// Định nghĩa các route cho chương trình
router.get('/plo-clo', PLO_CLO.getAll);
router.post('/plo-clo/SaveOrDelete', PLO_CLO.SaveOrDelete);
router.get('/plo-clo/clo/:clo_id/getPlo', PLO_CLO.GetPloCloByCloId);

module.exports = router;