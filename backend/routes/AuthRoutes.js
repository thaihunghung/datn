// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const AuthenticateController = require('../controllers/AuthenticateController');
const TokenController = require('../controllers/TokenController'); // Import TokenController
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const passport = require('passport');

router.post('/register', AuthenticateController.register);
router.post('/login', AuthenticateController.login);
router.post('/refresh-token', TokenController.refreshToken); 
router.post('/revoke-token', TokenController.revokeToken); 
router.get('/user', ensureAuthenticated, AuthenticateController.getUser);
router.post('/logout', ensureAuthenticated, AuthenticateController.logout);

module.exports = router;
