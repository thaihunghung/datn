const jwt = require('jsonwebtoken');

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid access token' });
      }
      req.user = decoded;
      next();
    });
  }
};