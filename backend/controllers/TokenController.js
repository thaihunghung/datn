const jwt = require('jsonwebtoken');
const RefreshTokenModel = require('../models/RefreshTokenModel');
const TeacherModel = require('../models/TeacherModel');

const TokenController = {
  refreshToken: async (req, res) => {
    const { refreshToken } = req.cookies;

    console.log("refresh token ");

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token là bắt buộc' });
    }

    try {
      const storedToken = await RefreshTokenModel.findOne({ where: { token: refreshToken } });

      if (!storedToken || storedToken.revoked || storedToken.expired) {
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

      // Đánh dấu refresh token cũ là đã thu hồi và hết hạn
      storedToken.revoked = true;
      storedToken.expired = true;
      await storedToken.save();

      // Lưu refresh token mới vào database
      await RefreshTokenModel.create({ token: newRefreshToken, teacher_id: user.teacher_id });

      // Đặt token mới trong HTTP-only cookies
      res.cookie('accessToken', newAccessToken, { httpOnly: false, secure: true, sameSite: 'Strict', maxAge: 15 * 60 * 1000 });
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 });

      res.json({
        message: 'Làm mới token thành công'
      });
    } catch (error) {
      console.error(`Lỗi làm mới token: ${error.message}`);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  },

  revokeToken: async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token là bắt buộc' });
    }

    try {
      const storedToken = await RefreshTokenModel.findOne({ where: { token: refreshToken } });

      if (!storedToken) {
        return res.status(400).json({ message: 'Refresh token không hợp lệ' });
      }

      storedToken.revoked = true;
      await storedToken.save();

      res.json({ message: 'Token đã bị thu hồi' });
    } catch (error) {
      console.error(`Lỗi thu hồi token: ${error.message}`);
      res.status(500).json({ message: 'Lỗi server', error });
    }
  }
};

module.exports = TokenController;
