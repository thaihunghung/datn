const express = require('express');
const router = express.Router();
const PO = require('../controllers/PoController');

router.get('/pos', PO.index);
router.post('/po', PO.create);

router.get('/po/:id', PO.getByID);
router.put('/po/:id', PO.update);

router.delete('/po/:id', PO.delete);

router.delete('/pos/multiple', PO.deleteMultiple);

router.get('/pos/isDelete/true', PO.isDeleteToTrue);
router.get('/pos/isDelete/false', PO.isDeleteToFalse);
router.put('/pos/softDelete', PO.softDeleteMultiple);
router.put('/po/:id/softDelete', PO.toggleSoftDeleteById);
router.get('/po/templates/post', PO.getFormPost);
router.post('/po/templates/update', PO.getFormUpdate);

module.exports = router;

