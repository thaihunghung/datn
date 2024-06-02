// controllers/AuthenticateController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TeacherModel = require('../models/TeacherModel');

const AuthenticateController = {
  register: async (req, res) => {
    const { email, password, name, teacherCode, typeTeacher } = req.body;
    try {
      const existingUser = await TeacherModel.findOne({ where: { teacherCode } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const data = {
        email,
        password: hashedPassword,
        name,
        teacherCode,
        typeTeacher
      };
      const newUser = await TeacherModel.create(data);
      console.log(`Registered new user: ${newUser.email}`);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(`Registration error: ${error.message}`);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  login: async (req, res) => {
    const { teacherCode, password } = req.body;
    try {
      const user = await TeacherModel.findOne({ where: { teacherCode } });
      if (!user) {
        return res.status(400).json({ message: 'Invalid teacherCode or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid teacherCode or password' });
      }

      const payload = { id: user.teacher_id };
      const accessToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '2m' });
      const refreshToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '7d' });

      console.log(`Login successful for user: ${user.name}`);
      res.json({
        message: 'Login successful',
        user,
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error(`Login error: ${error.message}`);
      res.status(500).json({ message: 'Server error', error });
    }
  },

  getUser: (req, res) => {
    res.json(req.user);
  }
};

module.exports = AuthenticateController;
