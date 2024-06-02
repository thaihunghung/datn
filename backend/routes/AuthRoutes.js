const express = require('express');
const AuthenticateController = require('../controllers/AuthenticateController');
const { ensureAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', AuthenticateController.register);
router.post('/login', AuthenticateController.login);
router.get('/user', ensureAuthenticated, AuthenticateController.getUser);


module.exports = router;
