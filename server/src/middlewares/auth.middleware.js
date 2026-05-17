const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(ApiError.unauthorized('Access token is required'));
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return next(ApiError.unauthorized('Invalid or expired token'));
  }
};

module.exports = authenticateToken;
