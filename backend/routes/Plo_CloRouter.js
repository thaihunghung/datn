const express = require('express');
const router = express.Router();
const PLO_CLO = require('../controllers/Plo_CloController');

router.get('/plo-clo', PLO_CLO.getAll);
router.post('/plo-clo', PLO_CLO.SaveCloPlo);
router.post('/plo-clo/id_clos', PLO_CLO.GetPloCloByCloIds);
router.delete('/plo-clo', PLO_CLO.DeleteCloPlo);
router.get('/plo-clo/clo/:clo_id/find-plo', PLO_CLO.GetPloCloByCloId);

module.exports = router;
