const authService = require('../services/auth.service');
const emailService = require('../services/email.service');
const { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } = require('../validations/auth.validation');
const ApiError = require('../utils/ApiError');

const register = async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return next(ApiError.badRequest(error.details[0].message));
    }

    const result = await authService.register(value);

    // Send verification email with actual token
    await emailService.sendVerificationEmail(
      result.user.email,
      result.emailVerificationToken,
      result.user.firstName
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: {
        user: result.user,
        token: result.token
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return next(ApiError.badRequest(error.details[0].message));
    }

    const result = await authService.login(value.email, value.password);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);

    if (error) {
      return next(ApiError.badRequest(error.details[0].message));
    }

    const resetToken = await authService.requestPasswordReset(value.email);

    // Send password reset email
    await emailService.sendPasswordResetEmail(
      value.email,
      resetToken,
      'User'
    );

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { error, value } = resetPasswordSchema.validate(req.body);

    if (error) {
      return next(ApiError.badRequest(error.details[0].message));
    }

    const user = await authService.resetPassword(token, value.password);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;

    const user = await authService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail
};
