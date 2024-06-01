const bcrypt = require('bcrypt');
const passport = require('passport');
const TeacherModel = require('../models/TeacherModel');

const AuthenticateController = {
  register: async (req, res) => {
    const { email, password } = req.body;
    try {
      const existingUser = await TeacherModel.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await TeacherModel.create({ email, password: hashedPassword });
      console.log(`Registered new user: ${newUser.email}`);
      console.log(`Hashed Password: ${hashedPassword}`); // Debug statement
      res.status(201).json(newUser);
    } catch (error) {
      console.error(`Registration error: ${error.message}`);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  login: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error(`Login error: ${err.message}`); // Debug statement
        return res.status(500).json({ message: 'Server error', err });
      }
      if (!user) {
        console.log('Login failed: Invalid email or password'); // Debug statement
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error(`Login error: ${err.message}`); // Debug statement
          return res.status(500).json({ message: 'Server error', err });
        }
        console.log(`Login successful for user: ${user.email}`); // Debug statement
        res.json({ message: 'Login successful', user });
      });
    })(req, res, next);
  },

  getUser: (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json(req.user);
  }
};

module.exports = AuthenticateController;
