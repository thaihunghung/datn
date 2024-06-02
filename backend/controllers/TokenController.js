// controllers/TokenController.js
const jwt = require('jsonwebtoken');
const RefreshTokenModel = require('../models/RefreshTokenModel');
const TeacherModel = require('../models/TeacherModel');

const TokenController = {
  refreshToken: async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token là bắt buộc' });
    }

    try {
      const storedToken = await RefreshTokenModel.findOne({ where: { token: refreshToken } });
      if (!storedToken) {
        return res.status(400).json({ message: 'Refresh token không hợp lệ' });
      }

      const decoded = jwt.verify(refreshToken, 'your_jwt_secret');
      const user = await TeacherModel.findByPk(decoded.id);

      if (!user) {
        return res.status(400).json({ message: 'Người dùng không hợp lệ' });
      }

      const payload = { id: user.teacher_id };
      const newAccessToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '15m' });
      const newRefreshToken = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '7d' });

      // Cập nhật refresh token trong database
      storedToken.token = newRefreshToken;
      await storedToken.save();

      // Đặt token mới trong HTTP-only cookies
      res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

      res.json({
        message: 'Làm mới token thành công'
      });
    } catch (error) {
      console.error(`Lỗi làm mới token: ${error.message}`);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  }
};

module.exports = TokenController;
