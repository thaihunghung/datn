const express = require('express');
const passport = require('../config/passportConfig');
const AuthenticateController = require('../controllers/AuthenticateController');

const router = express.Router();

router.post('/register', AuthenticateController.register);
router.post('/login', AuthenticateController.login);
router.get('/user', AuthenticateController.getUser);


module.exports = router;
