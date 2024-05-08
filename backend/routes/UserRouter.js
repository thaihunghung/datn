const express = require('express');
const UserController = require('../controllers/UserController');
const router = express.Router();


// Định nghĩa các route
router.get('/user', UserController.index);
router.post('/user', UserController.create);
router.get('/user/:id', UserController.getByID);

router.put('/user/:id', UserController.update);
router.delete('/user/:id', UserController.delete);

router.get('/user/isDelete/true', UserController.isDeleteTotrue);
router.get('/user/isDelete/false', UserController.isDeleteTofalse);
router.put('/user/isDelete/:id', UserController.isDelete);
module.exports = router;