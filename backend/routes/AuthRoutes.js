const express = require('express');
const AuthenticateController = require('../controllers/AuthenticateController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const TokenController = require('../controllers/TokenController');

const router = express.Router();

router.post('/register', AuthenticateController.register);
router.post('/login', AuthenticateController.login);
router.get('/user', ensureAuthenticated, AuthenticateController.getUser);
router.post('/token', TokenController.refreshToken);

module.exports = router;
