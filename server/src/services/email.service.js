const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendVerificationEmail = async (email, verificationToken, userName) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
  const htmlContent = `
    <h2>Email Verification</h2>
    <p>Hello ${userName},</p>
    <p>Please click the link below to verify your email:</p>
    <a href="${verificationLink}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
  `;

  return sendEmail(email, 'Email Verification', htmlContent);
};

const sendPasswordResetEmail = async (email, resetToken, userName) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  const htmlContent = `
    <h2>Password Reset Request</h2>
    <p>Hello ${userName},</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
  `;

  return sendEmail(email, 'Password Reset Request', htmlContent);
};

const sendWelcomeEmail = async (email, userName) => {
  const htmlContent = `
    <h2>Welcome to BeatNest!</h2>
    <p>Hello ${userName},</p>
    <p>Welcome to BeatNest - Your Music Hub!</p>
    <p>Start exploring and enjoying amazing music content.</p>
  `;

  return sendEmail(email, 'Welcome to BeatNest', htmlContent);
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
