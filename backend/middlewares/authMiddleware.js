const jwt = require('jsonwebtoken');
const RefreshTokenModel = require('../models/RefreshTokenModel');
const TeacherModel = require('../models/TeacherModel');

module.exports = {
  ensureAuthenticated: async (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user = await TeacherModel.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid access token' });
      }

      // Kiểm tra refresh token chưa bị thu hồi và hết hạn
      const refreshToken = req.cookies.refreshToken;
      const storedToken = await RefreshTokenModel.findOne({ where: { token: refreshToken, userId: user.teacher_id } });
      if (!storedToken || storedToken.revoked || storedToken.expired) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid access token' });
    }
  }
};
