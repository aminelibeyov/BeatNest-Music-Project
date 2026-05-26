const ApiError = require('../utils/ApiError');
const { logger } = require('./logger.middleware');

const errorHandler = (err, req, res, next) => {
  logger.error(`[${new Date().toISOString()}] ${err.message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  let error = err;

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    error = new ApiError(400, 'Validation Error', messages);
  }

  // Handle Mongoose cast error
  if (err.name === 'CastError') {
    error = new ApiError(400, 'Invalid ID format');
  }

  // Handle duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    error = new ApiError(409, `${field} already exists`);
  }

  // Handle Joi validation error
  if (err.isJoi) {
    const messages = err.details.map(d => d.message);
    error = new ApiError(400, 'Validation Error', messages);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token has expired');
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: error.errors || [],
    timestamp: new Date().toISOString()
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  errorHandler,
  asyncHandler
};
