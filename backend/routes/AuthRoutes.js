// routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const AuthenticateController = require('../controllers/AuthenticateController');
const TokenController = require('../controllers/TokenController'); // Import TokenController
const { ensureAuthenticated } = require('../middlewares/authMiddleware');
const passport = require('passport');

router.post('/register', AuthenticateController.register);
router.post('/login', AuthenticateController.login);
router.post('/token', TokenController.refreshToken); // Thêm route để làm mới token
router.post('/revoke-token', TokenController.revokeToken); // Thêm route để thu hồi token
router.get('/user', ensureAuthenticated, AuthenticateController.getUser);

module.exports = router;
