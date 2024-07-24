const express = require('express');
const router = express.Router();
const PO = require('../controllers/PoController');

router.get('/pos', PO.index);
router.post('/po', PO.create);
router.get('/po/:po_id', PO.getByID);
router.put('/po/:po_id', PO.update);
router.delete('/po/:po_id', PO.delete);
router.delete('/pos/delete/multiple', PO.deleteMultiple);

router.get('/pos/isDelete/true', PO.isDeleteToTrue);
router.get('/pos/isDelete/false', PO.isDeleteToFalse);
router.put('/pos/soft-delete-multiple', PO.softDeleteMultiple);
router.put('/po/:po_id/soft-delete', PO.toggleSoftDeleteById);

router.get('/po/templates/post', PO.getFormPost);
router.post('/po/templates/update', PO.getFormUpdate);

module.exports = router;

