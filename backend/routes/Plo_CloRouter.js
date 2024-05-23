const express = require('express');
const router = express.Router();
const PLO_CLO = require('../controllers/Plo_CloController');

router.get('/plo-clo', PLO_CLO.getAll);

router.post('/plo-clo', PLO_CLO.SaveCloPlo);
router.delete('/plo-clo', PLO_CLO.DeleteCloPlo);

router.get('/plo-clo/clo/:clo_id/getPlo', PLO_CLO.GetPloCloByCloId);

router.post('/plo-clo/id_clos', PLO_CLO.GetPloCloByCloIds);

module.exports = router;
