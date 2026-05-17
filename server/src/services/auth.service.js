const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');

const register = async (userData) => {
  const { email, password, firstName, lastName, role } = userData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  // Create new user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    role: role || 'user'
  });

  await user.save();

  // Generate token
  const token = generateToken({ id: user._id, email: user.email, role: user.role });

  return {
    user: user.toJSON(),
    token
  };
};

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = generateToken({ id: user._id, email: user.email, role: user.role });

  return {
    user: user.toJSON(),
    token
  };
};

const verifyEmail = async (token) => {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired verification token');
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();

  return user;
};

const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  // Generate reset token
  const resetToken = generateToken({ id: user._id }, '1h');
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

  await user.save();

  return resetToken;
};

const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return user;
};

module.exports = {
  register,
  login,
  verifyEmail,
  requestPasswordReset,
  resetPassword
};
