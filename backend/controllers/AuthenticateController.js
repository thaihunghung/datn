const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TeacherModel = require('../models/TeacherModel');
const RefreshTokenModel = require('../models/RefreshTokenModel'); // Import model RefreshToken

const AuthenticateController = {
  register: async (req, res) => {
    const { email, password, name, teacherCode, typeTeacher } = req.body;
    try {
      const existingUser = await TeacherModel.findOne({ where: { teacherCode } });
      if (existingUser) {
        return res.status(400).json({ message: 'Teacher code đã được sử dụng' });
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
      console.log(`Đã đăng ký người dùng mới: ${newUser.email}`);
      res.status(201).json(newUser);
    } catch (error) {
      console.error(`Lỗi đăng ký: ${error.message}`);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  },

  login: async (req, res) => {
    const { teacherCode, password } = req.body;
    console.log(req.body)
    try {
      const user = await TeacherModel.findOne({ where: { teacherCode } });
      if (!user) {
        return res.status(400).json({ message: 'Teacher code hoặc mật khẩu không đúng' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Teacher code hoặc mật khẩu không đúng' });
      }

      const payload = { id: user.teacher_id };
      const accessToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '15m' });
      const refreshToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '7d' });

      // Thu hồi và hết hạn tất cả các refresh token cũ của người dùng
      await RefreshTokenModel.update(
        { revoked: true, expired: true },
        { where: { teacher_id: user.teacher_id } }
      );

      // Lưu refresh token mới vào database
      await RefreshTokenModel.create({ token: refreshToken, teacher_id: user.teacher_id });

      // Đặt token trong HTTP-only cookies
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

      console.log(`Đăng nhập thành công cho người dùng: ${user.name}`);
      res.json({
        message: 'Đăng nhập thành công',
        accessToken,
        refreshToken
      });
    } catch (error) {
      console.error(`Lỗi đăng nhập: ${error.message}`);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await TeacherModel.findByPk(req.user.teacher_id, {
        attributes: ['teacher_id','email', 'permission', 'name', 'teacherCode', 'typeTeacher']
      });

      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
      }

      res.json(user);
    } catch (error) {
      console.error(`Lỗi lấy thông tin người dùng: ${error.message}`);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  },
  logout: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        // Thu hồi refresh token trong cơ sở dữ liệu
        await RefreshTokenModel.update(
          { revoked: true },
          { where: { token: refreshToken } }
        );
      }

      // Xóa cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.json({ message: 'Đăng xuất thành công' });
    } catch (error) {
      console.error(`Lỗi đăng xuất: ${error.message}`);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  }
};

module.exports = AuthenticateController;
